import test from 'ava';

import { macro } from './utils';

test(
  'recognize currency and alphanumeric commodities',
  macro,
  'P 1900/01/01 $ 1 CAD',
  [
    'PDirective',
    'SimpleDate',
    { PDirectiveCommodityText: '$' },
    'Number',
    'AMOUNT_WS',
    { CommodityText: 'CAD' }
  ]
);

test(
  'recognize commodities that are a mix of alphanumeric and currency symbols',
  macro,
  'P 1900/01/01 $US 1 CAD',
  [
    'PDirective',
    'SimpleDate',
    { PDirectiveCommodityText: '$US' },
    'Number',
    'AMOUNT_WS',
    { CommodityText: 'CAD' }
  ]
);

test(
  'recognize commodities preceding a price number',
  macro,
  'P 1900/01/01 USD $1',
  [
    'PDirective',
    'SimpleDate',
    { PDirectiveCommodityText: 'USD' },
    { CommodityText: '$' },
    'Number'
  ]
);

test(
  'recognize commodities preceding a price number with a negative in front of the commodity',
  macro,
  'P 1900/01/01 USD -$1',
  [
    'PDirective',
    'SimpleDate',
    { PDirectiveCommodityText: 'USD' },
    'DASH',
    { CommodityText: '$' },
    'Number'
  ]
);

test(
  'recognize commodities preceding a price number with a positive in front of the commodity',
  macro,
  'P 1900/01/01 USD +$1',
  [
    'PDirective',
    'SimpleDate',
    { PDirectiveCommodityText: 'USD' },
    'PLUS',
    { CommodityText: '$' },
    'Number'
  ]
);

test('recognize numbers with a decimal', macro, 'P 1900/01/01 USD $1.199', [
  'PDirective',
  'SimpleDate',
  { PDirectiveCommodityText: 'USD' },
  { CommodityText: '$' },
  'Number'
]);

test('recognize numbers with a comma', macro, 'P 1900/01/01 USD $1,199', [
  'PDirective',
  'SimpleDate',
  { PDirectiveCommodityText: 'USD' },
  { CommodityText: '$' },
  'Number'
]);

test(
  'recognize numbers with a comma and a decimal',
  macro,
  'P 1900/01/01 USD $1,199.02',
  [
    'PDirective',
    'SimpleDate',
    { PDirectiveCommodityText: 'USD' },
    { CommodityText: '$' },
    'Number'
  ]
);

test('recognize date without a year', macro, 'P 01/01 USD $1,199.02', [
  'PDirective',
  'SimpleDate',
  { PDirectiveCommodityText: 'USD' },
  { CommodityText: '$' },
  'Number'
]);

test(
  'recognize date with only 1 month digit',
  macro,
  'P 1900/1/01 USD $1,199.02',
  [
    'PDirective',
    'SimpleDate',
    { PDirectiveCommodityText: 'USD' },
    { CommodityText: '$' },
    'Number'
  ]
);

test(
  'recognize date with only 1 date digit',
  macro,
  'P 1900/01/1 USD $1,199.02',
  [
    'PDirective',
    'SimpleDate',
    { PDirectiveCommodityText: 'USD' },
    { CommodityText: '$' },
    'Number'
  ]
);

test(
  'reject lowercase p for price directive',
  macro,
  'p 1900/01/01 USD -$1',
  []
);

test(
  'recognizes an inline comment',
  macro,
  'P 2024.01.03 USD $1.37 ; comment\n',
  [
    'PDirective',
    'SimpleDate',
    { PDirectiveCommodityText: 'USD' },
    { CommodityText: '$' },
    'Number',
    'AMOUNT_WS',
    'SemicolonComment',
    'InlineCommentText',
    'NEWLINE'
  ]
);
