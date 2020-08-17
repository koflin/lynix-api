const env = process.env;

export default () => ({
    port: parseInt(env.API_PORT, 10),
    version: {
        prefix: env.VERSION_PREFIX,
        full: env.VERSION_FULL
    },
    database: {
      host: env.DATABASE_HOST,
      port: parseInt(env.DATABASE_PORT, 10)
    }
});