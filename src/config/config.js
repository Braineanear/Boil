import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({ path: 'config.env' });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    DATABASE_CONNECTION: Joi.string().required().description('MongoDB URL'),
    DATABASE_PASSWORD: Joi.string().required().description('MongoDB Password'),
    JWT_SECRET: Joi.string().required().description('JWT Secret Key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('Minutes After Which Access Tokens Expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('Days After Which Refresh Tokens Expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('Minutes After Which Reset Password Token Expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('Minutes After Which Verify Email Token Expires'),
    SMTP_HOST: Joi.string().description('Server That Will Send The Emails'),
    SMTP_PORT: Joi.number().description('Port to Connect to The Email Server'),
    SMTP_USERNAME: Joi.string().description('Username For Email Server'),
    SMTP_PASSWORD: Joi.string().description('Password For Email Server'),
    EMAIL_FROM: Joi.string().description(
      'The From Field in The Emails Sent By The App'
    ),
    CLOUD_NAME: Joi.string().description('Cloud Name'),
    CLOUD_API_KEY: Joi.string().description('Cloud API Key'),
    CLOUD_API_SECRET: Joi.string().description('Cloud API Secret')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  url: {
    production: envVars.SERVER_URL_PROD,
    development: envVars.SERVER_URL_DEV
  },
  db: {
    url: envVars.DATABASE_CONNECTION,
    password: envVars.DATABASE_PASSWORD
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD
      }
    },
    from: envVars.EMAIL_FROM
  },
  cloud: {
    name: envVars.CLOUD_NAME,
    api_key: envVars.CLOUD_API_KEY,
    api_secret: envVars.CLOUD_API_SECRET
  },
  google: {
    clientID: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: envVars.GOOGLE_CALLBACK_URL
  },
  facebook: {
    appID: envVars.FACEBOOK_APP_ID,
    secret: envVars.FACEBOOK_SECRET,
    callbackURL: envVars.FACEBOOK_CALLBACK_URL
  }
};

export default config;
