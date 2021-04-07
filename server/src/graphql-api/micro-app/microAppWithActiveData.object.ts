import { Field, Int, ObjectType } from 'type-graphql';

import { MicroAppData } from '@artifacts/type-graphql';

@ObjectType({
  description: 'The micro app object with data of the active version.',
})
export class MicroAppWithActiveData {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int)
  activeVersion: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  creatorId: string;

  @Field()
  updaterId: string;

  @Field(() => MicroAppData)
  activeMicroAppData: MicroAppData;
}
