import { makeRouteHandler } from '@keystatic/next/route-handler';
import keystaticConfig from '../../../../../keystatic.config';

const handlers = makeRouteHandler({ config: keystaticConfig });

export const GET = handlers.GET;
export const POST = handlers.POST;
