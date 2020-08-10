import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ReviewStoreEntity } from '../entities';
import { ReviewStoreService } from '../services';
import {
  ReviewStoreAdminResolver,
  ReviewStoreShopResolver
} from '../api/resolvers';
import { adminApiExtensions, shopApiExtensions } from '../api/schema';

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [ReviewStoreEntity],
  providers: [ReviewStoreService],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [ReviewStoreAdminResolver]
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ReviewStoreShopResolver]
  }
})
export class ReviewsStorePlugin {}
