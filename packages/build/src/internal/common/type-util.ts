/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Count the number of items in a type union.
 *
 * Examples:
 *
 * never ........... 0
 * "foo" ........... 1
 * "foo" | "bar" ... 2
 */
export type CountUnion<U> = PermuteUnion<U>["length"];

/**
 * Generate all permutations of the given union as a union of tuples.
 *
 * WARNING: This type has quadratic complexity, so it should only be used where
 * it is expected that the number of values is very small, such as enforcing
 * that something is 0 or 1.
 *
 * Examples:
 *
 * never ........... []
 * "foo" ........... ["foo"]
 * "foo" | "bar" ... ["foo", "bar"] | ["bar", "foo"]
 */
type PermuteUnion<U, T = U> = [U] extends [never]
  ? []
  : T extends unknown
    ? [T, ...PermuteUnion<Exclude<U, T>>]
    : never;

/**
 * A hack that encourages TypeScript to expand a type when choosing how to
 * display it. Useful for utility types that we don't want to expose directly to
 * users.
 *
 * https://github.com/microsoft/TypeScript/issues/47980#issuecomment-1049304607
 */
export type Expand<T> = T extends unknown ? { [K in keyof T]: T[K] } : never;

/**
 * Some type, or a promise of it.
 */
export type MaybePromise<T> = T | Promise<T>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Defined = {} | null;

export type BroadenBasicType<T extends string | number | boolean> =
  T extends string
    ? string
    : T extends number
      ? number
      : T extends boolean
        ? boolean
        : never;

/**
 * See https://github.com/microsoft/TypeScript/issues/31751#issuecomment-498526919
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Remove all readonly modifiers on an object.
 */
export type RemoveReadonly<T> = { -readonly [K in keyof T]: T[K] };

/**
 * For each property in an object, if its value can be `undefined`, mark that
 * property as optional.
 */
export type AutoOptional<T> =
  T /* See Distributive Conditional Types */ extends unknown
    ? {
        [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
      } & { [K in keyof T as undefined extends T[K] ? never : K]: T[K] }
    : never;

export type FlattenUnion<T> = {
  [K in keyof UnionToIntersection<T>]: K extends keyof T
    ? T[K]
    : UnionToIntersection<T>[K] | undefined;
};

export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
