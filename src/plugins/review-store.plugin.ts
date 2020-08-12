import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ReviewStoreEntity } from '../entities';
import { ReviewStoreService } from '../services';
import {
  ReviewStoreAdminResolver,
  ReviewStoreShopResolver
} from '../api/resolvers';
import {
  reviewStoreAdminApiExtension,
  reviewStoreShopApiExtension
} from '../api/schemas';

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [ReviewStoreEntity],
  providers: [ReviewStoreService],
  adminApiExtensions: {
    schema: reviewStoreAdminApiExtension,
    resolvers: [ReviewStoreAdminResolver]
  },
  shopApiExtensions: {
    schema: reviewStoreShopApiExtension,
    resolvers: [ReviewStoreShopResolver]
  }
})
export class ReviewsStorePlugin {}
