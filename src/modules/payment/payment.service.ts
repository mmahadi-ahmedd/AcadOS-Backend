import SSLCommerzPayment from "sslcommerz-lts";
import { randomUUID } from "crypto";
import prisma from "../../config/prisma";
import AppError from "../../utils/AppError";
import { config } from "../../config/env";

const getSslcz = () =>
  new SSLCommerzPayment(config.sslcommerz.storeId, config.sslcommerz.storePassword, config.sslcommerz.isLive);

const initiatePayment = async (studentUserId: string, feeId: string) => {
  const student = await prisma.student.findUnique({ where: { userId: studentUserId }, include: { user: true } });
  if (!student) throw new AppError(404, "Student profile not found.");

  const fee = await prisma.fee.findFirst({ where: { id: feeId, studentId: student.id } });
  if (!fee) throw new AppError(404, "Fee not found.");
  if (fee.status === "PAID") throw new AppError(400, "This fee has already been paid.");

  const tranId = `ACADOS-${randomUUID()}`;

  const payment = await prisma.payment.create({
    data: {
      feeId: fee.id,
      provider: "SSLCOMMERZ",
      transactionId: tranId,
      amount: fee.amount,
      status: "PENDING",
    },
  });

  const sslData = {
    total_amount: fee.amount,
    currency: "BDT",
    tran_id: tranId,
    success_url: `${config.sslcommerz.successUrl}/${tranId}`,
    fail_url: `${config.sslcommerz.failUrl}/${tranId}`,
    cancel_url: `${config.sslcommerz.cancelUrl}/${tranId}`,
    ipn_url: config.sslcommerz.ipnUrl,
    shipping_method: "NA",
    product_name: "Semester Fee",
    product_category: "Education",
    product_profile: "general",
    cus_name: student.user.name,
    cus_email: student.user.email,
    cus_add1: "N/A",
    cus_city: "N/A",
    cus_postcode: "0000",
    cus_country: "Bangladesh",
    cus_phone: student.user.phone || "0000000000",
    ship_name: "N/A",
    ship_add1: "N/A",
    ship_city: "N/A",
    ship_postcode: "0000",
    ship_country: "Bangladesh",
  };

  const sslcz = getSslcz();
  const apiResponse = await sslcz.init(sslData);

  if (!apiResponse?.GatewayPageURL) {
    throw new AppError(502, "Failed to initiate payment session with SSLCommerz.");
  }

  return { gatewayUrl: apiResponse.GatewayPageURL, paymentId: payment.id, transactionId: tranId };
};

const handleSuccess = async (transactionId: string) => {
  const payment = await prisma.payment.findUnique({ where: { transactionId } });
  if (!payment) throw new AppError(404, "Payment not found.");

  // In production: call sslcz.validate({ val_id }) with the val_id SSLCommerz sends
  // in the success callback body to verify the transaction before trusting it.
  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({ where: { transactionId }, data: { status: "PAID" } });
    await tx.fee.update({ where: { id: payment.feeId }, data: { status: "PAID" } });
    return updated;
  });
};

const handleFail = async (transactionId: string) => {
  const payment = await prisma.payment.findUnique({ where: { transactionId } });
  if (!payment) throw new AppError(404, "Payment not found.");
  return prisma.payment.update({ where: { transactionId }, data: { status: "FAILED" } });
};

const handleCancel = async (transactionId: string) => {
  const payment = await prisma.payment.findUnique({ where: { transactionId } });
  if (!payment) throw new AppError(404, "Payment not found.");
  return prisma.payment.update({ where: { transactionId }, data: { status: "FAILED" } });
};

// IPN (Instant Payment Notification) - SSLCommerz's server-to-server webhook.
// This is the authoritative confirmation; success_url alone can be spoofed by the browser.
const handleIpn = async (payload: { tran_id: string; val_id: string; status: string }) => {
  const sslcz = getSslcz();
  const validation = await sslcz.validate({ val_id: payload.val_id });

  const payment = await prisma.payment.findUnique({ where: { transactionId: payload.tran_id } });
  if (!payment) throw new AppError(404, "Payment not found.");

  const isValid = validation?.status === "VALID" || validation?.status === "VALIDATED";

  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { transactionId: payload.tran_id },
      data: { status: isValid ? "PAID" : "FAILED" },
    });
    if (isValid) {
      await tx.fee.update({ where: { id: payment.feeId }, data: { status: "PAID" } });
    }
    return updated;
  });
};

const getPaymentById = async (id: string) => {
  const payment = await prisma.payment.findUnique({ where: { id }, include: { fee: true } });
  if (!payment) throw new AppError(404, "Payment not found.");
  return payment;
};

export const PaymentService = { initiatePayment, handleSuccess, handleFail, handleCancel, handleIpn, getPaymentById };
