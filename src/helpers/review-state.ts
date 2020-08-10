import { Transitions } from '@vendure/core';

/** State of the review */
export type ReviewState = 'Created' | 'Updated' | 'Authorized' | 'Denied';

export const reviewStateTransitions: Transitions<ReviewState> = {
  Created: {
    to: ['Authorized', 'Denied', 'Updated']
  },
  Authorized: {
    to: ['Updated', 'Denied']
  },
  Updated: {
    to: ['Authorized', 'Denied']
  },
  Denied: {
    to: ['Authorized', 'Updated']
  }
};
