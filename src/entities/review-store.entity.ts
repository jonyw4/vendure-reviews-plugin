import { Customer } from '@vendure/core';
import { Column, OneToOne, Entity, JoinColumn } from 'typeorm';
import { ReviewBaseEntity } from './review-base.entity';
import { DeepPartial } from '@vendure/core';

@Entity('ReviewStore')
export class ReviewStoreEntity extends ReviewBaseEntity {
  constructor(input?: DeepPartial<ReviewStoreEntity>) {
    super(input);
  }
  @Column('int')
  nps: number;

  @OneToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  public get customerName(): string | null {
    return this.customerNameIsPublic ? this.customer.firstName : null;
  }
}
