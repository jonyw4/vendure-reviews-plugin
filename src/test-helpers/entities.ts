import { ReviewStoreEntity } from '../entities';
import { Customer } from '@vendure/core';

export const exampleCustomer = new Customer({
  firstName: 'Jony'
});
export const exampleReviewStore = new ReviewStoreEntity({
  id: 1,
  title: 'Review 1',
  description: 'Good company',
  state: 'Created',
  nps: 9,
  customer: exampleCustomer
});

export const examplesReviewStore = [
  exampleReviewStore,
  new ReviewStoreEntity({
    id: 2,
    title: 'Review 2',
    description: 'Good',
    state: 'Created',
    nps: 8,
    customer: new Customer({
      firstName: 'Tony'
    })
  }),
  new ReviewStoreEntity({
    id: 3,
    title: 'Review 3',
    description: 'Bad',
    state: 'Created',
    nps: 8,
    customer: new Customer({
      firstName: 'Any'
    })
  })
];
