import { Customer } from '@vendure/core';
import { Column, OneToOne } from 'typeorm';
import { ReviewBaseEntity } from './review-base.entity';
import { DeepPartial } from '@vendure/core';

export class ReviewStoreEntity extends ReviewBaseEntity {
  constructor(input?: DeepPartial<ReviewStoreEntity>) {
    super(input);
  }
  @Column('int')
  nps: number;

  @OneToOne((type) => Customer)
  customer: Customer;
}
