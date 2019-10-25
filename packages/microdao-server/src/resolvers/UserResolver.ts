import {
  Arg,
  Authorized,
  Ctx,
  Query,
  Resolver,
  Mutation,
  FieldResolver,
  Root,
} from 'type-graphql'
import { User } from '../entities/User'

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(
    @Ctx('getCurrentUser') getCurrentUser: () => Promise<User | null>,
  ): Promise<User | null> {
    return getCurrentUser()
  }
}
