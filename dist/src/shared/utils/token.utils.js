import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};
export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "60d",
    });
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};
export const generateResetToken = async () => {
    const randomString = Math.random().toString(36).substring(2, 15);
    const token = await bcrypt.hash(randomString, 10);
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return { token, expiry };
};
