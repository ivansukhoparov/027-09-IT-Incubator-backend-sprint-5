import { config } from 'dotenv';

config();

export type EnvironmentVariable = { [key: string]: string | undefined };
export type EnvironmentsTypes = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION' | 'TESTING';
export const Environments = ['DEVELOPMENT', 'STAGING', 'PRODUCTION', 'TESTING'];

export class EnvironmentSettings {
  constructor(private env: EnvironmentsTypes) {}

  getEnv() {
    return this.env;
  }

  isProduction() {
    return this.env === 'PRODUCTION';
  }

  isStaging() {
    return this.env === 'STAGING';
  }

  isDevelopment() {
    return this.env === 'DEVELOPMENT';
  }

  isTesting() {
    return this.env === 'TESTING';
  }
}

class APISettings {
  // Application
  public readonly APP_PORT: number;

  // Database
  public readonly DB_TYPE: string;
  public readonly MONGO_CONNECTION_URI: string;
  public readonly MONGO_DB_NAME: string;

  // Email sender
  EMAIL_SERVICE: string = 'gmail';
  EMAIL_LOGIN: string;
  EMAIL_PASSWORD: string;
  SEND_EMAIL_FROM: string = '"Pan-Pal" <no-reply@panpal.com>';

  // Tokens
  JWT_SECRET_KEY: string;
  REFRESH_TOKEN_EXPIRATION_TIME = '20s';
  ACCESS_TOKEN_EXPIRATION_TIME = '10s';
  EMAIL_CONFIRMATION_EXPIRATION_TIME = '30h';
  RECOVERY_TOKEN_EXPIRATION_TIME = '30d';

  constructor(private readonly envVariables: EnvironmentVariable) {
    // Application
    this.APP_PORT = this.getNumberOrDefault(envVariables.APP_PORT, 7840);

    // Database
    this.DB_TYPE = envVariables.DB_TYPE;
    this.MONGO_CONNECTION_URI = envVariables.MONGO_CONNECTION_URI; //?? 'mongodb://0.0.0.0:27017';
    this.MONGO_DB_NAME = envVariables.MONGO_DB_NAME;
    // Email sender
    this.EMAIL_LOGIN = envVariables.EMAIL_LOGIN;
    this.EMAIL_PASSWORD = envVariables.EMAIL_PASSWORD;
    this.JWT_SECRET_KEY = envVariables.JWT_SECRET_KEY;
  }

  private getNumberOrDefault(value: string, defaultValue: number): number {
    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      return defaultValue;
    }

    return parsedValue;
  }
}

class AppSettings {
  constructor(
    public env: EnvironmentSettings,
    public api: APISettings,
  ) {}
}

const env = new EnvironmentSettings((Environments.includes(process.env.ENV?.trim()) ? process.env.ENV.trim() : 'DEVELOPMENT') as EnvironmentsTypes);

const api = new APISettings(process.env);
export const appSettings = new AppSettings(env, api);
