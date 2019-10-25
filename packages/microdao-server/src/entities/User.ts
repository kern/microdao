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
import { Network } from './Network'

@Entity('users')
@ObjectType()
export class User extends BaseEntity {
  @Column({ name: 'network' })
  @Field(() => Network)
  network: Network

  @Column({ name: 'address' })
  @Field(() => String)
  address: string

  @Column({ name: 'name', nullable: true })
  @Field({ nullable: true })
  name: string
}
