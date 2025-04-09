import type { SimpleCache } from "../cache.js";
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import type { ServerConfig } from "../config.js";
import { badRequestJson, internalServerError, okJson } from "../responses.js";
import { jwtDecode, type JwtPayload } from "jwt-decode";


interface GetRequest {
    nonce: string;
  }

type GetResponse =
  | { error: string }
  | {
      error?: undefined;
      access_token: string;
      expires_in: number;
      refresh_token: string;
      picture?: string;
      name?: string;
      id?: string;
    };

export async function get(
  req: IncomingMessage,
  res: ServerResponse,
  config: ServerConfig,
  cache: SimpleCache,
): Promise<void> {
  const params = Object.fromEntries(
    new URL(req.url ?? "", "http://example.com").searchParams.entries()
  ) as object as GetRequest;
  if (!params.nonce) {
    return badRequestJson(res, { error: "missing nonce" });
  }
  const nonce = params.nonce;

  const cachedToken = cache.get(nonce);

  if (cachedToken) {
    return   okJson(res, cachedToken satisfies GetResponse);
  } else {
    return okJson(res, {});
  }

}
