import dotenv from 'dotenv'
dotenv.config()

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hassan_portfolio',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieExpiresIn: parseInt(process.env.COOKIE_EXPIRES_IN || '7', 10),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'Hassan Noor <noreply@hassannoor.dev>',
    to: process.env.EMAIL_TO || 'hassannoor2309@gmail.com',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
}

export default env