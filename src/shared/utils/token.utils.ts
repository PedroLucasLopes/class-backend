import jwt from "jsonwebtoken";

export const generateAcessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "30d",
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "60d",
  });
};
