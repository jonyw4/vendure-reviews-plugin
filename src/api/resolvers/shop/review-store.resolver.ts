import { Query, Mutation, Args } from '@nestjs/graphql';
import { ReviewStoreService } from '../../../services/review-store.service';
import {
  Permission,
  Ctx,
  RequestContext,
  Allow,
  IllegalOperationError
} from '@vendure/core';
import { ReviewStoreEntity } from '../../../entities/review-store.entity';

export class ReviewStoreShopResolver {
  constructor(private reviewStoreService: ReviewStoreService) {}

  @Mutation()
  @Allow(Permission.Owner)
  async createReviewStore(
    @Ctx() ctx: RequestContext,
    @Args() args: any
  ): Promise<ReviewStoreEntity> {
    if (
      !(await this.reviewStoreService.checkIfCustomerIsValidToCreateReviewStore(
        ctx
      ))
    ) {
      throw new IllegalOperationError(
        'review.error.cannot-transition-review-store-from-to'
      );
    }
    return await this.reviewStoreService.create(args.input);
  }

  @Query()
  async avgReviewStore(): Promise<number> {
    return await this.reviewStoreService.getNPSAvg();
  }

  @Query()
  @Allow(Permission.Owner)
  async myReviewStore(
    @Ctx() ctx: RequestContext
  ): Promise<ReviewStoreEntity | undefined> {
    return await this.reviewStoreService.findCustomerReview(ctx);
  }
}
