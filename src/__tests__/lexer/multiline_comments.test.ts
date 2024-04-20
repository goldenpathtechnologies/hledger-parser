import test from 'ava';

import { macro } from './utils';

test('recognize multiline comment', macro, 'comment', ['MultilineComment']);

test(
  'recognize multiline comment terminator',
  macro,
  `comment
end comment
`,
  ['MultilineComment', 'MC_NEWLINE', 'MultilineCommentEnd', 'NEWLINE']
);

test(
  'recognize multiline comment text',
  macro,
  `comment
This is a multiline comment
end comment
`,
  [
    'MultilineComment',
    'MC_NEWLINE',
    'MultilineCommentText',
    'MC_NEWLINE',
    'MultilineCommentEnd',
    'NEWLINE'
  ]
);

test(
  'recognize several lines of multiline comment text',
  macro,
  `comment
This is a multiline comment
This is a multiline comment
This is a multiline comment
This is a multiline comment
end comment
`,
  [
    'MultilineComment',
    'MC_NEWLINE',
    'MultilineCommentText',
    'MC_NEWLINE',
    'MultilineCommentText',
    'MC_NEWLINE',
    'MultilineCommentText',
    'MC_NEWLINE',
    'MultilineCommentText',
    'MC_NEWLINE',
    'MultilineCommentEnd',
    'NEWLINE'
  ]
);

test(
  'does not recognize tags in multiline comments',
  macro,
  `comment
This is a multiline comment with not-a-tag: and not a value
end comment
`,
  [
    'MultilineComment',
    'MC_NEWLINE',
    'MultilineCommentText',
    'MC_NEWLINE',
    'MultilineCommentEnd',
    'NEWLINE'
  ]
);

test(
  'only recognizes multiline comment terminator at the beginning of a line',
  macro,
  `comment
This is a multiline comment with end comment in the text
end comment
`,
  [
    'MultilineComment',
    'MC_NEWLINE',
    'MultilineCommentText',
    'MC_NEWLINE',
    'MultilineCommentEnd',
    'NEWLINE'
  ]
);
