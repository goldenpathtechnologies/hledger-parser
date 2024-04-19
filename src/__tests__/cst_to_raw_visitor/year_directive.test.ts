import test from 'ava';

import { parseLedgerToCST } from '../../index';
import CstToRawVisitor from '../../lib/visitors/cst_to_raw';
import * as Raw from '../../lib/visitors/raw_types';
import { assertNoLexingOrParsingErrors } from '../utils';

test('returns a year directive object', (t) => {
  const cstResults = [
    parseLedgerToCST('Y2024\n'),
    parseLedgerToCST('Y 2024\n'),
    parseLedgerToCST('year2024\n'),
    parseLedgerToCST('year 2024\n'),
    parseLedgerToCST('apply year2024\n'),
    parseLedgerToCST('apply year 2024\n')
  ];

  for (const cstResult of cstResults) {
    assertNoLexingOrParsingErrors(t, cstResult);

    const result = CstToRawVisitor.journal(cstResult.cstJournal.children);

    t.is(result.length, 1, 'should modify a year directive');
    t.is(result[0].type, 'yearDirective', 'should be a yearDirective object');
    t.deepEqual(
      (result[0] as Raw.YearDirective).value,
      {
        year: '2024',
        comments: undefined,
        contentLines: []
      },
      'should correctly return a year directive object'
    );
  }
});

test('returns a year directive object with a comment', (t) => {
  const cstResult = parseLedgerToCST('Y 2024 ; a comment\n');

  assertNoLexingOrParsingErrors(t, cstResult);

  const result = CstToRawVisitor.journal(cstResult.cstJournal.children);

  t.is(result.length, 1, 'should modify a year directive');
  t.is(result[0].type, 'yearDirective', 'should be a yearDirective object');
  t.truthy(
    (result[0] as Raw.YearDirective).value.comments,
    'should contain a comment field'
  );
  t.is(
    (result[0] as Raw.YearDirective).value.comments?.value.length,
    1,
    'should contain a single comment item'
  );
});

test('returns a year directive a content line', (t) => {
  const cstResult = parseLedgerToCST(`Y 2024
    ; content line
`);

  assertNoLexingOrParsingErrors(t, cstResult);

  const result = CstToRawVisitor.journal(cstResult.cstJournal.children);

  t.is(
    result.length,
    1,
    'should modify a year directive with a sub-directive comment'
  );
  t.is(result[0].type, 'yearDirective', 'should be a yearDirective object');
  t.is(
    (result[0] as Raw.YearDirective).value.contentLines.length,
    1,
    'should contain a year directive content line'
  );
});

test('return a year directive with an inline comment and content line', (t) => {
  const cstResult = parseLedgerToCST(`Y 2024 ; inline comment
    ; content line
`);

  assertNoLexingOrParsingErrors(t, cstResult);

  const result = CstToRawVisitor.journal(cstResult.cstJournal.children);

  t.is(
    result.length,
    1,
    'should modify a year directive with a sub-directive comment'
  );
  t.is(result[0].type, 'yearDirective', 'should be a yearDirective object');
  t.truthy(
    (result[0] as Raw.YearDirective).value.comments,
    'should contain a comment field'
  );
  t.is(
    (result[0] as Raw.YearDirective).value.comments?.value.length,
    1,
    'should contain a single comment item'
  );
  t.is(
    (result[0] as Raw.YearDirective).value.contentLines.length,
    1,
    'should contain a year directive content line'
  );
});

test('return a year directive with several content lines', (t) => {
  const cstResult = parseLedgerToCST(`Y 2024 ; inline comment
    ; content line
    ; another line
    ; yet another line
`);

  assertNoLexingOrParsingErrors(t, cstResult);

  const result = CstToRawVisitor.journal(cstResult.cstJournal.children);

  t.is(
    result.length,
    1,
    'should modify a year directive with a sub-directive comment'
  );
  t.is(result[0].type, 'yearDirective', 'should be a yearDirective object');
  t.is(
    (result[0] as Raw.YearDirective).value.contentLines.length,
    3,
    'should contain several year directive content lines'
  );
});
