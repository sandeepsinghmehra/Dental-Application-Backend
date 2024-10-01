import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

export default {
    // General
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    CLIENT_URL: process.env.CLIENT_URL,

    // Database
    MONGO_URI: process.env.MONGO_URI,

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ADMIN_SECRET: process.env.JWT_ADMIN_SECRET,

    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_SERVICE_ID: process.env.TWILIO_SERVICE_ID,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

    // CLOUDINARY
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    // Paypal Payment
    PAYPAL_BASE_URL: process.env.PAYPAL_BASE_URL,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,

    // Nativ App base url
    APP_CLIENT_URL: process.env.APP_CLIENT_URL,
}