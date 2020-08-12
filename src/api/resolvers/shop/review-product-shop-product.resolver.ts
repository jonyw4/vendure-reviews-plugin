import { Resolver, ResolveField, Args, Parent } from '@nestjs/graphql';
import { ReviewProductService } from '../../../services/review-product.service';
import { Product, Ctx, RequestContext } from '@vendure/core';
import { ProductReviewsArgs } from './../../../types/generated-shop-schema';

@Resolver('Product')
export class ReviewProductShopProductResolver {
  constructor(private reviewProductService: ReviewProductService) {}
  @ResolveField('reviewAvg')
  async reviewAvg() {
    return this.reviewProductService.getAvgStars();
  }

  @ResolveField('reviews')
  async reviews(
    @Args() { options }: ProductReviewsArgs,
    @Parent() product: Product
  ) {
    return this.reviewProductService.findAll(options || undefined, {
      where: { product: product, state: 'Authorized' }
    });
  }

  @ResolveField('canReview')
  async canReview(@Ctx() ctx: RequestContext, @Parent() product: Product) {
    const customer = await this.reviewProductService.getCustomerOrThrow(ctx);
    return this.reviewProductService.checkIfCustomerIsValidToCreateReviewProduct(
      customer,
      product
    );
  }
}
