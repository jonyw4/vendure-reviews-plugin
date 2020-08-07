import { Transitions } from '@vendure/core';

/** State of the review */
export type ReviewState = 'Created' | 'Authorized' | 'Denied';

export const reviewStateTransitions: Transitions<ReviewState> = {
  Created: {
    to: ['Authorized', 'Denied']
  },
  Authorized: {
    to: ['Created', 'Denied']
  },
  Denied: {
    to: ['Authorized', 'Created']
  }
};
