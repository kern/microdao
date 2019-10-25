import { getCustomRepository, EntityManager } from 'typeorm'
import UserRepository from './UserRepository'

const userRepo = (manager?: EntityManager): UserRepository =>
  manager
    ? manager.getCustomRepository(UserRepository)
    : getCustomRepository(UserRepository)

export {
  userRepo,
}
