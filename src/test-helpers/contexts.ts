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
  apiType: 'admin',
  isAuthorized: true,
  authorizedAsOwnerOnly: false,
  channel: chanel,
  languageCode: LanguageCode.en
});
