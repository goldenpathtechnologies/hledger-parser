import _ from 'lodash';
import { DateTime } from 'luxon';

import { notEmpty } from '../type_utils';
import * as Core from '../types';

import * as Cooked from './cooked_types';
import * as Raw from './raw_types';

interface RawToCookedVisitorState {
  defaultYear: number;
}

const defaultRawToCookedVisitorState: RawToCookedVisitorState = {
  defaultYear: DateTime.now().year
};

class RawToCookedVisitor {
  private _state: RawToCookedVisitorState = defaultRawToCookedVisitorState;

  journal(node: Raw.Journal): Cooked.Journal {
    this._state = defaultRawToCookedVisitorState; // reset state

    return node.reduce<Cooked.Journal>(
      (cookedJournal, rawItem) => {
        switch (rawItem.type) {
          case 'transaction':
            cookedJournal.transactions.push(this.transaction(rawItem));
            break;

          case 'priceDirective':
            cookedJournal.prices.push(this.priceDirective(rawItem));
            break;

          case 'accountDirective':
            cookedJournal.accounts.push(this.accountDirective(rawItem));
            break;

          case 'yearDirective':
            this._state.defaultYear = parseInt(rawItem.value.year, 10);
            break;
        }
        return cookedJournal;
      },
      { transactions: [], accounts: [], prices: [] }
    );
  }

  transaction(node: Raw.Transaction): Cooked.Transaction {
    let lastPosting: Cooked.Posting | null; // track in order to attach comment lines
    const myTags: Core.Tag[] = this._collectTags(
      node.value.initLine.comment?.value
    ); // tags for the transaction itself

    const postings = node.value.contentLines.reduce<Cooked.Posting[]>(
      (cookedPostings, rawItem) => {
        if (rawItem.type === 'posting') {
          lastPosting = {
            ..._.omit(rawItem.value, 'comment'), // do not include the value of the comment field, just take the tags
            tags: this._collectTags(rawItem.value.comment?.value)
          };
          cookedPostings.push(lastPosting);
        } else {
          const tags = this._collectTags(rawItem.value);

          if (lastPosting) {
            // belong to the posting on preceding lines, attach
            lastPosting.tags.push(...tags);
          } else {
            // belong to the transaction itself
            myTags.push(...tags);
          }
        }
        return cookedPostings;
      },
      []
    );

    const dateYearValue = node.value.initLine.date.date.year;
    const postingDateValue = node.value.initLine.date.postingDate;

    if (dateYearValue && postingDateValue && !postingDateValue.year) {
      postingDateValue.year = dateYearValue;
    }

    const postingDate = postingDateValue
      ? this._toCookedSimpleDate(postingDateValue)
      : undefined;

    return {
      date: this._toCookedSimpleDate(node.value.initLine.date.date),
      postingDate,
      status: node.value.initLine.status,
      chequeNumber: node.value.initLine.chequeNumber,
      description: node.value.initLine.description,
      postings,
      tags: myTags
    };
  }

  priceDirective(node: Raw.PriceDirective): Cooked.Price {
    return {
      date: this._toCookedSimpleDate(node.value.date),
      commodity: node.value.commodity,
      price: node.value.price
    };
  }

  accountDirective(node: Raw.AccountDirective): Cooked.Account {
    const tagsOnLine = this._collectTags(node.value.comments?.value);
    const tagsInContents = this._collectTags(
      _.flatten(node.value.contentLines.map((c) => c.value).filter(notEmpty))
    );
    return {
      account: node.value.account,
      tags: [...tagsOnLine, ...tagsInContents]
    };
  }

  private _collectTags(commentLines?: Raw.InlineCommentItem[]) {
    if (!commentLines) return [];

    return commentLines.reduce<Core.Tag[]>((tags, cmtItem) => {
      if (typeof cmtItem !== 'string') tags.push(cmtItem.value);
      return tags;
    }, []);
  }

  private _toCookedSimpleDate(date: Core.SimpleDate): Cooked.SimpleDate {
    const yearValue = parseInt(date.year ?? '', 10);
    const year = isNaN(yearValue) ? this._state.defaultYear : yearValue;

    return {
      year,
      month: parseInt(date.month, 10),
      day: parseInt(date.day, 10)
    };
  }
}

export default new RawToCookedVisitor();
