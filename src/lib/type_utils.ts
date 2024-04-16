//import { PayeeMemo, TxnDescription } from './types';

import type * as Core from './types';

/**
 * Utility method to filter null and undefined values from an array and
 * return the correct type
 * @param value value to check for *null-ness*
 * @returns A boolean type assertion that value is not nullish
 */
export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

/*export function descriptionIsPayeeMemo(
  description: TxnDescription
): description is PayeeMemo {
  return !!(
    typeof description !== 'string' &&
    description.memo &&
    description.payee
  );
}
*/

export function toSimpleDate(date: string): Core.SimpleDate | undefined {
  const pattern = /((\d{4,5})([-/.]))?(\d{1,2})([-/.])(\d{1,2})/;

  if (!pattern.test(date)) return undefined;

  const [, , year, delim1, month, delim2, day] = pattern.exec(date) ?? [];
  const delimiter = (!delim1 ? delim2 : delim1) as Core.DateDelimiter;

  return {
    year,
    month,
    day,
    delimiter
  };
}
