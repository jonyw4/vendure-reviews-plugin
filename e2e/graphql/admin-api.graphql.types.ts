import * as Types from '../../src/types/generated-admin-schema';

export type AdminReviewStoreFragment = { __typename?: 'ReviewStore' } & Pick<
  Types.ReviewStore,
  | 'id'
  | 'title'
  | 'description'
  | 'state'
  | 'nps'
  | 'nextStates'
  | 'customerNameIsPublic'
> & {
    customer: { __typename?: 'Customer' } & Pick<
      Types.Customer,
      'id' | 'firstName'
    >;
  };

export type CustomerListQueryVariables = Types.Exact<{ [key: string]: never }>;

export type CustomerListQuery = { __typename?: 'Query' } & {
  customers: { __typename?: 'CustomerList' } & {
    items: Array<
      { __typename?: 'Customer' } & Pick<Types.Customer, 'id' | 'emailAddress'>
    >;
  };
};

export type ReviewStoreQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type ReviewStoreQuery = { __typename?: 'Query' } & {
  reviewStore?: Types.Maybe<
    { __typename?: 'ReviewStore' } & AdminReviewStoreFragment
  >;
};

export type ListReviewStoreQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type ListReviewStoreQuery = { __typename?: 'Query' } & {
  reviewsStore: { __typename?: 'ReviewStoreList' } & {
    items: Array<{ __typename?: 'ReviewStore' } & AdminReviewStoreFragment>;
  };
};

export type AvgReviewStoreQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type AvgReviewStoreQuery = { __typename?: 'Query' } & Pick<
  Types.Query,
  'avgReviewStore'
>;

export type TransitionReviewStoreToStateMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  state: Types.Scalars['String'];
}>;

export type TransitionReviewStoreToStateMutation = {
  __typename?: 'Mutation';
} & {
  transitionReviewStoreToState?: Types.Maybe<
    { __typename?: 'ReviewStore' } & AdminReviewStoreFragment
  >;
};

export type AdminReviewProductFragment = {
  __typename?: 'ReviewProduct';
} & Pick<
  Types.ReviewProduct,
  | 'id'
  | 'title'
  | 'description'
  | 'state'
  | 'stars'
  | 'nextStates'
  | 'customerNameIsPublic'
> & {
    customer: { __typename?: 'Customer' } & Pick<
      Types.Customer,
      'id' | 'firstName'
    >;
    product: { __typename?: 'Product' } & Pick<Types.Product, 'id' | 'name'>;
  };

export type ReviewProductQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type ReviewProductQuery = { __typename?: 'Query' } & {
  reviewProduct?: Types.Maybe<
    { __typename?: 'ReviewProduct' } & AdminReviewProductFragment
  >;
};

export type ListReviewProductQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type ListReviewProductQuery = { __typename?: 'Query' } & {
  reviewsProduct: { __typename?: 'ReviewProductList' } & {
    items: Array<{ __typename?: 'ReviewProduct' } & AdminReviewProductFragment>;
  };
};

export type TransitionReviewProductToStateMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  state: Types.Scalars['String'];
}>;

export type TransitionReviewProductToStateMutation = {
  __typename?: 'Mutation';
} & {
  transitionReviewProductToState?: Types.Maybe<
    { __typename?: 'ReviewProduct' } & AdminReviewProductFragment
  >;
};
