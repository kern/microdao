import * as jwt from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'
import config from '../config'
import { Context } from '../context'
import { AuthenticationError } from 'apollo-server-koa'

interface AccessTokenPayload {
  sub: string
  aud: string
}

interface RefreshTokenPayload {
  sub: string
}

const generateAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, config.auth.secret, {
    algorithm: 'HS256',
    expiresIn: config.auth.accessTokenExpireIn,
  })

const generateRefreshToken = (payload: any): string =>
  jwt.sign(payload, config.auth.secret, {
    algorithm: 'HS256',
    expiresIn: config.auth.refreshTokenExpireIn,
  })

const verifyAccessToken = (token: string): object =>
  jwt.verify(token, config.auth.secret, { algorithms: ['HS256'] })

const verifyRefreshToken = (token: string): object =>
  jwt.verify(token, config.auth.secret, { algorithms: ['HS256'] })

function authenticateRequest(request): AccessTokenPayload | null {
  try {
    const header = request.headers.authorization || ''
    const parts = header.split(' ')
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return null
    }

    const accessToken = parts[1]
    return verifyAccessToken(accessToken) as AccessTokenPayload
  } catch (err) {
    throw new AuthenticationError('invalid authorization header')
  }
}

const authChecker: AuthChecker<Context> = (
  { context: { userAddress } },
) => {
  return userAddress != null // eslint-disable-line eqeqeq
}

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  authenticateRequest,
  authChecker,
}
