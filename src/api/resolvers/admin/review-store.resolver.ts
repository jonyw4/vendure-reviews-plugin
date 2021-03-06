import {
  Query,
  Mutation,
  ResolveField,
  Args,
  Parent,
  Resolver
} from '@nestjs/graphql';
import { ReviewStoreService } from '../../../services/review-store.service';
import { Permission, Ctx, RequestContext, Allow } from '@vendure/core';
import { ReviewState } from '../../../helpers';
import {
  QueryReviewsStoreArgs,
  QueryReviewStoreArgs,
  MutationTransitionReviewStoreToStateArgs
} from '../../../types/generated-admin-schema';
import { ReviewStoreEntity } from '../../../entities';

@Resolver('ReviewStore')
export class ReviewStoreAdminResolver {
  constructor(private reviewStoreService: ReviewStoreService) {}

  @ResolveField('nextStates')
  async nextStates(@Parent() reviewStore: ReviewStoreEntity) {
    return this.reviewStoreService.getNextReviewStates(reviewStore);
  }

  @Query()
  @Allow(Permission.ReadOrder)
  async reviewStore(
    @Ctx() ctx: RequestContext,
    @Args() { id }: QueryReviewStoreArgs
  ) {
    return this.reviewStoreService.findById(ctx, id);
  }

  @Query()
  @Allow(Permission.ReadOrder)
  async reviewsStore(@Args() { options }: QueryReviewsStoreArgs) {
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
    @Args() args: MutationTransitionReviewStoreToStateArgs
  ) {
    const review = await this.reviewStoreService.findById(ctx, args.id);
    return this.reviewStoreService.transitionToState(
      ctx,
      review,
      args.state as ReviewState
    );
  }
}
