import test from 'ava';

import { macro } from './utils';

test('recognize a minimal transaction', macro, '01/01\n', [
  'DateAtStart',
  'NEWLINE'
]);

test(
  'recognize a realistic transaction',
  macro,
  `1900/01/01 New York Steakhouse
  Assets:Main Chequing  -$23.05 = $100.00
  Expenses:Food\n`,
  [
    'DateAtStart',
    'Text',
    'NEWLINE',
    'INDENT',
    { RealAccountName: ['Assets', 'Main Chequing'] },
    'DASH',
    { CommodityText: '$' },
    'Number',
    'AMOUNT_WS',
    'EQUALS',
    'AMOUNT_WS',
    { CommodityText: '$' },
    'Number',
    'NEWLINE',
    'INDENT',
    { RealAccountName: ['Expenses', 'Food'] },
    'NEWLINE'
  ]
);

test(
  'recognize a maximal transaction',
  macro,
  `1900/01/01 * (a) payee|memo ; comment and tag: value,
  Assets:Real          -$1.00 @ 20 "green apples" = -$1.00
  (Assets:Virtual)     2CAD @@ 20$ == 0.1
  [Assets:VirtualBal:Sub]  1.3e4 (@@) 0.4 *== 1 ; comment tag1: val1, tag2: val2
  ; another comment with a tag:value\n`,
  [
    'DateAtStart',
    'TxnStatusIndicator',
    { ParenValue: 'a' },
    'Text',
    'PIPE',
    'Memo',
    'SemicolonComment',
    'InlineCommentText',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'InlineCommentTagValue',
    'InlineCommentTagComma',
    'NEWLINE',
    'INDENT',
    { RealAccountName: ['Assets', 'Real'] },
    'DASH',
    { CommodityText: '$' },
    'Number',
    'AMOUNT_WS',
    'AT',
    'AMOUNT_WS',
    'Number',
    'AMOUNT_WS',
    { CommodityText: 'green apples' },
    'AMOUNT_WS',
    'EQUALS',
    'AMOUNT_WS',
    'DASH',
    { CommodityText: '$' },
    'Number',
    'NEWLINE',
    'INDENT',
    { VirtualAccountName: ['Assets', 'Virtual'] },
    'Number',
    { CommodityText: 'CAD' },
    'AMOUNT_WS',
    'AT',
    'AT',
    'AMOUNT_WS',
    'Number',
    { CommodityText: '$' },
    'AMOUNT_WS',
    'EQUALS',
    'EQUALS',
    'AMOUNT_WS',
    'Number',
    'NEWLINE',
    'INDENT',
    { VirtualBalancedAccountName: ['Assets', 'VirtualBal', 'Sub'] },
    'Number',
    'AMOUNT_WS',
    'LPAREN',
    'AT',
    'AT',
    'RPAREN',
    'AMOUNT_WS',
    'Number',
    'AMOUNT_WS',
    'ASTERISK',
    'EQUALS',
    'EQUALS',
    'AMOUNT_WS',
    'Number',
    'AMOUNT_WS',
    'SemicolonComment',
    'InlineCommentText',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'InlineCommentTagValue',
    'InlineCommentTagComma',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'InlineCommentTagValue',
    'NEWLINE',
    'INDENT',
    'SemicolonComment',
    'InlineCommentText',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'InlineCommentTagValue',
    'NEWLINE'
  ]
);

test(
  'recognize a transaction with a payee note containing pipe characters',
  macro,
  '1900/01/01 New York Steakhouse|memo|note|something else|',
  ['DateAtStart', 'Text', 'PIPE', 'Memo']
);

test(
  'does not recognize an invalid transaction date',
  macro,
  '2023-02-29 Invalid transaction',
  []
);

// TODO: Add tests with more date patterns: https://hledger.org/1.30/hledger.html#smart-dates
