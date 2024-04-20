import test from 'ava';

import { macro } from './utils';

test('recognizes a simple commodity directive', macro, 'commodity USD', [
  'CommodityDirective',
  { CommodityText: 'USD' }
]);

test(
  'recognizes a simple commodity directive with end of line at end',
  macro,
  'commodity USD\n',
  ['CommodityDirective', { CommodityText: 'USD' }, 'NEWLINE']
);

test(
  'recognizes a commodity directive with inline format definition',
  macro,
  'commodity $1000.00',
  ['CommodityDirective', { CommodityText: '$' }, 'Number']
);

test(
  'recognizes a commodity directive where inline format lacks disambiguating decimal mark',
  macro,
  'commodity $1000',
  ['CommodityDirective', { CommodityText: '$' }, 'Number']
);

test(
  'recognizes a commodity directive where inline format has digit group mark',
  macro,
  'commodity $1,000.00',
  ['CommodityDirective', { CommodityText: '$' }, 'Number']
);

test(
  'recognizes a commodity directive where commodity text is suffixed and space-separated from number',
  macro,
  'commodity 1000.00 USD',
  ['CommodityDirective', 'Number', 'AMOUNT_WS', { CommodityText: 'USD' }]
);

test(
  'recognizes a commodity directive where commodity text is prefixed and space-separated from number',
  macro,
  'commodity USD 1000.00',
  ['CommodityDirective', { CommodityText: 'USD' }, 'AMOUNT_WS', 'Number']
);

test(
  'recognizes a commodity directive with inline format and an inline comment',
  macro,
  'commodity $1,000.00 ; comment\n',
  [
    'CommodityDirective',
    { CommodityText: '$' },
    'Number',
    'AMOUNT_WS',
    'SemicolonComment',
    'InlineCommentText',
    'NEWLINE'
  ]
);

test(
  'recognizes a format subdirective',
  macro,
  `commodity CAD
  format 1000.00 CAD`,
  [
    'CommodityDirective',
    { CommodityText: 'CAD' },
    'NEWLINE',
    'INDENT',
    'FormatSubdirective',
    'Number',
    'AMOUNT_WS',
    { CommodityText: 'CAD' }
  ]
);

test(
  'recognizes a format subdirective with an inline comment',
  macro,
  `commodity CAD
  format 1000.00 CAD ; comment\n`,
  [
    'CommodityDirective',
    { CommodityText: 'CAD' },
    'NEWLINE',
    'INDENT',
    'FormatSubdirective',
    'Number',
    'AMOUNT_WS',
    { CommodityText: 'CAD' },
    'AMOUNT_WS',
    'SemicolonComment',
    'InlineCommentText',
    'NEWLINE'
  ]
);

test(
  'recognizes a commodity directive with format subdirective and a subdirective comment',
  macro,
  `commodity CAD
  format 1000.00 CAD
  ; comment\n`,
  [
    'CommodityDirective',
    { CommodityText: 'CAD' },
    'NEWLINE',
    'INDENT',
    'FormatSubdirective',
    'Number',
    'AMOUNT_WS',
    { CommodityText: 'CAD' },
    'NEWLINE',
    'INDENT',
    'SemicolonComment',
    'InlineCommentText',
    'NEWLINE'
  ]
);

test(
  'recognizes a commodity directive with subdirective comment preceding format subdirective',
  macro,
  `commodity CAD
  ; comment
  format 1000.00 CAD`,
  [
    'CommodityDirective',
    { CommodityText: 'CAD' },
    'NEWLINE',
    'INDENT',
    'SemicolonComment',
    'InlineCommentText',
    'NEWLINE',
    'INDENT',
    'FormatSubdirective',
    'Number',
    'AMOUNT_WS',
    { CommodityText: 'CAD' }
  ]
);

test(
  'recognizes a commodity directive with multiple subdirective comments and a format subdirective',
  macro,
  `commodity CAD
  ; comment
  ; comment
  format 1000.00 CAD
  ; comment\n`,
  [
    'CommodityDirective',
    { CommodityText: 'CAD' },
    'NEWLINE',
    'INDENT',
    'SemicolonComment',
    'InlineCommentText',
    'NEWLINE',
    'INDENT',
    'SemicolonComment',
    'InlineCommentText',
    'NEWLINE',
    'INDENT',
    'FormatSubdirective',
    'Number',
    'AMOUNT_WS',
    { CommodityText: 'CAD' },
    'NEWLINE',
    'INDENT',
    'SemicolonComment',
    'InlineCommentText',
    'NEWLINE'
  ]
);

test('recognizes a default commodity directive', macro, 'D $1000.00', [
  'DefaultCommodityDirective',
  { CommodityText: '$' },
  'Number'
]);

test(
  'recognizes a default commodity directive where currency format lacks disambiguating decimal mark',
  macro,
  'D $1000',
  ['DefaultCommodityDirective', { CommodityText: '$' }, 'Number']
);

test(
  'recognizes a default commodity directive where currency format has digit group mark',
  macro,
  'D $1,000.00',
  ['DefaultCommodityDirective', { CommodityText: '$' }, 'Number']
);

test(
  'recognizes a default commodity directive where commodity text is suffixed and space-separated from number',
  macro,
  'D 1000.00 USD',
  ['DefaultCommodityDirective', 'Number', 'AMOUNT_WS', { CommodityText: 'USD' }]
);

test(
  'recognizes a default commodity directive where commodity text is prefixed and space-separated from number',
  macro,
  'D USD 1000.00',
  ['DefaultCommodityDirective', { CommodityText: 'USD' }, 'AMOUNT_WS', 'Number']
);

test(
  'recognizes a default commodity directive with an inline comment',
  macro,
  'D $1,000.00 ; comment\n',
  [
    'DefaultCommodityDirective',
    { CommodityText: '$' },
    'Number',
    'AMOUNT_WS',
    'SemicolonComment',
    'InlineCommentText',
    'NEWLINE'
  ]
);
