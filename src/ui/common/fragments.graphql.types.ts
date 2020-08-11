import * as Types from './generated-admin-schema';

export type ReviewStoreFragment = { __typename?: 'ReviewStore' } & Pick<
  Types.ReviewStore,
  'id' | 'title' | 'description' | 'state' | 'nps' | 'nextStates'
> & {
    customer?: Types.Maybe<
      { __typename?: 'Customer' } & Pick<Types.Customer, 'id' | 'firstName'>
    >;
  };
