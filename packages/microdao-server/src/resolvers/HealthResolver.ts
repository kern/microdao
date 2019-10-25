import { Query, Resolver } from 'type-graphql'
import { getHealth } from '../actions/health'
import { Health } from '../entities/Health'

@Resolver(Health)
export class HealthResolver {
  @Query(() => Health)
  async health(): Promise<Health> {
    return getHealth()
  }
}
