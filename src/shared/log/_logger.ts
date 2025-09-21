import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      // Envia logs para o console
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ level, message, ...meta }) => {
          return `[${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta) : ""
          }`;
        })
      ),
    }),
    new winston.transports.File({
      filename: "app.log",
      level: "info",
    }),
  ],
});
