import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import {
  PluginCommonModule,
  VendurePlugin,
  OnVendureBootstrap,
  Order,
  CurrencyCode,
  Customer,
  ProductVariant,
  OrderLine
} from '@vendure/core';

/**
 * A Vendure Plugin to inject orders in database.
 */
@VendurePlugin({
  imports: [PluginCommonModule]
})
export class E2EInjectOrderPlugin implements OnVendureBootstrap {
  constructor(@InjectConnection() private connection: Connection) {}
  async onVendureBootstrap(): Promise<void> {
    const customers = await this.connection.getRepository(Customer).find();
    const productsVariant = await this.connection
      .getRepository(ProductVariant)
      .find({ relations: ['product'] });

    await this.connection.getRepository(Order).save(
      new Order({
        code: 'T_1',
        state: 'AddingItems',
        active: true,
        customer: customers[0],
        lines: [],
        couponCodes: [],
        pendingAdjustments: [],
        shippingAddress: {},
        billingAddress: {},
        payments: [],
        currencyCode: CurrencyCode.USD,
        subTotalBeforeTax: 10,
        subTotal: 10,
        shipping: 0,
        shippingWithTax: 0
      })
    );

    const completeOrder = await this.connection.getRepository(Order).save(
      new Order({
        code: 'T_2',
        state: 'Fulfilled',
        active: false,
        customer: customers[1],
        lines: [],
        couponCodes: [],
        pendingAdjustments: [],
        shippingAddress: {},
        billingAddress: {},
        payments: [],
        currencyCode: CurrencyCode.USD,
        subTotalBeforeTax: 10,
        subTotal: 10,
        shipping: 0,
        shippingWithTax: 0
      })
    );

    await this.connection.getRepository(OrderLine).save(
      new OrderLine({
        order: completeOrder,
        productVariant: productsVariant[0]
      })
    );
  }
}
