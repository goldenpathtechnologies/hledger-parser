import test from 'ava';

import { macro } from './utils';

test('recognizes a year directive', macro, 'Y2024 ', [
  'YearDirective',
  'YearDirectiveValue'
]);

test('recognizes a year directive with an optional space', macro, 'Y 2024 ', [
  'YearDirective',
  'YearDirectiveValue'
]);

test(
  'recognizes a year directive with a newline at the end',
  macro,
  'Y 2024\n',
  ['YearDirective', 'YearDirectiveValue', 'NEWLINE']
);

test(
  'recognizes a year directive with a comment at the end',
  macro,
  'Y 2024 ; a comment\n',
  [
    'YearDirective',
    'YearDirectiveValue',
    'SemicolonComment',
    'InlineCommentText',
    'NEWLINE'
  ]
);

test('recognizes deprecated year directive form', macro, 'year 2024 ', [
  'YearDirective',
  'YearDirectiveValue'
]);

test(
  'recognizes alternative deprecated year directive form',
  macro,
  'apply year 2024 ',
  ['YearDirective', 'YearDirectiveValue']
);

test(
  'recognizes deprecated year directive form without optional space',
  macro,
  'year2024 ',
  ['YearDirective', 'YearDirectiveValue']
);

test(
  'recognizes alternative deprecated year directive form without optional space',
  macro,
  'apply year2024 ',
  ['YearDirective', 'YearDirectiveValue']
);

test('does not recognize an invalid year directive value', macro, 'Y2024a ', [
  'YearDirective'
]);

test('recognizes a five digit year in year directive', macro, 'Y12024 ', [
  'YearDirective',
  'YearDirectiveValue'
]);
