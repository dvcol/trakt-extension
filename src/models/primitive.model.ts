export type Primitive = string | boolean | number;
export type PrimitiveRecord = Record<string, Primitive>;
export type RecursivePrimitiveRecord =
  | PrimitiveRecord
  | {
      [key: string]: Primitive | PrimitiveRecord | RecursivePrimitiveRecord;
    };
