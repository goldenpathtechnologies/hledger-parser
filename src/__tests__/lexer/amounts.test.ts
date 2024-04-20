import test from 'ava';

import { macro } from './utils';

const getExpectedOutput = (expected: unknown[]): unknown[] => {
  return [
    'DateAtStart',
    'Text',
    'NEWLINE',
    'INDENT',
    { RealAccountName: ['Assets', 'Main Chequing'] },
    ...expected,
    'NEWLINE',
    'INDENT',
    { RealAccountName: ['Expenses', 'Electronics'] },
    'NEWLINE'
  ];
};

test(
  'recognizes amounts as whole numbers',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    1000
  Expenses:Electronics\n`,
  getExpectedOutput(['Number'])
);

test(
  'recognizes amounts with decimal values',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    1000.00
  Expenses:Electronics\n`,
  getExpectedOutput(['Number'])
);

test(
  'recognizes negative whole number amounts',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    -1000
  Expenses:Electronics\n`,
  getExpectedOutput(['DASH', 'Number'])
);

test(
  'recognizes negative amounts with decimal values',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    -1000.00
  Expenses:Electronics\n`,
  getExpectedOutput(['DASH', 'Number'])
);

test(
  'recognizes explicitly positive amounts',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    +1000
  Expenses:Electronics\n`,
  getExpectedOutput(['PLUS', 'Number'])
);

test(
  'recognizes amounts with a prefixed commodity symbol',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    $1000
  Expenses:Electronics\n`,
  getExpectedOutput([{ CommodityText: '$' }, 'Number'])
);

test(
  'recognizes amounts with a suffixed commodity symbol',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    1000$
  Expenses:Electronics\n`,
  getExpectedOutput(['Number', { CommodityText: '$' }])
);

test(
  'recognizes amounts with a prefixed and space separated commodity symbol',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    $ 1000
  Expenses:Electronics\n`,
  getExpectedOutput([{ CommodityText: '$' }, 'AMOUNT_WS', 'Number'])
);

test(
  'recognizes amounts with a suffixed and space separated commodity symbol',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    1000 $
  Expenses:Electronics\n`,
  getExpectedOutput(['Number', 'AMOUNT_WS', { CommodityText: '$' }])
);

test(
  'recognizes amounts with a dash between symbol and number',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    $-1000
  Expenses:Electronics\n`,
  getExpectedOutput([{ CommodityText: '$' }, 'DASH', 'Number'])
);

test(
  'recognizes amounts with a dash and suffixed space between symbol and number',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    $- 1000
  Expenses:Electronics\n`,
  getExpectedOutput([{ CommodityText: '$' }, 'DASH', 'AMOUNT_WS', 'Number'])
);

test(
  'recognizes amounts with a dash and prefixed space between symbol and number',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    $ -1000
  Expenses:Electronics\n`,
  getExpectedOutput([{ CommodityText: '$' }, 'AMOUNT_WS', 'DASH', 'Number'])
);

test(
  'recognizes amounts with a space-wrapped dash between symbol and number',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    $ - 1000
  Expenses:Electronics\n`,
  getExpectedOutput([
    { CommodityText: '$' },
    'AMOUNT_WS',
    'DASH',
    'AMOUNT_WS',
    'Number'
  ])
);

test(
  'recognizes amounts with a dash, symbol and number, no spaces',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    -$1000
  Expenses:Electronics\n`,
  getExpectedOutput(['DASH', { CommodityText: '$' }, 'Number'])
);

test(
  'recognizes amounts with a dash and space preceding the symbol and number',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    - $1000
  Expenses:Electronics\n`,
  getExpectedOutput(['DASH', 'AMOUNT_WS', { CommodityText: '$' }, 'Number'])
);

test(
  'recognizes amounts with a dash and symbol preceding a space and number',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    -$ 1000
  Expenses:Electronics\n`,
  getExpectedOutput(['DASH', { CommodityText: '$' }, 'AMOUNT_WS', 'Number'])
);

test(
  'recognizes amounts with a dash, symbol and number, all space separated',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    - $ 1000
  Expenses:Electronics\n`,
  getExpectedOutput([
    'DASH',
    'AMOUNT_WS',
    { CommodityText: '$' },
    'AMOUNT_WS',
    'Number'
  ])
);

test(
  'recognizes amounts with a plus, symbol and number',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    +$1000
  Expenses:Electronics\n`,
  getExpectedOutput(['PLUS', { CommodityText: '$' }, 'Number'])
);

test(
  'recognizes amounts with a symbol, plus and number',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    $+1000
  Expenses:Electronics\n`,
  getExpectedOutput([{ CommodityText: '$' }, 'PLUS', 'Number'])
);

test(
  'recognizes amounts with a plus, symbol and number, all space separated',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    + $ 1000
  Expenses:Electronics\n`,
  getExpectedOutput([
    'PLUS',
    'AMOUNT_WS',
    { CommodityText: '$' },
    'AMOUNT_WS',
    'Number'
  ])
);

test(
  'recognizes amounts with a comma as amount decimal mark',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    -$1.000,00
  Expenses:Electronics\n`,
  getExpectedOutput(['DASH', { CommodityText: '$' }, 'Number'])
);

test(
  'recognizes amounts with a space as amount digit group mark',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    -$1 000.00
  Expenses:Electronics\n`,
  getExpectedOutput(['DASH', { CommodityText: '$' }, 'Number'])
);

test(
  'recognizes amounts with alternate digit groupings',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    -1,00,00,000.00 INR
  Expenses:Electronics\n`,
  getExpectedOutput(['DASH', 'Number', 'AMOUNT_WS', { CommodityText: 'INR' }])
);

test(
  "recognizes amounts with a non-space separated commodity starting with 'E'",
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    1.00EUR
  Expenses:Electronics\n`,
  getExpectedOutput(['Number', { CommodityText: 'EUR' }])
);

test(
  'recognizes amounts in balance assertions',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    $1.00 = $100.00
  Expenses:Electronics\n`,
  getExpectedOutput([
    { CommodityText: '$' },
    'Number',
    'AMOUNT_WS',
    'EQUALS',
    'AMOUNT_WS',
    { CommodityText: '$' },
    'Number'
  ])
);

test(
  'recognizes amounts in lot prices',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    5 foobar @@ $100.00
  Expenses:Electronics\n`,
  getExpectedOutput([
    'Number',
    'AMOUNT_WS',
    { CommodityText: 'foobar' },
    'AMOUNT_WS',
    'AT',
    'AT',
    'AMOUNT_WS',
    { CommodityText: '$' },
    'Number'
  ])
);

test(
  'recognizes amounts containing tabs and spaces',
  macro,
  `1900/01/01 transaction
  Assets:Main Chequing    $\t1.00\t =\t $\t100.00
  Expenses:Electronics\n`,
  getExpectedOutput([
    { CommodityText: '$' },
    'AMOUNT_WS',
    'Number',
    'AMOUNT_WS',
    'EQUALS',
    'AMOUNT_WS',
    { CommodityText: '$' },
    'AMOUNT_WS',
    'Number'
  ])
);
