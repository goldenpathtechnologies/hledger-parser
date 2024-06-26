import anyTest, { TestFn } from 'ava';

import {
  AccountDirective,
  AccountName,
  CommentText,
  CommodityDirective,
  CommodityText,
  DateAtStart,
  DefaultCommodityDirective,
  HASHTAG_AT_START,
  JournalNumber,
  MC_NEWLINE,
  MultilineComment,
  MultilineCommentEnd,
  MultilineCommentText,
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

test('parses a transaction init line', (t) => {
  t.context.lexer.addToken(DateAtStart, '1900/01/01').addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.journalItem()),
    {
      transaction: [
        {
          transactionInitLine: [
            {
              NEWLINE: 1,
              transactionDate: [
                {
                  DateAtStart: 1
                }
              ]
            }
          ]
        }
      ]
    },
    '<journalItem> 1900/01/01\\n'
  );
});

test('parses a hash tag full line comment', (t) => {
  t.context.lexer
    .addToken(HASHTAG_AT_START, '#')
    .addToken(CommentText, 'a full line comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.journalItem()),
    {
      lineComment: [
        {
          HASHTAG_AT_START: 1,
          CommentText: 1,
          NEWLINE: 1
        }
      ]
    },
    '<journalItem> # a full line comment\\n'
  );
});

test('parses a price directive', (t) => {
  t.context.lexer
    .addToken(PDirective, 'P')
    .addToken(SimpleDate, '2000/01/02')
    .addToken(PDirectiveCommodityText, '€')
    .addToken(CommodityText, '$')
    .addToken(JournalNumber, '1.50')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.journalItem()),
    {
      priceDirective: [
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
        }
      ]
    },
    '<journalItem> P 2000/01/02 € $1.50\\n'
  );
});

test('parses an account directive', (t) => {
  t.context.lexer
    .addToken(AccountDirective, 'account')
    .addToken(AccountName, 'Assets:Chequing')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.journalItem()),
    {
      accountDirective: [
        {
          AccountDirective: 1,
          AccountName: 1,
          NEWLINE: 1
        }
      ]
    },
    '<journalItem> account Assets:Chequing\\n'
  );
});

test('does not parse a transaction init line without newline termination', (t) => {
  t.context.lexer.addToken(SimpleDate, '1900/03/03');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.falsy(
    simplifyCst(HLedgerParser.journalItem()),
    '<journalItem!> 1900/03/03'
  );
});

test('does not parse a full line semicolon comment with incorrect token', (t) => {
  t.context.lexer
    .addToken(SemicolonComment, ';')
    .addToken(CommentText, 'a comment with wrong semicolon token');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.falsy(
    HLedgerParser.journalItem(),
    '<journalItem!> ; a comment with wrong semicolon token'
  );
});

test('parses a commodity directive', (t) => {
  t.context.lexer
    .addToken(CommodityDirective, 'commodity ')
    .addToken(CommodityText, 'CAD')
    .addToken(JournalNumber, '1000.00')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.journalItem()),
    {
      commodityDirective: [
        {
          CommodityDirective: 1,
          commodityAmount: [
            {
              CommodityText: 1,
              Number: 1
            }
          ],
          NEWLINE: 1
        }
      ]
    },
    '<journalItem> commodity CAD1000.00\\n'
  );
});

test('parses a default commodity directive', (t) => {
  t.context.lexer
    .addToken(DefaultCommodityDirective, 'D ')
    .addToken(CommodityText, 'CAD')
    .addToken(JournalNumber, '1000.00')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.journalItem()),
    {
      defaultCommodityDirective: [
        {
          DefaultCommodityDirective: 1,
          commodityAmount: [
            {
              CommodityText: 1,
              Number: 1
            }
          ],
          NEWLINE: 1
        }
      ]
    },
    '<journalItem> D CAD1000.00\\n'
  );
});

test('parses a multiline comment', (t) => {
  t.context.lexer
    .addToken(MultilineComment, 'comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentText, 'This is a comment')
    .addToken(MC_NEWLINE, '\n')
    .addToken(MultilineCommentEnd, 'end comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.journalItem()),
    {
      multilineComment: [
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
        }
      ]
    },
    '<journalItem> comment\\nThis is a comment\\nend comment\\n'
  );
});
