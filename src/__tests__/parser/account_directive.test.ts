import anyTest, { TestFn } from 'ava';

import {
  AccountDirective,
  AccountName,
  DOUBLE_WS,
  INDENT,
  InlineCommentText,
  NEWLINE,
  SemicolonComment,
  VirtualAccountName,
  VirtualBalancedAccountName
} from '../../lib/lexer/tokens';
import HLedgerParser from '../../lib/parser';
import { MockLexer, simplifyCst } from '../utils';

const test = anyTest as TestFn<{ lexer: MockLexer }>;

test.before((t) => {
  t.context = {
    lexer: new MockLexer()
  };
});

test('parses an account directive', (t) => {
  t.context.lexer
    .addToken(AccountDirective, 'account')
    .addToken(AccountName, 'Assets:Chequing')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.accountDirective()),
    {
      AccountDirective: 1,
      AccountName: 1,
      NEWLINE: 1
    },
    '<accountDirective> account Assets:Chequing\\n'
  );
});

test('parses an account directive with inline comment', (t) => {
  t.context.lexer
    .addToken(AccountDirective, 'account')
    .addToken(AccountName, 'Assets:Chequing')
    .addToken(DOUBLE_WS, '  ')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'a comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.accountDirective()),
    {
      AccountDirective: 1,
      AccountName: 1,
      NEWLINE: 1,
      DOUBLE_WS: 1,
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
    '<accountDirective> account Assets:Chequing  ; a comment\\n'
  );
});

test('parses an account directive with a content line', (t) => {
  t.context.lexer
    .addToken(AccountDirective, 'account')
    .addToken(AccountName, 'Assets:Chequing')
    .addToken(NEWLINE, '\n')
    .addToken(INDENT, '    ')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'a comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.deepEqual(
    simplifyCst(HLedgerParser.accountDirective()),
    {
      AccountDirective: 1,
      AccountName: 1,
      NEWLINE: 1,
      accountDirectiveContentLine: [
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
    '<accountDirective> account Assets:Chequing\\n    ; a comment\\n'
  );
});

test('parses an account directive with multiple content lines', (t) => {
  t.context.lexer
    .addToken(AccountDirective, 'account')
    .addToken(AccountName, 'Assets:Chequing')
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
    simplifyCst(HLedgerParser.accountDirective()),
    {
      AccountDirective: 1,
      AccountName: 1,
      NEWLINE: 1,
      accountDirectiveContentLine: [
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
    '<accountDirective> account Assets:Chequing\\n    ; a comment\\n    ; another comment\\n'
  );
});

test('does not parse virtual account in account directive', (t) => {
  t.context.lexer
    .addToken(AccountDirective, 'account')
    .addToken(VirtualAccountName, '(Assets:Chequing)')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.falsy(
    HLedgerParser.accountDirective(),
    '<accountDirective!> account (Assets:Chequing)\\n'
  );
});

test('does not parse virtual balanced account in account directive', (t) => {
  t.context.lexer
    .addToken(AccountDirective, 'account')
    .addToken(VirtualBalancedAccountName, '[Assets:Chequing]')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.falsy(
    HLedgerParser.accountDirective(),
    '<accountDirective!> account [Assets:Chequing]\\n'
  );
});

test('does not parse an account directive without a double whitespace delimiting an inline comment', (t) => {
  t.context.lexer
    .addToken(AccountDirective, 'account')
    .addToken(AccountName, 'Assets:Chequing')
    .addToken(SemicolonComment, ';')
    .addToken(InlineCommentText, 'comment')
    .addToken(NEWLINE, '\n');
  HLedgerParser.input = t.context.lexer.tokenize();

  t.falsy(
    HLedgerParser.accountDirective(),
    '<accountDirective!> account Assets:Chequing ; comment\\n'
  );
});
