import { Customer, Product } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ReviewBaseEntity } from './review-base.entity';
import { DeepPartial } from '@vendure/core';

@Entity()
export class ReviewProductEntity extends ReviewBaseEntity {
  constructor(input?: DeepPartial<ReviewProductEntity>) {
    super(input);
  }
  @Column('int')
  stars: number;

  @ManyToOne(() => Customer)
  customer: Customer;

  @ManyToOne(() => Product)
  product: Product;
}
