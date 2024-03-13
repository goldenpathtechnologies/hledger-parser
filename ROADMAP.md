# Project Roadmap

## Overview

The goal of the `hledger-parser` project is to implement as much of the hledger spec as possible,
and as accurately as possible. Due to limitations in parsing and a desire to reduce complexity,
`hledger-parser` likely won't implement the hledger spec perfectly, but enough that differences
should be difficult to notice.

## Current Status

`hledger-parser` is currently in alpha development.

## Feature backlog

### Ignored subdirectives

Top-level directives can have subdirectives of any kind, but for those that are not supported,
they are ignored. This feature would run the risk of cluttering the parsing diagram, so it might
not be worth it to implement. Something to think about if the need arises to implement this feature.
For now, unsupported subdirectives will throw parsing errors in `hledger-parser`.

### Date implementation

The dates in `hledger-parser` need to be fully implemented in the same way the amounts were. Like
amounts, dates are a fundamental primitive type in the hledger language that needs to be handled
correctly. There are various date formats that need to be supported to enable the full range of
hledger features. This is a big feature, so individual components need to be handled separately
and prioritized accordingly.

#### Y directive

This sets the default year in journals that use the short form of dates (month and day only).
[Documentation](https://hledger.org/1.31/hledger.html#y-directive)

#### Simple dates

Dates can be of the following formats:

- YYYY-MM-DD
- YYYY/MM/DD
- YYYY.MM.DD

Leading zeroes are optional for month and day. The year can also be omitted for simple dates, with the
current year inferred either by the system clock, or the Y directive.
[Documentation](https://hledger.org/1.31/hledger.html#simple-dates)

#### `date:` tag

The date tag needs to be handled differently from other regular tags. This is used for
[posting dates](https://hledger.org/1.31/hledger.html#posting-dates) where an individual posting can have a different date than the parent
transaction. The `date:` tag cannot be empty and must contain a simple date. Testing is
required to determine whether the `date:` tag behaves the same outside of transaction postings
or not.

#### Smart dates

Smart dates use a complex set of syntax to add flexibility to date reporting in hledger. We need to
determine where smart dates are valid and only parse them in those cases. Otherwise, simple dates are
assumed. This means we need to split the current JournalDate type in `hledger-parser` into simple
and smart dates. [Documentation](https://hledger.org/1.31/hledger.html#smart-dates)

#### Period expressions

Period expressions use smart dates to create a new date type that denotes a range between two different
points of time. This also includes 'Q' syntax that denotes a quarter in a year (e.g. q4, 2009Q1). There
are also a range of period keywords used that are similar in function to those in smart dates. All of
these need to be implemented. Additionally, weekday and month names are part of some period expressions
and need to be accounted for as well.
[Documentation](https://hledger.org/1.31/hledger.html#period-expressions)

### Periodic transactions

Periodic transactions use smart dates and period expressions. Those features need to be implemented
before work on this feature is started. Periodic transactions are used for budgeting and forecasting.

[Documentation](https://hledger.org/1.31/hledger.html#periodic-transactions).
[More documentation](https://hledger.org/budgeting-and-forecasting.html).

### Timeclock format

It's suggested that work on dates is completed before this is started.

[Documentation](https://hledger.org/1.31/hledger.html#timeclock)

### Timedot format

Complete work on timeclock format before work on this feature is started.

[Documentation](https://hledger.org/1.31/hledger.html#timedot)

### Multiline comments

Multiline comments are denoted by the top-level directives `comment` and `end comment` respectively.
This will require a new mode that will only accept the terminating directive as a valid token other
than plain text. This feature can be completed independently of all others.
[Documentation](https://hledger.org/1.31/hledger.html#comments)

### Alias directive

This feature enabled the use of account name aliases. This is an odd feature since it allows for
regular expressions, which in and of itself needs to be parsed with regular expressions. This is the
only tricky part of this feature. Otherwise, this can be implemented independently of any other feature.
[Documentation](https://hledger.org/1.31/hledger.html#alias-directive)

### Payee directive

This is a low priority feature.
[Documentation](https://hledger.org/1.31/hledger.html#payee-directive)

### Tag directive

This is a low priority feature.
[Documentation](https://hledger.org/1.31/hledger.html#tag-directive)

### Auto posting directive

This is a low priority feature.
[Documentation](https://hledger.org/1.31/hledger.html#auto-postings)
