import * as Core from '../types';

/**
 * Type for a 'cooked' parsed [hledger journal](https://hledger.org/1.26/hledger.html#journal-format)
 */
export interface Journal {
  // TODO: Figure out a way to ensure a guaranteed order of the below items.

  /** All [transactions](https://hledger.org/1.26/hledger.html#transactions) in the journal, order not guaranteed */
  transactions: Transaction[];

  /** All [account directives](https://hledger.org/1.26/hledger.html#declaring-accounts) in the journal, order not guaranteed */
  accounts: Account[];

  /** All [price directives](https://hledger.org/1.26/hledger.html#market-prices) in the journal, order not guaranteed */
  prices: Price[];

  // TODO: Add all commodity directives here.
  //  /** All [commodity directives](https://hledger.org/1.31/hledger.html#commodity-directive) in the journal, order not guaranteed */
  //  commodities: Commodity[];
}

/**
 * Type for a single [hledger transaction](https://hledger.org/1.26/hledger.html#transactions)
 */
export interface Transaction {
  date: SimpleDate;
  postingDate?: SimpleDate;
  status: Core.StatusIndicator;
  chequeNumber?: string;
  description: Core.TxnDescription;
  postings: Posting[];
  tags: Core.Tag[];
}

/**
 * Type for a [transaction posting](https://hledger.org/1.26/hledger.html#postings), which in a cooked journal is augmented with a
 * list of attached tags.
 */
export type Posting = Core.Posting & { tags: Core.Tag[] };

/**
 * Type for a cooked [account directive](https://hledger.org/1.26/hledger.html#declaring-accounts)
 */
export interface Account {
  account: string[];
  tags: Core.Tag[];
}

/**
 * Type for a cooked [price directive](https://hledger.org/1.26/hledger.html#market-prices)
 */
export interface Price {
  date: SimpleDate;
  commodity: string;
  price: Core.Amount;
}

export interface SimpleDate {
  year: number;
  month: number;
  day: number;
}
