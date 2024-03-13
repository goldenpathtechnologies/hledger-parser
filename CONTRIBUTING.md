# Contributing Guidelines

Thank you for showing interest in contributing to `hledger-parser`. Before contributing, please
make yourself familiar with the [Code of Conduct](CODE_OF_CONDUCT.md). The Code of
Conduct governs all aspects of this project, including but not limited to variable
names, names of branches, comments, personal interactions, commit messages, and
file names.

## Table of contents

- [Creating issues](#creating-issues)
- [Creating pull requests](#creating-pull-requests)
- [Software development process](#software-development-process)
  - [Repository information](#repository-information)
    - [Changelog](#changelog)
  - [Conventional commits](#conventional-commits)
    - [Breaking changes](#breaking-changes)
  - [Coding standards and style](#coding-standards-and-style)
  - [Testing and coverage](#testing-and-coverage)
    - [Writing tests](#writing-tests)

## Creating issues
There isn't a lot of ceremony around creating issues for `hledger-parser`. It's enough to follow
these recommendations:

- Be clear and concise. Don't write a novel when a few sentences will suffice.
- Do **not** submit security vulnerabilities to the issue tracker. Email me at [daryl@goldenpath.ca](mailto:daryl@goldenpath.ca) instead.
- Use relevant labels and feel free to suggest new ones that are helpful to the project.
- Avoid duplicate issues by searching for similar ones first. Add comments to existing issues if you can provide new and/or helpful information.
- I may create issue templates in the future, feel free to use them or not when available.

## Creating pull requests
You may want to skip creating an issue and simply submit a pull request if you know
how to fix a particular issue. This is perfectly fine as long as the following
guidelines are followed:

- Ensure your fork is kept up to date with upstream changes.
- Use [Conventional Commits](#conventional-commits) format when naming the pull request. The PR title is the first line of the commit, and the PR body is the remaining sections.
- Ensure all non-squashed commits in the PR branch follow the Conventional Commits [spec](https://www.conventionalcommits.org/en/v1.0.0/).
- Link to issues related to the PR.
- Review the [coding standards](#coding-standards-and-style) to ensure consistency throughout the project.

## Software development process

### Repository information

#### Changelog
`CHANGELOG.md` is automatically generated and updated during CI/CD and should not be
modified otherwise.

### Conventional commits

`hledger-parser` follows the [Conventional Commits spec](https://www.conventionalcommits.org/en/v1.0.0/)
for all commits in the repository. It is recommended to use a tool like
[commitizen](https://github.com/commitizen-tools/commitizen) to automate the creation
of properly formatted Conventional Commits. It is also acceptable to use multiple
`-m` flags on `git commit` to achieve the same result.

#### Breaking changes

Any pull request that contains breaking changes may either be rejected, or shelved
until the next major version is ready for release. Breaking changes are detected
either by the presence of keywords in the body of any commit (e.g. `BREAKING CHANGE`,
`BREAKING CHANGES`, or `BREAKING`) or determined via peer review.

### Coding standards and style

Here are some basic guidelines to follow while working on `hledger-parser`:

- Readability is more important than brevity.
- Treat all typos as bugs, regardless of file type, test results, or build status.
- Use comments wisely. Leave TODO comments for anything you may not get to right away, or a problem someone else may be more fit to solve.
- Functions should be kept as small as possible and broken up in several parts when necessary. However, it's more important that the function does one thing well.
- Inline functions can be used provided they are simple. When they increase in complexity, they should be defined outside the function they're used in and tested.

These rough guidelines are subject to change as the project evolves.

### Testing and coverage

#### Writing tests

Any code contributed must be accompanied by tests with 80% coverage being maintained
throughout the project. While coverage is important, tests should also be relevant.
That is, we may sometimes need more tests than will satisfy the coverage threshold
to ensure all scenarios are handled. However, if a function is too simple to test
(e.g. no implication logic and calling a single third-party function), then writing
tests for it is optional.
