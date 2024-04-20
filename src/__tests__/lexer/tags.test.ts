import test from 'ava';

import { macro } from './utils';

test('recognizes a tag', macro, 'account Assets  ; tag:\n', [
  'AccountDirective',
  { AccountName: ['Assets'] },
  'DOUBLE_WS',
  'SemicolonComment',
  'InlineCommentTagName',
  'InlineCommentTagColon',
  'NEWLINE'
]);

test('recognizes multiple tags', macro, 'account Assets  ; tag1:,tag2:\n', [
  'AccountDirective',
  { AccountName: ['Assets'] },
  'DOUBLE_WS',
  'SemicolonComment',
  'InlineCommentTagName',
  'InlineCommentTagColon',
  'InlineCommentTagComma',
  'InlineCommentTagName',
  'InlineCommentTagColon',
  'NEWLINE'
]);

test('recognizes a tag with a value', macro, 'account Assets  ; tag: value\n', [
  'AccountDirective',
  { AccountName: ['Assets'] },
  'DOUBLE_WS',
  'SemicolonComment',
  'InlineCommentTagName',
  'InlineCommentTagColon',
  'InlineCommentTagValue',
  'NEWLINE'
]);

test(
  'recognizes multiple tags with values',
  macro,
  'account Assets  ; tag1: value1,tag2:value2\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'InlineCommentTagValue',
    'InlineCommentTagComma',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'InlineCommentTagValue',
    'NEWLINE'
  ]
);

test(
  'recognizes a comment preceding a tag',
  macro,
  'account Assets  ; comment tag:\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentText',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'NEWLINE'
  ]
);

test(
  'recognizes a tag preceding a comment',
  macro,
  'account Assets  ; tag:, comment\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'InlineCommentTagComma',
    'InlineCommentText',
    'NEWLINE'
  ]
);

test(
  'recognizes a tag with a value preceding a comment',
  macro,
  'account Assets  ; tag: value, comment\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'InlineCommentTagValue',
    'InlineCommentTagComma',
    'InlineCommentText',
    'NEWLINE'
  ]
);

test(
  'recognizes a comment between two tags',
  macro,
  'account Assets  ; tag1:, comment tag2:\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'InlineCommentTagComma',
    'InlineCommentText',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'NEWLINE'
  ]
);

test('ignores colon preceding a tag', macro, 'account Assets  ; :tag:\n', [
  'AccountDirective',
  { AccountName: ['Assets'] },
  'DOUBLE_WS',
  'SemicolonComment',
  'InlineCommentText',
  'InlineCommentTagName',
  'InlineCommentTagColon',
  'NEWLINE'
]);

test(
  'recognizes a tag value containing colons',
  macro,
  'account Assets  ; :tag1:tag2:tag3:\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
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
  'recognizes a tag name containing unusual characters',
  macro,
  'account Assets  ; ~`!@#$%^&*()_-+={},[]\\|"\'.<;>tag1:\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'NEWLINE'
  ]
);

test(
  'recognizes a tag name containing Unicode characters (Simplified Chinese)',
  macro,
  'account Assets  ; 标签:\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'NEWLINE'
  ]
);

test(
  'recognizes a tag name containing Unicode characters (Arabic)',
  macro,
  'account Assets  ; بطاقةشعار:\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'NEWLINE'
  ]
);

test(
  'recognizes a tag name containing Unicode characters (Hebrew)',
  macro,
  'account Assets  ; תָג:\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'NEWLINE'
  ]
);

test(
  'recognizes a tag name containing Unicode characters (Ukrainian)',
  macro,
  'account Assets  ; Тег:\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'NEWLINE'
  ]
);

test(
  'recognizes a tag name consisting of a single comma',
  macro,
  'account Assets  ; ,:value\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'InlineCommentTagValue',
    'NEWLINE'
  ]
);

test(
  'recognizes comment text consisting of repeated colons preceding a tag',
  macro,
  'account Assets  ; ::::::tag1:\n',
  [
    'AccountDirective',
    { AccountName: ['Assets'] },
    'DOUBLE_WS',
    'SemicolonComment',
    'InlineCommentText',
    'InlineCommentTagName',
    'InlineCommentTagColon',
    'NEWLINE'
  ]
);
