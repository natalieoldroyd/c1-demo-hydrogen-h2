/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import type {Storefront} from '@shopify/hydrogen';
import type {HydrogenSession} from '~/lib/session.server';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {
    SHOPIFY_STORE_DOMAIN: any;NODE_ENV: 'production' | 'development'
}};

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    SHOPIFY_STORE_MULTIPASS_SECRET: string;
    SHOPIFY_CHECKOUT_DOMAIN: string;
    SESSION_SECRET: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PRIVATE_STOREFRONT_API_TOKEN: string;
    PUBLIC_STOREFRONT_API_VERSION: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_ID: string;
  }
}

/**
 * Declare local additions to `AppLoadContext` to include the session utilities we injected in `server.ts`.
 */
declare module '@shopify/remix-oxygen' {
  export interface AppLoadContext {
    waitUntil: ExecutionContext['waitUntil'];
    session: HydrogenSession;
    storefront: Storefront;
    cache: Cache;
    env: Env;
  }
}

// Needed to make this file a module.
export {};
