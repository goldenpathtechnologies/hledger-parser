import test from 'ava';

import { macro } from './utils';

test(
  'recognize account directive and name with double-space at end',
  macro,
  'account Assets:Chequing  ',
  ['AccountDirective', { AccountName: ['Assets', 'Chequing'] }, 'DOUBLE_WS']
);

test(
  'recognize account directive and name with end of line at end',
  macro,
  'account Assets:Chequing\n',
  ['AccountDirective', { AccountName: ['Assets', 'Chequing'] }, 'NEWLINE']
);

test(
  'recognize account directive and name with comment at end',
  macro,
  'account Assets:Chequing  ; a comment\n',
  [
    'AccountDirective',
    { AccountName: ['Assets', 'Chequing'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentText',
    'NEWLINE'
  ]
);

test(
  'recognize account directive and name with comment with a tag at end',
  macro,
  'account Assets:Chequing  ; a comment with: a tag\n',
  [
    'AccountDirective',
    { AccountName: ['Assets', 'Chequing'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentText',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'InlineCommentTagValue',
    'NEWLINE'
  ]
);

test(
  'recognize account directive and name with comment on the next line',
  macro,
  'account Assets:Chequing\n    ; a comment\n',
  [
    'AccountDirective',
    { AccountName: ['Assets', 'Chequing'] },
    'NEWLINE',
    'INDENT',
    'SemicolonComment',
    'InlineCommentText',
    'NEWLINE'
  ]
);

test(
  'ignore ( and treat it as part of the account name of a real account (hledger bug)',
  macro,
  'account (Assets:Chequing)  ',
  ['AccountDirective', { AccountName: ['(Assets', 'Chequing)'] }, 'DOUBLE_WS']
);

test(
  'ignore [ and treat it as part of the account name of a real account (hledger bug)',
  macro,
  'account [Assets:Chequing]  ',
  ['AccountDirective', { AccountName: ['[Assets', 'Chequing]'] }, 'DOUBLE_WS']
);
