import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  nodeEnv: getEnv("NODE_ENV", "development"),
  port: Number(getEnv("PORT", "4000")),
  dbHost: getEnv("DB_HOST", "localhost"),
  dbPort: Number(getEnv("DB_PORT", "5433")),
  dbName: getEnv("DB_NAME", "habita"),
  dbUser: getEnv("DB_USER", "postgres"),
  dbPassword: getEnv("DB_PASSWORD", "postgres"),
  AUTH0_AUDIENCE: getEnv("AUTH0_AUDIENCE", "https://habita-backend"),
  AUTH0_ISSUER_BASE_URL: getEnv("AUTH0_ISSUER_BASE_URL", "https://sironi.us.auth0.com")
};
