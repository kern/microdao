import { User } from './entities/User'
import { Network } from './entities/Network'
import { authenticateRequest } from './lib/auth'
import { userRepo } from './repos'

export type GetCurrentUser = () => Promise<User | null>

export interface Context {
  getCurrentUser: GetCurrentUser
  userAddress: string | null
}

export function createContext() {
  return ({ ctx: { request } }): Context => {
    const token = authenticateRequest(request)
    const network = token ? Network[token.aud] : null
    const userAddress = token ? token.sub : null

    const getCurrentUser = userAddress
      ? () => userRepo().findOrCreateByNetworkAddress(network, userAddress)
      : () => Promise.resolve(null)

    return { getCurrentUser, userAddress }
  }
}
