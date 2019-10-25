import { Field, ObjectType } from 'type-graphql'
import {
  Check,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  RelationId,
  JoinColumn,
} from 'typeorm'
import { Lazy } from '../utils'
import BaseEntity from './base/BaseEntity'

export type UserRole = 'ADMIN' // in the future, other roles will be added

@Entity('users')
@ObjectType()
export class User extends BaseEntity {
  @Column({ name: 'address' })
  @Field(() => String)
  address: string

  @Column({ name: 'name', nullable: true })
  @Field({ nullable: true })
  name: string
}
