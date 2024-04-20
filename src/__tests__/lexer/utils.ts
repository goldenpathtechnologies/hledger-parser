// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava';

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

export const macro = test.macro<[string, unknown[]]>((t, pattern, expected) => {
  const result = tokenize(pattern);

  t.deepEqual(result, expected, `${pattern}`);
});
