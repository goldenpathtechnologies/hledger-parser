import test, { TestFn } from 'ava';

import HLedgerLexer from '../../lib/lexer';
import * as utils from '../utils';

export interface LexerTest {
  pattern: string;
  expected: unknown[];
  title: string;
}

function tokenize(pattern: string) {
  return utils.simplifyLexResult(HLedgerLexer.tokenize(pattern));
}

// TODO: Remove this function when all lexer tests are using the macro function.
export function runLexerTests(avaTest: TestFn, tests: LexerTest[]) {
  for (const { pattern, expected, title } of tests) {
    avaTest(title, (t) => {
      const result = tokenize(pattern);

      t.deepEqual(result, expected, pattern);
    });
  }
}

export const macro = test.macro<[string, unknown[]]>((t, pattern, expected) => {
  const result = tokenize(pattern);

  t.deepEqual(result, expected, pattern);
});
