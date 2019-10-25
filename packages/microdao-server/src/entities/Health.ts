import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class Health {
  @Field(() => Boolean)
  ok: boolean
}
