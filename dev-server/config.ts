import {
  examplePaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig
} from '@vendure/core';
import { ReviewsStorePlugin, ReviewsProductPlugin } from '../src';

export const config: VendureConfig = {
  apiOptions: {
    hostname: '0.0.0.0',
    port: 3000,
    adminApiPath: 'admin-api',
    adminApiPlayground: {
      settings: {
        'request.credentials': 'include'
      } as any
    },
    adminApiDebug: true,
    shopApiPath: 'shop-api',
    shopApiPlayground: {
      settings: {
        'request.credentials': 'include'
      } as any
    },
    shopApiDebug: true
  },
  authOptions: {
    tokenMethod: 'cookie',
    sessionSecret: 'plruo0esah',
    requireVerification: true
  },
  dbConnectionOptions: {
    type: 'mysql',
    synchronize: true,
    host: 'host.docker.internal',
    port: 3306,
    username: 'root',
    password: '',
    database: 'vendure',
    logging: false
  },
  paymentOptions: {
    paymentMethodHandlers: [examplePaymentHandler]
  },
  plugins: [
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    ReviewsStorePlugin,
    ReviewsProductPlugin
  ]
};

export default config;
