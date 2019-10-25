import * as jwt from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'
import config from '../config'
import { Context } from '../context'
import { AuthenticationError } from '../errors'
import { UserRole } from '../entities/User'

interface AccessTokenPayload {
  sub: string
  roles: string[]
  refreshTokenID: string
}

interface RefreshTokenPayload {
  sub: string
}

enum Roles {
  ADMIN = 'ADMIN',
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
    throw new AuthenticationError()
  }
}

const authChecker: AuthChecker<Context, UserRole> = (
  { context: { userID, userRoles } },
  roles,
) => {
  if (roles.length === 0) {
    // if `@Authorized()`, check only is user exist
    return userID != null // eslint-disable-line eqeqeq
  }
  // there are some roles defined now

  if (!userID) {
    // and if no user, restrict access
    return false
  }
  if (userRoles.some(role => roles.includes(role))) {
    // grant access if the roles overlap
    return true
  }

  // no roles matched, restrict access
  return false
}

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  authenticateRequest,
  authChecker,
  Roles,
}
