import { ReviewStoreEntity, ReviewProductEntity } from '../entities';
import { Customer, Product } from '@vendure/core';

export const exampleCustomer = new Customer({
  firstName: 'Jony'
});

export const exampleProduct = new Product({
  name: 'Laptop'
});

export const exampleReviewProduct = new ReviewProductEntity({
  id: 1,
  title: 'Review 1',
  description: 'Good product',
  state: 'Created',
  stars: 5,
  customer: exampleCustomer,
  product: exampleProduct
});

export const examplesReviewProduct = [
  exampleReviewProduct,
  new ReviewProductEntity({
    id: 2,
    title: 'Review 2',
    description: 'Good',
    state: 'Created',
    stars: 4,
    customer: new Customer({
      firstName: 'Tony'
    }),
    product: exampleProduct
  }),
  new ReviewProductEntity({
    id: 3,
    title: 'Review 3',
    description: 'Bad',
    state: 'Created',
    stars: 3,
    customer: new Customer({
      firstName: 'Any'
    }),
    product: exampleProduct
  })
];

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
