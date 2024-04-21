import test from 'ava';

import { parseLedgerToCST } from '../../index';
import CstToRawVisitor from '../../lib/visitors/cst_to_raw';
import * as Raw from '../../lib/visitors/raw_types';
import { assertNoLexingOrParsingErrors } from '../utils';

test('returns a price directive object', (t) => {
  const cstResult = parseLedgerToCST(`P 1900/01/01 $ 10CAD\n`);

  assertNoLexingOrParsingErrors(t, cstResult);

  const result = CstToRawVisitor.journal(cstResult.cstJournal.children);

  t.is(result.length, 1, 'should modify a price directive');
  t.is(result[0].type, 'priceDirective', 'should be a priceDirective object');
  t.deepEqual(
    (result[0] as Raw.PriceDirective).value,
    {
      date: {
        year: '1900',
        month: '01',
        day: '01',
        delimiter: '/'
      },
      commodity: '$',
      price: {
        number: '10',
        commodity: 'CAD',
        value: '10CAD',
        sign: undefined
      },
      comments: undefined,
      contentLines: []
    },
    'should correctly return all price directive fields'
  );
});

test('returns a price directive object with inline comment', (t) => {
  const cstResult = parseLedgerToCST(`P 1900/01/01 $ 10CAD ; comment\n`);

  assertNoLexingOrParsingErrors(t, cstResult);

  const result = CstToRawVisitor.journal(cstResult.cstJournal.children);

  t.is(result.length, 1, 'should modify a price directive');
  t.is(result[0].type, 'priceDirective', 'should be a priceDirective object');

  const priceDirective = result[0] as Raw.PriceDirective;

  t.truthy(
    priceDirective.value.comments,
    'price directive should contain an inline comment'
  );
  t.is(
    priceDirective.value.comments?.value[0],
    'comment',
    'price directive should contain the correct inline comment text'
  );
});

test('returns a price directive object with subdirective comments', (t) => {
  const cstResult = parseLedgerToCST(`P 1900/01/01 $ 10CAD
    ; subdirective comment
    ; more subdirective comments
`);

  assertNoLexingOrParsingErrors(t, cstResult);

  const result = CstToRawVisitor.journal(cstResult.cstJournal.children);

  t.is(result.length, 1, 'should modify a price directive');
  t.is(result[0].type, 'priceDirective', 'should be a priceDirective object');

  const priceDirective = result[0] as Raw.PriceDirective;

  t.is(
    priceDirective.value.contentLines.length,
    2,
    'price directive should contain two subdirective comments'
  );
  t.is(
    priceDirective.value.contentLines[0].value.inlineComment.value[0],
    'subdirective comment',
    'price directive should contain the correct subdirective comment text'
  );
  t.is(
    priceDirective.value.contentLines[1].value.inlineComment.value[0],
    'more subdirective comments',
    'price directive should contain the correct subdirective comment text'
  );
});
