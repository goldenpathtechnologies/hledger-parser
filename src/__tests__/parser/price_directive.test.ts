import anyTest, { TestFn } from 'ava';

import {
  CommodityText,
  INDENT,
  InlineCommentText,
  JournalNumber,
  NEWLINE,
  PDirective,
  PDirectiveCommodityText,
  SemicolonComment,
  SimpleDate
} from '../../lib/lexer/tokens';
import HLedgerParser from '../../lib/parser';
import { MockLexer, simplifyCst } from '../utils';

const test = anyTest as TestFn<{ lexer: MockLexer }>;

test.before((t) => {
  t.context = {
    lexer: new MockLexer()
  };
});

test('parses a price directive line with commodity and price', (t) => {
  t.context.lexer
    .addToken(PDirective, 'P')
    .addToken(SimpleDate, '2000/01/01')
    .addToken(PDirectiveCommodityText, '€')
    .addToken(CommodityText, '$')
    .addToken(JournalNumber, '1.50')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.priceDirective()),
    {
      PDirective: 1,
      SimpleDate: 1,
      PDirectiveCommodityText: 1,
      NEWLINE: 1,
      amount: [
        {
          CommodityText: 1,
          Number: 1
        }
      ]
    },
    '<priceDirective> P 2000/01/01 € $1.50\\n'
  );
});

test('does not parse a price directive line without newline termination', (t) => {
  t.context.lexer
    .addToken(PDirective, 'P')
    .addToken(SimpleDate, '2000/01/01')
    .addToken(PDirectiveCommodityText, '€')
    .addToken(CommodityText, '$')
    .addToken(JournalNumber, '1.50');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.falsy(
    HLedgerParser.priceDirective(),
    '<priceDirective!> P 2000/01/01 € $1.50'
  );
});

test('does not parse a price directive line without an amount', (t) => {
  t.context.lexer
    .addToken(PDirective, 'P')
    .addToken(SimpleDate, '2000/01/01')
    .addToken(PDirectiveCommodityText, '€')
    .addToken(CommodityText, '$')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.falsy(
    HLedgerParser.priceDirective(),
    '<priceDirective!> P 2000/01/01 € $\\n'
  );
});

test('does not parse a price directive line without a date', (t) => {
  t.context.lexer
    .addToken(PDirective, 'P')
    .addToken(PDirectiveCommodityText, '€')
    .addToken(CommodityText, '$')
    .addToken(JournalNumber, '1.50')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.falsy(HLedgerParser.priceDirective(), '<priceDirective!> P € $1.50\\n');
});

test('parses a price directive with an inline comment', (t) => {
  t.context.lexer
    .addToken(PDirective, 'P')
    .addToken(SimpleDate, '2024.01.01')
    .addToken(PDirectiveCommodityText, '€')
    .addToken(CommodityText, '¥')
    .addToken(JournalNumber, '15000')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'a comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.priceDirective()),
    {
      PDirective: 1,
      SimpleDate: 1,
      PDirectiveCommodityText: 1,
      NEWLINE: 1,
      amount: [
        {
          CommodityText: 1,
          Number: 1
        }
      ],
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
    '<priceDirective> P 2024.01.01 € ¥15000 ; a comment\\n'
  );
});

test('parses a price directive with an inline comment and subdirective comment', (t) => {
  t.context.lexer
    .addToken(PDirective, 'P')
    .addToken(SimpleDate, '2024.01.01')
    .addToken(PDirectiveCommodityText, '€')
    .addToken(CommodityText, '¥')
    .addToken(JournalNumber, '15000')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'a comment')
    .addToken(NEWLINE, '\n')
    .addToken(INDENT, '    ')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'subdirective comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.priceDirective()),
    {
      PDirective: 1,
      SimpleDate: 1,
      PDirectiveCommodityText: 1,
      NEWLINE: 1,
      amount: [
        {
          CommodityText: 1,
          Number: 1
        }
      ],
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
      priceDirectiveContentLine: [
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
    '<priceDirective> P 2024.01.01 € ¥15000 ; a comment\\n    ; subdirective comment\\n'
  );
});

test('parses a price directive with several subdirective comments', (t) => {
  t.context.lexer
    .addToken(PDirective, 'P')
    .addToken(SimpleDate, '2024.01.01')
    .addToken(PDirectiveCommodityText, '€')
    .addToken(CommodityText, '¥')
    .addToken(JournalNumber, '15000')
    .addToken(NEWLINE, '\n')
    .addToken(INDENT, '    ')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'subdirective comment')
    .addToken(NEWLINE, '\n')
    .addToken(INDENT, '    ')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'another comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.priceDirective()),
    {
      PDirective: 1,
      SimpleDate: 1,
      PDirectiveCommodityText: 1,
      NEWLINE: 1,
      amount: [
        {
          CommodityText: 1,
          Number: 1
        }
      ],
      priceDirectiveContentLine: [
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
    '<priceDirective> P 2024.01.01 € ¥15000\\n    ; subdirective comment\\n    ; another comment\\n'
  );
});
