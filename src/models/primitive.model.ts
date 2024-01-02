export type Primitive = string | boolean | number;
export type PrimitiveRecord = Record<string, Primitive>;
export type RecursivePrimitiveRecord = {
  [key: string]: Primitive | PrimitiveRecord | RecursivePrimitiveRecord;
};
