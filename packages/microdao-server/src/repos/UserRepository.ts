import { EntityRepository, Repository } from 'typeorm'
import { User } from '../entities/User'
import { Network } from '../entities/Network'
import config from '../config'
import { ValidationError } from 'apollo-server-koa'

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  async findOrCreateByNetworkAddress(network: Network, userAddress: string): Promise<User> {
    const results = await this.createQueryBuilder('users')
      .insert()
      .into(User)
      .values({ network, address: userAddress })
      .onConflict(`("network", "address") DO UPDATE SET "updated_at" = now()`)
      .returning('*')
      .execute()

    if (results.generatedMaps.length !== 1) {
      throw new Error('invalid user')
    }

    return this.create(results.generatedMaps[0])
  }
}
