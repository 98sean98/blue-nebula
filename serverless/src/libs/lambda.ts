import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';

import { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';

export const middyfy = (handler: ValidatedEventAPIGatewayProxyEvent<any>) => {
  return middy(handler).use(middyJsonBodyParser());
};
