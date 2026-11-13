import dotenv from 'dotenv';

dotenv.config();


export const DATABASE_URL: string = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/your_db';
export const PORT: number = Number(process.env.PORT) || 3000;
export const API_VERSION: string = process.env.API_VERSION || 'v1';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'your_jwt_secret_key';
export const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key';
export const SALT: number = Number(process.env.SALT) || 10;