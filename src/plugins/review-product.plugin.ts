import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ReviewProductEntity } from '../entities';
import { ReviewProductService } from '../services';
import {
  ReviewProductAdminResolver,
  ReviewProductShopResolver,
  ReviewProductShopProductResolver
} from '../api/resolvers';
import {
  reviewProductAdminApiExtension,
  reviewProductShopApiExtension
} from '../api/schemas';

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [ReviewProductEntity],
  providers: [ReviewProductService],
  adminApiExtensions: {
    schema: reviewProductAdminApiExtension,
    resolvers: [ReviewProductAdminResolver]
  },
  shopApiExtensions: {
    schema: reviewProductShopApiExtension,
    resolvers: [ReviewProductShopResolver, ReviewProductShopProductResolver]
  }
})
export class ReviewsProductPlugin {}
