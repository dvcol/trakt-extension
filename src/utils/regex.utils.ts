export const DigitRange = /^\d+-\d+$/;
export const DecimalRange = /^(10|\d)\.\d-(10|\d)\.\d$/;
export const PercentageRange = /^(100|\d{0,2})-(100|\d{0,2})$/;
export const LargeRange = /^(100000|\d{0,5})-(100000|\d{0,5})$/;
export const VeryLargeRange = /^(300000|[1-2]?\d{0,5})-(300000|[1-2]?\d{0,5})$/;
export const DateISO8601 = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-]\d{2}:[0-5]\d)?$/;
export const DateISO8601Short = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
