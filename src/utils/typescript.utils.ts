export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type Primitive = string | boolean | number;
export type PrimitiveRecord = Record<string, Primitive>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic typing
export type RecursiveRecord<T = any> = {
  [key: string]: T | RecursiveRecord<T>;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic typing
export type GenericFunction = (...args: any) => any;

/**
 * Base class for extensible functions
 */
export class ExtensibleFunction<T extends GenericFunction = GenericFunction> extends Function {
  constructor(f: T) {
    super();
    // eslint-disable-next-line no-constructor-return
    return Object.setPrototypeOf(f, new.target.prototype);
  }
}
