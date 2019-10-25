const config = {
  type: process.env.TYPEORM_CONNECTION || 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: process.env.TYPEORM_PORT || 5432,
  username: process.env.TYPEORM_USERNAME || 'root',
  password: process.env.TYPEORM_PASSWORD || 'password',
  database: process.env.TYPEORM_DATABASE || 'microdao',
  synchronize: process.env.TYPEORM_SYNCHRONIZE || true,
  logging: process.env.TYPEORM_LOGGING || false,
  entities: process.env.TYPEORM_ENTITIES
    ? [process.env.TYPEORM_ENTITIES]
    : ['src/entities/**/*.ts'],
  migrations: process.env.TYPEORM_MIGRATIONS
    ? [process.env.TYPEORM_MIGRATIONS]
    : ['src/migrations/**/*.ts'],
  subscribers: process.env.TYPEORM_SUBSCRIBERS
    ? [process.env.TYPEORM_SUBSCRIBERS]
    : ['src/subscribers/**/*.ts'],
  cli: {
    entitiesDir: process.env.TYPEORM_ENTITIES_DIR || 'src/entities',
    migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR || 'src/migrations',
    subscribersDir: process.env.TYPEORM_SUBSCRIBERS_DIR || 'src/subscribers',
  },
}

export = config
