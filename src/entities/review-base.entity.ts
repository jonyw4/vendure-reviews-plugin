import { VendureEntity, DeepPartial } from '@vendure/core';
import { Column } from 'typeorm';
import { ReviewState } from '../helpers/review-state';

export abstract class ReviewBaseEntity extends VendureEntity {
  constructor(input?: DeepPartial<ReviewBaseEntity>) {
    super(input);
  }
  @Column('varchar')
  state: ReviewState;

  @Column('varchar')
  title: string;

  @Column('text')
  description: string;
}
