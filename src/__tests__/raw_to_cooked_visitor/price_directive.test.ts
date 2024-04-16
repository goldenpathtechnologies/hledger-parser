import test from 'ava';

import { parseLedgerToRaw } from '../../index';
import RawToCookedVisitor from '../../lib/visitors/raw_to_cooked';

test('parses a price directive', (t) => {
  const result = RawToCookedVisitor.journal(
    parseLedgerToRaw(`P 1900/01/01 $ 10CAD\n`).rawJournal
  );
  t.is(result.prices.length, 1, 'should have 1 parsed price directive');
  t.deepEqual(
    result.prices[0],
    {
      date: { year: '1900', month: '01', day: '01', delimiter: '/' },
      commodity: '$',
      price: {
        number: '10',
        commodity: 'CAD',
        value: '10CAD',
        sign: undefined
      }
    },
    'should have parsed price directive'
  );
});
