import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;

  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      SALT_OR_ROUNDS: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      NEXTAUTH_SECRET: string;
      APP_URL: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_SECURE: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      EMAIL_FROM: string;
      ADMIN_CREATION_PASSWORD: string;
      XENDIT_SECRET_KEY: string;
    }
  }
}
