import {
  Resolver,
  Mutation,
  Args,
  Query,
  Parent,
  ResolveField
} from '@nestjs/graphql';
import { ReviewProductService } from '../../../services/review-product.service';
import {
  IllegalOperationError,
  Allow,
  Ctx,
  RequestContext,
  Permission,
  ProductService
} from '@vendure/core';
import { ReviewProductEntity } from '../../../entities';
import {
  MutationCreateReviewProductArgs,
  MutationUpdateReviewProductArgs,
  QueryAvailableProductsToReviewArgs
} from './../../../types/generated-shop-schema';

@Resolver('ReviewProduct')
export class ReviewProductShopResolver {
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
    await this.reviewProductService.findById(ctx, input.id, {
      where: { customer: customer }
    });
    return await this.reviewProductService.update(ctx, input);
  }

  @Query()
  @Allow(Permission.Owner)
  async availableProductsToReview(
    @Ctx() ctx: RequestContext,
    @Args() { options }: QueryAvailableProductsToReviewArgs
  ) {
    const customer = await this.reviewProductService.getCustomerOrThrow(ctx);
    return await this.reviewProductService.availableProductsToReview(
      ctx,
      customer,
      options || undefined
    );
  }

  @Query()
  @Allow(Permission.Owner)
  async reviewProduct(@Ctx() ctx: RequestContext, @Args() { id }: any) {
    const customer = await this.reviewProductService.getCustomerOrThrow(ctx);
    return this.reviewProductService.findById(ctx, id, {
      where: { customer: customer }
    });
  }

  @Query()
  @Allow(Permission.Owner)
  async reviewsProduct(@Ctx() ctx: RequestContext, @Args() { options }: any) {
    const customer = await this.reviewProductService.getCustomerOrThrow(ctx);
    return this.reviewProductService.findAll(options || undefined, {
      where: {
        customer: customer
      }
    });
  }
}
