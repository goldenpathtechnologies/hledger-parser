import test from 'ava';

import { parseLedgerToCST } from '../../index';
import CstToRawVisitor from '../../lib/visitors/cst_to_raw';
import * as Raw from '../../lib/visitors/raw_types';

test('returns a multiline comment object when comment is empty', (t) => {
  const result = CstToRawVisitor.journal(
    parseLedgerToCST(`comment
end comment
`).cstJournal.children
  );
  t.is(result.length, 1, 'should modify an empty multiline comment');

  const multilineComment = result[0] as Raw.MultilineComment;

  t.is(
    multilineComment.type,
    'multilineComment',
    'should be a multiline comment object'
  );
  t.is(
    multilineComment.value.length,
    0,
    'multiline comment object should contain no items'
  );
});

test('returns a multiline comment object when comment contains only newlines', (t) => {
  const result = CstToRawVisitor.journal(
    parseLedgerToCST(`comment

end comment
`).cstJournal.children
  );

  const multilineComment = result[0] as Raw.MultilineComment;

  t.is(
    multilineComment.value.length,
    1,
    'multiline comment object should contain a single item'
  );
  t.is(multilineComment.value[0], '', 'multiline comment item should be empty');
});

test('returns a multiline comment object containing a single line of text', (t) => {
  const result = CstToRawVisitor.journal(
    parseLedgerToCST(`comment
This is a comment.
end comment
`).cstJournal.children
  );

  const multilineComment = result[0] as Raw.MultilineComment;

  t.is(
    multilineComment.value.length,
    1,
    'multiline comment object should contain a single item'
  );
  t.is(
    multilineComment.value[0],
    'This is a comment.',
    'multiline comment item should contain text'
  );
});

test('returns a multiline comment object containing several lines of text', (t) => {
  const result = CstToRawVisitor.journal(
    parseLedgerToCST(`comment
This is a comment.
Another comment.
Yet another comment.
end comment
`).cstJournal.children
  );

  const multilineComment = result[0] as Raw.MultilineComment;

  t.is(
    multilineComment.value.length,
    3,
    'multiline comment object should contain a 3 items'
  );
  t.is(
    multilineComment.value[0],
    'This is a comment.',
    'multiline comment item should contain text'
  );
  t.is(
    multilineComment.value[1],
    'Another comment.',
    'multiline comment item should contain text'
  );
  t.is(
    multilineComment.value[2],
    'Yet another comment.',
    'multiline comment item should contain text'
  );
});

test('returns a multiline comment object terminated by EOF', (t) => {
  const result = CstToRawVisitor.journal(
    parseLedgerToCST(`comment
This is a comment.`).cstJournal.children
  );

  const multilineComment = result[0] as Raw.MultilineComment;

  t.is(
    multilineComment.value.length,
    1,
    'multiline comment object should contain 1 item'
  );
  t.is(
    multilineComment.value[0],
    'This is a comment.',
    'multiline comment item should contain text'
  );
});
