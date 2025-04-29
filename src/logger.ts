import winston from "winston";

const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const logger = winston.createLogger({
  level: LOG_LEVEL,
  transports: [
    new winston.transports.File({
      filename: "logs/err.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/debug.log",
      level: "debug",
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

export default logger;
