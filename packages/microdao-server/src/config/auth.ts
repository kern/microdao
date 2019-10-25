const auth = {
  accessTokenExpireIn: 3600,
  refreshTokenExpireIn: 31536000,
  secret: process.env.AUTH_SECRET || 'salt',
}

export = auth
