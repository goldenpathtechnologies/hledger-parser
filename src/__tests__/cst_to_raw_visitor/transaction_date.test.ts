import test from 'ava';

import { parseLedgerToCST } from '../../index';
import CstToRawVisitor from '../../lib/visitors/cst_to_raw';
import * as Raw from '../../lib/visitors/raw_types';

test('returns a transaction object containing only a date', (t) => {
  const result = CstToRawVisitor.journal(
    parseLedgerToCST(`1900/01/01\n`).cstJournal.children
  );
  t.is(result.length, 1, 'should modify a transaction simple date');
  t.is(result[0].type, 'transaction', 'should be a transaction object');
  t.deepEqual(
    (result[0] as Raw.Transaction).value.initLine.date.date,
    {
      year: '1900',
      month: '01',
      day: '01',
      delimiter: '/'
    },
    'should contain a transaction simple date'
  );
  t.falsy(
    (result[0] as Raw.Transaction).value.initLine.date.postingDate,
    'should not contain a transaction posting date'
  );
});

test('returns a transaction object containing only a date and posting date', (t) => {
  const result = CstToRawVisitor.journal(
    parseLedgerToCST(`1900/01/01=2020/02/02\n`).cstJournal.children
  );
  t.is(
    result.length,
    1,
    'should modify a transaction with a simple date and a posting date'
  );
  t.is(result[0].type, 'transaction', 'should be a transaction object');
  t.deepEqual(
    (result[0] as Raw.Transaction).value.initLine.date.date,
    {
      year: '1900',
      month: '01',
      day: '01',
      delimiter: '/'
    },
    'should contain a transaction simple date'
  );
  t.deepEqual(
    (result[0] as Raw.Transaction).value.initLine.date.postingDate,
    {
      year: '2020',
      month: '02',
      day: '02',
      delimiter: '/'
    },
    'should contain a transaction posting date'
  );
});

// TODO: There are tests missing for handling smart dates: https://hledger.org/1.30/hledger.html#smart-dates
