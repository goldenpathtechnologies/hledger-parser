import test from 'ava';

import { runLexerTests } from './utils';

const tests = [
  {
    pattern: 'comment',
    expected: ['MultilineComment'],
    title: 'recognize multiline comment'
  },
  {
    pattern: `comment
end comment
`,
    expected: [
      'MultilineComment',
      'MC_NEWLINE',
      'MultilineCommentEnd',
      'NEWLINE'
    ],
    title: 'recognize multiline comment terminator'
  },
  {
    pattern: `comment
This is a multiline comment
end comment
`,
    expected: [
      'MultilineComment',
      'MC_NEWLINE',
      'MultilineCommentText',
      'MC_NEWLINE',
      'MultilineCommentEnd',
      'NEWLINE'
    ],
    title: 'recognize multiline comment text'
  },
  {
    pattern: `comment
This is a multiline comment
This is a multiline comment
This is a multiline comment
This is a multiline comment
end comment
`,
    expected: [
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
    ],
    title: 'recognize several lines of multiline comment text'
  },
  {
    pattern: `comment
This is a multiline comment with not-a-tag: and not a value
end comment
`,
    expected: [
      'MultilineComment',
      'MC_NEWLINE',
      'MultilineCommentText',
      'MC_NEWLINE',
      'MultilineCommentEnd',
      'NEWLINE'
    ],
    title: 'does not recognize tags in multiline comments'
  },
  {
    pattern: `comment
This is a multiline comment with end comment in the text
end comment
`,
    expected: [
      'MultilineComment',
      'MC_NEWLINE',
      'MultilineCommentText',
      'MC_NEWLINE',
      'MultilineCommentEnd',
      'NEWLINE'
    ],
    title:
      'only recognizes multiline comment terminator at the beginning of a line'
  }
];

runLexerTests(test, tests);
