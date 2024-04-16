import test from 'ava';

import { parseLedgerToRaw } from '../../index';
import RawToCookedVisitor from '../../lib/visitors/raw_to_cooked';

test('correctly parses a shorthand date', (t) => {
  const result = RawToCookedVisitor.journal(
    parseLedgerToRaw(`01/02 transaction\n`).rawJournal
  );
  t.deepEqual(
    result.transactions[0].date,
    { year: undefined, month: '01', day: '02', delimiter: '/' },
    'should have parsed date with the current year as the default'
  );
});

// TODO: There are tests missing for handling smart dates: https://hledger.org/1.30/hledger.html#smart-dates
