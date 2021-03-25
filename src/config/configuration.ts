const env = process.env;

export default () => ({
    api: {
      port: parseInt(env.API_PORT, 10),
    },
    gateway: {
      port: parseInt(env.GATEWAY_PORT, 10),
    },
    client: {
      host: env.CLIENT_HOST,
    },
    version: {
      prefix: env.VERSION_PREFIX,
      full: env.VERSION_FULL
    },
    database: {
      host: env.DATABASE_HOST,
      port: parseInt(env.DATABASE_PORT, 10),
      user: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      authDb: env.DATABASE_AUTH_DB,
      db: env.DATABASE_DB
    },
    jwt: {
      issuer: env.JWT_ISSUER,
      secret: env.JWT_SECRET,
      tokenExpiration: env.JWT_TOKEN_EXPIRATION,
      refreshTokenExpiration: env.JWT_REFRESH_TOKEN_EXPIRATION
    }
});