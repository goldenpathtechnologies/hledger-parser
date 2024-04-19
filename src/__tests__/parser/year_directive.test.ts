import anyTest, { TestFn } from 'ava';

import {
  INDENT,
  InlineCommentText,
  NEWLINE,
  SemicolonComment,
  YearDirective,
  YearDirectiveValue
} from '../../lib/lexer/tokens';
import HLedgerParser from '../../lib/parser';
import { MockLexer, simplifyCst } from '../utils';

const test = anyTest as TestFn<{ lexer: MockLexer }>;

test.before((t) => {
  t.context = {
    lexer: new MockLexer()
  };
});

test('parses a year directive', (t) => {
  t.context.lexer
    .addToken(YearDirective, 'Y')
    .addToken(YearDirectiveValue, '2024')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.yearDirective()),
    {
      YearDirective: 1,
      YearDirectiveValue: 1,
      NEWLINE: 1
    },
    '<yearDirective> Y2024\\n'
  );
});

test('parses a year directive with an inline comment', (t) => {
  t.context.lexer
    .addToken(YearDirective, 'Y')
    .addToken(YearDirectiveValue, '2024')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'a comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.yearDirective()),
    {
      YearDirective: 1,
      YearDirectiveValue: 1,
      inlineComment: [
        {
          SemicolonComment: 1,
          inlineCommentItem: [
            {
              InlineCommentText: 1
            }
          ]
        }
      ],
      NEWLINE: 1
    },
    '<yearDirective> Y2024 ; a comment\\n'
  );
});

test('does not parse a year directive without a year value', (t) => {
  t.context.lexer.addToken(YearDirective, 'Y').addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.falsy(HLedgerParser.yearDirective(), '<yearDirective!> Y\\n');
});

test('parses a year directive with a content line', (t) => {
  t.context.lexer
    .addToken(YearDirective, 'Y')
    .addToken(YearDirectiveValue, '2024')
    .addToken(NEWLINE, '\n')
    .addToken(INDENT, '    ')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'a comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.yearDirective()),
    {
      YearDirective: 1,
      YearDirectiveValue: 1,
      NEWLINE: 1,
      yearDirectiveContentLine: [
        {
          INDENT: 1,
          NEWLINE: 1,
          inlineComment: [
            {
              SemicolonComment: 1,
              inlineCommentItem: [
                {
                  InlineCommentText: 1
                }
              ]
            }
          ]
        }
      ]
    },
    '<yearDirective> Y 2024\\n    ; a comment\\n'
  );
});

test('parses a year directive with several content lines', (t) => {
  t.context.lexer
    .addToken(YearDirective, 'Y')
    .addToken(YearDirectiveValue, '2024')
    .addToken(NEWLINE, '\n')
    .addToken(INDENT, '    ')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'a comment')
    .addToken(NEWLINE, '\n')
    .addToken(INDENT, '    ')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'another comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.yearDirective()),
    {
      YearDirective: 1,
      YearDirectiveValue: 1,
      NEWLINE: 1,
      yearDirectiveContentLine: [
        {
          INDENT: 1,
          NEWLINE: 1,
          inlineComment: [
            {
              SemicolonComment: 1,
              inlineCommentItem: [
                {
                  InlineCommentText: 1
                }
              ]
            }
          ]
        },
        {
          INDENT: 1,
          NEWLINE: 1,
          inlineComment: [
            {
              SemicolonComment: 1,
              inlineCommentItem: [
                {
                  InlineCommentText: 1
                }
              ]
            }
          ]
        }
      ]
    },
    '<yearDirective> Y 2024\\n    ; a comment\\n    ; another comment\\n'
  );
});

test('parses a year directive with an inline comment and a content line', (t) => {
  t.context.lexer
    .addToken(YearDirective, 'Y')
    .addToken(YearDirectiveValue, '2024')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'an inline comment')
    .addToken(NEWLINE, '\n')
    .addToken(INDENT, '    ')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'a comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.yearDirective()),
    {
      YearDirective: 1,
      YearDirectiveValue: 1,
      NEWLINE: 1,
      inlineComment: [
        {
          SemicolonComment: 1,
          inlineCommentItem: [
            {
              InlineCommentText: 1
            }
          ]
        }
      ],
      yearDirectiveContentLine: [
        {
          INDENT: 1,
          NEWLINE: 1,
          inlineComment: [
            {
              SemicolonComment: 1,
              inlineCommentItem: [
                {
                  InlineCommentText: 1
                }
              ]
            }
          ]
        }
      ]
    },
    '<yearDirective> Y 2024 ; an inline comment\\n    ; a comment\\n'
  );
});
