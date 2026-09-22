import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL as string,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  sslcommerz: {
    storeId: process.env.SSLCOMMERZ_STORE_ID as string,
    storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD as string,
    isLive: process.env.SSLCOMMERZ_IS_LIVE === "true",
    successUrl: process.env.SSLCOMMERZ_SUCCESS_URL || "http://localhost:5000/api/v1/payments/success",
    failUrl: process.env.SSLCOMMERZ_FAIL_URL || "http://localhost:5000/api/v1/payments/fail",
    cancelUrl: process.env.SSLCOMMERZ_CANCEL_URL || "http://localhost:5000/api/v1/payments/cancel",
    ipnUrl: process.env.SSLCOMMERZ_IPN_URL || "http://localhost:5000/api/v1/payments/ipn",
  },
};
