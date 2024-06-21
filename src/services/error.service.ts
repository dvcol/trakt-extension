import { isReactive, isRef, toRaw } from 'vue';

import type { RecursiveRecord } from '@dvcol/common-utils/common';

const toRawDeep = (obj: RecursiveRecord): RecursiveRecord => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (Object.values(value).some(v => isRef(v) || isReactive(v))) return [key, toRawDeep(value)];
      return [key, toRaw(value)];
    }),
  );
};

export class ErrorService {
  private static _dictionaries: RecursiveRecord = {};
  private static _errors: Array<{ date: Date; error: unknown; meta: RecursiveRecord }> = [];

  static retention = 30;

  static get dictionaries() {
    return toRawDeep(this._dictionaries);
  }

  static get errors() {
    return this._errors;
  }

  static get lastError() {
    return this._errors[this._errors.length - 1];
  }

  static registerDictionary(name: string, dictionary: RecursiveRecord) {
    if (this._dictionaries[name]) throw new Error(`Dictionary ${name} already exists`);
    this._dictionaries[name] = dictionary;
  }

  static registerError(error: unknown, ...rest: unknown[]) {
    if (this._errors.length >= this.retention) this._errors.shift();
    this._errors.push({ date: new Date(), error, meta: { ...rest } });
  }

  static since(date: Date) {
    return this._errors.filter(({ date: errorDate }) => errorDate > date);
  }
}
