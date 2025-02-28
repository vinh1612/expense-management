import { MMKV } from 'react-native-mmkv'
import { Transaction, Wallet, CalendarStyle } from '../models/index';

export const storage = new MMKV()

const KEY_CACHE = {
  TRANSACTION: "KEY_TRANSACTION_CACHE",
  WALLET: "KEY_WALLET_CACHE",
  CALENDAR_STYLE: "CALENDAR_STYLE",
}

export class TransactionCache {
  private static instance: TransactionCache;

  private constructor() { }

  static get getInstance(): TransactionCache {
    if (!this.instance) {
      this.instance = new TransactionCache()
    }
    return this.instance
  }

  saveTransactionCache(transactions: Transaction[]) {
    storage.set(KEY_CACHE.TRANSACTION, JSON.stringify(transactions));
  }

  getTransactionCache(): Transaction[] {
    try {
      const cached = storage.getString(KEY_CACHE.TRANSACTION);
      return cached ? JSON.parse(cached) as Transaction[] : [];
    } catch (error) {
      return [];
    }
  }

  clearTransactionCache() {
    if (storage.contains(KEY_CACHE.TRANSACTION)) {
      storage.delete(KEY_CACHE.TRANSACTION)
    }
  }

  // Push a new transaction to the array
  pushTransaction(transaction: Transaction) {
    const transactions = this.getTransactionCache();
    transactions.push(transaction);
    this.saveTransactionCache(transactions);
  }

  // Update a transaction in the array by ID (or some other identifier)
  updateTransactionWith(updatedTransaction: Transaction) {
    const transactions = this.getTransactionCache();
    const index = transactions.findIndex(t => t.transactionId === updatedTransaction.transactionId); // Assuming each transaction has a unique 'id'
    if (index !== -1) {
      transactions[index] = updatedTransaction;
      this.saveTransactionCache(transactions);
    }
  }

  // Remove a transaction from the array by ID (or some other identifier)
  removeTransactionWith(transactionId: number) {
    let transactions = this.getTransactionCache();
    transactions = transactions.filter(t => t.transactionId !== transactionId); // Assuming each transaction has a unique 'id'
    this.saveTransactionCache(transactions);
  }
}

export class WalletCache {
  private static instance: WalletCache;

  private constructor() { }

  static get getInstance(): WalletCache {
    if (!this.instance) {
      this.instance = new WalletCache()
    }
    return this.instance
  }

  saveWalletCache(Wallets: Wallet) {
    storage.set(KEY_CACHE.WALLET, JSON.stringify(Wallets));
  }

  getWalletCache(): Wallet {
    let cached: Wallet;
    try {
      const cachedTransaction = this.getTransactionCacheSafe();

      const totalAmount = cachedTransaction
        .reduce((total, currentValue) => {
          const amount = currentValue.transactionType.isIncome ? currentValue.transactionAmount : -currentValue.transactionAmount;
          return total + amount;
        }, 0);

      const totalIncome = cachedTransaction
        .filter((item) => item.transactionType.isIncome)
        .reduce((total, currentValue) => {
          return total + currentValue.transactionAmount;
        }, 0);

      const totalExpenditure = cachedTransaction
        .filter((item) => !item.transactionType.isIncome)
        .reduce((total, currentValue) => {
          return total + currentValue.transactionAmount;
        }, 0);

      const walletString = storage.getString(KEY_CACHE.WALLET);

      if (walletString) { // Kiểm tra cache đã được khởi tạo bên dưới hay chưa
        cached = JSON.parse(walletString) as Wallet;
        cached.totalAmount = totalAmount
        cached.totalIncome = totalIncome
        cached.totalExpenditure = totalExpenditure
      } else {
        cached = new Wallet();
      }

      this.saveWalletCache(cached);

      return cached
    } catch (error) {
      return new Wallet();
    }
  }

  // Private method to safely retrieve transactions for wallet calculations
  private getTransactionCacheSafe(): Transaction[] {
    try {
      const cachedTransactions = storage.getString(KEY_CACHE.TRANSACTION);
      return cachedTransactions ? JSON.parse(cachedTransactions) : [];
    } catch (error) {
      console.error('Error retrieving transactions for wallet:', error);
      return [];
    }
  }
}

export class CalendarStyleCache {
  private static instance: CalendarStyleCache;

  private constructor() { }

  static get getInstance(): CalendarStyleCache {
    if (!this.instance) {
      this.instance = new CalendarStyleCache()
    }
    return this.instance
  }

  saveCalendarStyleCache(style: CalendarStyle) {
    storage.set(KEY_CACHE.CALENDAR_STYLE, JSON.stringify(style));
  }

  getCalendarStyleCache(): CalendarStyle {
    try {
      const cached = storage.getString(KEY_CACHE.CALENDAR_STYLE);
      return cached ? JSON.parse(cached) as CalendarStyle : new CalendarStyle();
    } catch (error) {
      return new CalendarStyle();
    }
  }

  clearCalendarStyleCache() {
    if (storage.contains(KEY_CACHE.CALENDAR_STYLE)) {
      storage.delete(KEY_CACHE.CALENDAR_STYLE)
    }
  }
}