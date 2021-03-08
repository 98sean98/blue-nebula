import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';

import { ValidatedEventAPIGatewayProxyEvent } from '@utilities/apiGateway';

export const jsonMiddify = (handler: ValidatedEventAPIGatewayProxyEvent<any>) =>
  middy(handler).use(middyJsonBodyParser());
