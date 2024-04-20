import test from 'ava';

import { macro } from './utils';

test('recognize full-line comments starting with #', macro, '# a comment', [
  'HASHTAG_AT_START',
  'CommentText'
]);

test('recognize full-line comments starting with ;', macro, '; a comment', [
  'SEMICOLON_AT_START',
  'CommentText'
]);

test('recognize full-line comments starting with *', macro, '* a comment', [
  'ASTERISK_AT_START',
  'CommentText'
]);

test(
  'does not recognize tags in full-line comments',
  macro,
  '# a comment not-a-tag: not a tag value',
  ['HASHTAG_AT_START', 'CommentText']
);
