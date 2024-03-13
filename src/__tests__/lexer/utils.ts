import HLedgerLexer from '../../lib/lexer';
import * as utils from '../utils';

import type { TestInterface } from 'ava';

export interface LexerTest {
  pattern: string;
  expected: unknown[];
  title: string;
}

function tokenize(pattern: string) {
  return utils.simplifyLexResult(HLedgerLexer.tokenize(pattern));
}

export function runLexerTests(avaTest: TestInterface, tests: LexerTest[]) {
  for (const { pattern, expected, title } of tests) {
    avaTest(title, (t) => {
      const result = tokenize(pattern);

      t.deepEqual(result, expected, pattern);
    });
  }
}
