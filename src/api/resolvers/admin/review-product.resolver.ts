import {
  Query,
  Mutation,
  ResolveField,
  Args,
  Parent,
  Resolver
} from '@nestjs/graphql';
import { ReviewProductService } from '../../../services/review-product.service';
import {
  Permission,
  Ctx,
  RequestContext,
  Allow,
  ProductService
} from '@vendure/core';
import { ReviewState } from '../../../helpers';
import { ReviewProductEntity } from '../../../entities';
import {
  MutationTransitionReviewProductToStateArgs,
  QueryReviewProductArgs,
  QueryReviewsProductArgs
} from '../../../types/generated-admin-schema';

@Resolver('ReviewProduct')
export class ReviewProductAdminResolver {
  constructor(
    private reviewProductService: ReviewProductService,
    private productService: ProductService
  ) {}

  @ResolveField('product')
  async product(
    @Ctx() ctx: RequestContext,
    @Parent() reviewProduct: ReviewProductEntity
  ) {
    return this.productService.findOne(ctx, reviewProduct.product.id);
  }

  @ResolveField('nextStates')
  async nextStates(@Parent() reviewProduct: ReviewProductEntity) {
    return this.reviewProductService.getNextReviewStates(reviewProduct);
  }

  @Query()
  @Allow(Permission.ReadOrder)
  async reviewProduct(@Args() { id }: QueryReviewProductArgs) {
    return this.reviewProductService.findById(id);
  }

  @Query()
  @Allow(Permission.ReadOrder)
  async reviewsProduct(@Args() { options }: QueryReviewsProductArgs) {
    return this.reviewProductService.findAll(options || undefined);
  }

  @Mutation()
  @Allow(Permission.UpdateOrder)
  async transitionReviewProductToState(
    @Ctx() ctx: RequestContext,
    @Args() args: MutationTransitionReviewProductToStateArgs
  ) {
    const review = await this.reviewProductService.findById(args.id);
    return this.reviewProductService.transitionToState(
      ctx,
      review,
      args.state as ReviewState
    );
  }
}
