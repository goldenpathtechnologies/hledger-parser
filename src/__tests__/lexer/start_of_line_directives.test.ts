import test from 'ava';

import { macro } from './utils';

test(
  "reject a line starting with anything other than date, indent, ;, #, *, 'account', or 'P'",
  macro,
  'An Account:Test',
  []
);

// TODO: Write tests for each start of line directive.
