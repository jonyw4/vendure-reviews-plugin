import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ReviewStoreService } from '../../../services';
import { ReviewStoreEntity } from '../../../entities';

@Resolver('ReviewStore')
export class ReviewStoreAdminEntityResolver {
  constructor(private reviewStoreService: ReviewStoreService) {}

  @ResolveField('nextStates')
  async nextStates(@Parent() reviewStore: ReviewStoreEntity) {
    return this.reviewStoreService.getNextReviewStates(reviewStore);
  }
}
