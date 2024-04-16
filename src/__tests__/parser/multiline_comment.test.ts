import anyTest, { TestFn } from 'ava';
import { EOF } from 'chevrotain';

import {
  MC_NEWLINE,
  MultilineComment,
  MultilineCommentEnd,
  MultilineCommentText,
  NEWLINE
} from '../../lib/lexer/tokens';
import HLedgerParser from '../../lib/parser';
import { MockLexer, simplifyCst } from '../utils';

const test = anyTest as TestFn<{ lexer: MockLexer }>;

test.before((t) => {
  t.context = {
    lexer: new MockLexer()
  };
});

test('parses an empty multiline comment', (t) => {
  t.context.lexer
    .addToken(MultilineComment, 'comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentEnd, 'end comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.multilineComment()),
    {
      MultilineComment: 1,
      MC_NEWLINE: 1,
      MultilineCommentEnd: 1,
      NEWLINE: 1
    },
    '<multilineComment> comment\\nend comment\\n'
  );
});

test('parses a multiline comment with one line of text', (t) => {
  t.context.lexer
    .addToken(MultilineComment, 'comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentText, 'This is a comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentEnd, 'end comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.multilineComment()),
    {
      MultilineComment: 1,
      MC_NEWLINE: 1,
      MultilineCommentEnd: 1,
      NEWLINE: 1,
      multilineCommentItem: [
        {
          MultilineCommentText: 1,
          MC_NEWLINE: 1
        }
      ]
    },
    '<multilineComment> comment\\nThis is a comment\\nend comment\\n'
  );
});

test('parses a multiline comment with several lines of text', (t) => {
  t.context.lexer
    .addToken(MultilineComment, 'comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentText, 'comment line')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentText, 'comment line')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentText, 'comment line')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentEnd, 'end comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.multilineComment()),
    {
      MultilineComment: 1,
      MC_NEWLINE: 1,
      MultilineCommentEnd: 1,
      NEWLINE: 1,
      multilineCommentItem: [
        {
          MultilineCommentText: 1,
          MC_NEWLINE: 1
        },
        {
          MultilineCommentText: 1,
          MC_NEWLINE: 1
        },
        {
          MultilineCommentText: 1,
          MC_NEWLINE: 1
        }
      ]
    },
    '<multilineComment> comment\\ncomment line\\ncomment line\\ncomment line\\nend comment\\n'
  );
});

test('does not parse tags in a multiline comment', (t) => {
  t.context.lexer
    .addToken(MultilineComment, 'comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(
      MultilineCommentText,
      'This is a comment with not-a-tag: and not a value'
    )
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentEnd, 'end comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.multilineComment()),
    {
      MultilineComment: 1,
      MC_NEWLINE: 1,
      MultilineCommentEnd: 1,
      NEWLINE: 1,
      multilineCommentItem: [
        {
          MultilineCommentText: 1,
          MC_NEWLINE: 1
        }
      ]
    },
    '<multilineComment> comment\\nThis is a comment with not-a-tag: and not a value\\nend comment\\n'
  );
});

test("parses a multiline comment containing the text 'end comment'", (t) => {
  t.context.lexer
    .addToken(MultilineComment, 'comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentText, 'This is not end comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentEnd, 'end comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.multilineComment()),
    {
      MultilineComment: 1,
      MC_NEWLINE: 1,
      MultilineCommentEnd: 1,
      NEWLINE: 1,
      multilineCommentItem: [
        {
          MultilineCommentText: 1,
          MC_NEWLINE: 1
        }
      ]
    },
    '<multilineComment> comment\\nThis is not end comment\\nend comment\\n'
  );
});

test('does not parse a multiline comment unless newline comes after terminator', (t) => {
  t.context.lexer
    .addToken(MultilineComment, 'comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentText, 'This is a comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentEnd, 'end comment');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.falsy(
    HLedgerParser.multilineComment(),
    '<multilineComment!> comment\\nThis is a comment\\nend comment'
  );
});

test('parses a multiline comment containing only newlines', (t) => {
  t.context.lexer
    .addToken(MultilineComment, 'comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentEnd, 'end comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.multilineComment()),
    {
      MultilineComment: 1,
      MC_NEWLINE: 1,
      MultilineCommentEnd: 1,
      NEWLINE: 1,
      multilineCommentItem: [
        {
          MC_NEWLINE: 1
        },
        {
          MC_NEWLINE: 1
        }
      ]
    },
    '<multilineComment> comment\\n\\n\\nend comment\\n'
  );
});

test('parses an unterminated multiline comment to EOF', (t) => {
  t.context.lexer
    .addToken(MultilineComment, 'comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentText, 'This is the end of the file')
    .addToken(EOF, '');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.multilineComment()),
    {
      MultilineComment: 1,
      MC_NEWLINE: 1,
      multilineCommentItem: [
        {
          MultilineCommentText: 1,
          EOF: 1
        }
      ]
    },
    '<multilineComment> comment\\nThis is the end of the file'
  );
});

test('does not parse a non-EOF multiline comment when text not terminated by newline', (t) => {
  // Note: This scenario would never happen in practice. However, this test is necessary for
  // ensuring that newlines after comment text are mandatory unless that text is followed by EOF.
  t.context.lexer
    .addToken(MultilineComment, 'comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentText, 'This is a comment')
    .addToken(MultilineCommentText, 'This is a comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentEnd, 'end comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.falsy(
    HLedgerParser.multilineComment(),
    '<multilineComment!> comment\\nThis is a commentThis is a comment\\nend comment\\n'
  );
});

// TODO: This is a CST to Raw test.
// test('does not parse a multiline comment terminator if not at start of line', (t) => {
//   t.context.lexer
//     .addToken(MultilineComment, 'comment')
//     .addToken(MC_NEWLINE, '\n')
//     .addToken(MultilineCommentEnd, ' end comment')
//     .addToken(NEWLINE, '\n');
//   HLedgerParser.input = t.context.lexer.tokenize();
//
//   t.falsy(
//     HLedgerParser.multilineComment(),
//     '<multilineComment!> comment\\n end comment\\n'
//   );
// });
