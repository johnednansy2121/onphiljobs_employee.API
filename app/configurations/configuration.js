module.exports = Configuration = {
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_KEY: process.env.JWT_KEY,
    MAILING_TYPE: process.env.MAILING_TYPE,
    AWS_SES_ACCESS_KEY_ID: process.env.AWS_SES_ACCESS_KEY_ID,
    AWS_SES_SECRET_ACCESS_KEY: process.env.AWS_SES_SECRET_ACCESS_KEY,
    AWS_SES_REGION: process.env.AWS_SES_REGION,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASS: process.env.GMAIL_PASS,
    CLIENT_URL: process.env.CLIENT_URL,
    S3_ACCESSKEY: process.env.S3_ACCESSKEY,
    S3_SECRETKEY: process.env.S3_SECRETKEY,
    S3_REGION: process.env.S3_REGION,
    BUCKET_NAME: process.env.BUCKET_NAME,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    NODE_ENVIRONMENT: process.env.NODE_ENVIRONMENT,
    EMAIL_RECIPIENT: process.env.EMAIL_RECIPIENT
}
