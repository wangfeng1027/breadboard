type AuthTokenInfo  = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    picture?: string;
    name?: string;
    id?: string;
  };

type AuthTokenWithExpiration = {
    created: number,
    token: AuthTokenInfo,
};

export class SimpleCache {

// cache.js (a simple module to manage the cache)
 #cache = new Map();

 set(key:string, value:AuthTokenInfo) {
  console.log(`Caching value for key: ${key}`);
  this.#cache.set(key, {
    created: Date.now(),
    token: value
  });
}

 get(key: string) {
  if (this.#cache.has(key)) {
    return this.#cache.get(key).token;
  }
  return null; // Or undefined
}

 del(key: string) {
  this.#cache.delete(key);
}

 clear() {
  this.#cache.clear();
}
}

