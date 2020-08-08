import { Query, Mutation, Args, Resolver } from '@nestjs/graphql';
import { ReviewStoreService } from '../../../services/review-store.service';
import { Permission, Ctx, RequestContext, Allow } from '@vendure/core';
import { ReviewState } from '../../../helpers';

@Resolver('ReviewStore')
export class ReviewStoreAdminResolver {
  constructor(private reviewStoreService: ReviewStoreService) {}

  @Query()
  @Allow(Permission.ReadOrder)
  async reviewStore(@Args() { id }: any) {
    return this.reviewStoreService.findById(id);
  }

  @Query()
  @Allow(Permission.ReadOrder)
  async reviewsStore(@Args() { options }: any) {
    return this.reviewStoreService.findAll(options || undefined);
  }

  @Query()
  @Allow(Permission.ReadOrder)
  async avgReviewStore() {
    return await this.reviewStoreService.getNPSAvg();
  }
  @Mutation()
  @Allow(Permission.UpdateOrder)
  async transitionReviewStoreToState(
    @Ctx() ctx: RequestContext,
    @Args() args: any
  ) {
    return this.reviewStoreService.transitionToState(
      ctx,
      args.id,
      args.state as ReviewState
    );
  }
}
