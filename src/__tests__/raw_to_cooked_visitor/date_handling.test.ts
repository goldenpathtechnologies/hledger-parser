import test from 'ava';
import { DateTime } from 'luxon';

import { parseLedgerToRaw } from '../../index';
import RawToCookedVisitor from '../../lib/visitors/raw_to_cooked';

test('correctly parses a shorthand date', (t) => {
  const result = RawToCookedVisitor.journal(
    parseLedgerToRaw(`01/02 transaction\n`).rawJournal
  );
  t.deepEqual(
    result.transactions[0].date,
    { year: DateTime.now().year, month: 1, day: 2 },
    'should have parsed date with the current year as the default'
  );
});

test('correctly subsitutes year directive value in transaction shorthand date', (t) => {
  const result = RawToCookedVisitor.journal(
    parseLedgerToRaw(`Y 2000

01.23 transaction
`).rawJournal
  );

  t.deepEqual(
    result.transactions[0].date,
    { year: 2000, month: 1, day: 23 },
    'should have parsed date with year directive value as the default'
  );
});

test('correctly subsitutes year directive value in price directive shorthand date', (t) => {
  const result = RawToCookedVisitor.journal(
    parseLedgerToRaw(`Y 2000

P 10-11 BIN 1010.10
`).rawJournal
  );

  t.deepEqual(
    result.prices[0].date,
    { year: 2000, month: 10, day: 11 },
    'should have parsed price directive date with year directive value as default'
  );
});

test('correctly subsitutes year directive value in transaction shorthand posting date', (t) => {
  const result = RawToCookedVisitor.journal(
    parseLedgerToRaw(`Y 2000

01.23=01.31 transaction
`).rawJournal
  );

  t.deepEqual(
    result.transactions[0].postingDate,
    { year: 2000, month: 1, day: 31 },
    'should have parsed posting date with year directive value as the default'
  );
});

test('correctly substitutes transaction date year in shorthand posting date', (t) => {
  const result = RawToCookedVisitor.journal(
    parseLedgerToRaw(`Y 2000

2001.01.23=01.31 transaction
`).rawJournal
  );

  t.deepEqual(
    result.transactions[0].postingDate,
    { year: 2001, month: 1, day: 31 },
    'should have parsed posting date with transaction date year as the default'
  );
});

// TODO: There are tests missing for handling smart dates: https://hledger.org/1.30/hledger.html#smart-dates
