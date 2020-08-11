import { RequestContext, LanguageCode, Channel } from '@vendure/core';

const chanel = new Channel({});
export const adminCtx = new RequestContext({
  apiType: 'admin',
  isAuthorized: true,
  authorizedAsOwnerOnly: false,
  channel: chanel,
  languageCode: LanguageCode.en
});
export const shopCtx = new RequestContext({
  apiType: 'shop',
  session: {
    cacheExpiry: 1,
    id: '1',
    token: '123',
    expires: new Date(),
    user: {
      id: '1',
      identifier: '123',
      verified: true,
      channelPermissions: []
    }
  },
  isAuthorized: true,
  authorizedAsOwnerOnly: false,
  channel: chanel,
  languageCode: LanguageCode.en
});
export const failCtx = new RequestContext({
  apiType: 'shop',
  isAuthorized: false,
  authorizedAsOwnerOnly: false,
  channel: chanel,
  languageCode: LanguageCode.en
});
