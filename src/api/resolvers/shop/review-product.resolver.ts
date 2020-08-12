import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ReviewProductService } from '../../../services/review-product.service';
import {
  IllegalOperationError,
  Allow,
  Ctx,
  RequestContext,
  Permission
} from '@vendure/core';
import { ReviewProductEntity } from '../../../entities';
import {
  MutationCreateReviewProductArgs,
  MutationUpdateReviewProductArgs
} from './../../../types/generated-shop-schema';

@Resolver('ReviewProduct')
export class ReviewProductShopResolver {
  constructor(private reviewProductService: ReviewProductService) {}
  @Mutation()
  @Allow(Permission.Owner)
  async createReviewProduct(
    @Ctx() ctx: RequestContext,
    @Args() { input: { productId, ...input } }: MutationCreateReviewProductArgs
  ): Promise<ReviewProductEntity> {
    const customer = await this.reviewProductService.getCustomerOrThrow(ctx);
    const product = await this.reviewProductService.getProductOrThrow(
      productId
    );
    if (
      !(await this.reviewProductService.checkIfCustomerIsValidToCreateReviewProduct(
        customer,
        product
      ))
    ) {
      throw new IllegalOperationError('cannot-create-review-product');
    }

    return this.reviewProductService.create({
      ...input,
      customer: customer,
      product: product
    });
  }

  @Mutation()
  @Allow(Permission.Owner)
  async updateReviewProduct(
    @Ctx() ctx: RequestContext,
    @Args() { input }: MutationUpdateReviewProductArgs
  ): Promise<ReviewProductEntity> {
    const customer = await this.reviewProductService.getCustomerOrThrow(ctx);
    await this.reviewProductService.findById(input.id, {
      where: { customer: customer }
    });
    return await this.reviewProductService.update(ctx, input);
  }
}
