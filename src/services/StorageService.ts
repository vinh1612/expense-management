import { openDatabase } from '../storages/database';
import { Transaction, Wallet, CalendarStyle } from '../models';
import LoadingState from './LoadingState';

export class StorageService {
    private static instance: StorageService;

    private constructor() {
        this.init();
    }

    static getInstance(): StorageService {
        if (!this.instance) {
            this.instance = new StorageService();
        }
        return this.instance;
    }

    private async init() {
        const db = await openDatabase();

        await db.executeSql(`
      CREATE TABLE IF NOT EXISTS transaction_cache (
        id INTEGER PRIMARY KEY NOT NULL,
        data TEXT
      );
    `);

        await db.executeSql(`
      CREATE TABLE IF NOT EXISTS wallet_cache (
        id INTEGER PRIMARY KEY NOT NULL,
        data TEXT
      );
    `);

        await db.executeSql(`
      CREATE TABLE IF NOT EXISTS calendar_style_cache (
        id INTEGER PRIMARY KEY NOT NULL,
        data TEXT
      );
    `);
    }

    private async withLoading<T>(fn: () => Promise<T>): Promise<T> {
        LoadingState.set(true);
        try {
            return await fn();
        } finally {
            LoadingState.set(false);
        }
    }

    // ========== TRANSACTION ==========
    async getTransactionCache(): Promise<Transaction[]> {
        try {
            const db = await openDatabase();
            const result = await db.executeSql(`SELECT data FROM transaction_cache WHERE id = ?;`, [1]);
            const data = result[0].rows.length ? result[0].rows.item(0).data : null;
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async saveTransactionCache(transactions: Transaction[]) {
        return this.withLoading(async () => {
            const db = await openDatabase();
            const json = JSON.stringify(transactions);
            await db.executeSql(`REPLACE INTO transaction_cache (id, data) VALUES (?, ?);`, [1, json]);
        });
    }

    async pushTransaction(transaction: Transaction) {
        return this.withLoading(async () => {
            const current = await this.getTransactionCache();
            current.push(transaction);
            await this.saveTransactionCache(current);
        });
    }

    async updateTransactionWith(updated: Transaction) {
        return this.withLoading(async () => {
            const current = await this.getTransactionCache();
            const index = current.findIndex(t => t.transactionId === updated.transactionId);
            if (index !== -1) {
                current[index] = updated;
                await this.saveTransactionCache(current);
            }
        });
    }

    async removeTransactionWith(transactionId: number) {
        return this.withLoading(async () => {
            const current = await this.getTransactionCache();
            const filtered = current.filter(t => t.transactionId !== transactionId);
            await this.saveTransactionCache(filtered);
        });
    }

    async clearTransactionCache() {
        return this.withLoading(async () => {
            const db = await openDatabase();
            await db.executeSql(`DELETE FROM transaction_cache WHERE id = ?;`, [1]);
        });
    }

    // ========== WALLET ==========
    async saveWalletCache(wallet: Wallet) {
        const db = await openDatabase();
        const json = JSON.stringify(wallet);
        await db.executeSql(`REPLACE INTO wallet_cache (id, data) VALUES (?, ?);`, [1, json]);
    }

    async getWalletCache(): Promise<Wallet> {
        try {
            const txs = await this.getTransactionCache();
            const db = await openDatabase();
            const result = await db.executeSql(`SELECT data FROM wallet_cache WHERE id = ?;`, [1]);
            const data = result[0].rows.length ? result[0].rows.item(0).data : null;

            const wallet = data ? (JSON.parse(data) as Wallet) : new Wallet();

            wallet.totalAmount = txs.reduce((acc, t) =>
                acc + (t.transactionType.isIncome ? t.transactionAmount : -t.transactionAmount), 0);

            wallet.totalIncome = txs.filter(t => t.transactionType.isIncome)
                .reduce((acc, t) => acc + t.transactionAmount, 0);

            wallet.totalExpenditure = txs.filter(t => !t.transactionType.isIncome)
                .reduce((acc, t) => acc + t.transactionAmount, 0);

            await this.saveWalletCache(wallet);
            return wallet;
        } catch {
            return new Wallet();
        }
    }

    // ========== CALENDAR STYLE ==========
    async saveCalendarStyleCache(style: CalendarStyle) {
        return this.withLoading(async () => {
            const db = await openDatabase();
            const json = JSON.stringify(style);
            await db.executeSql(`REPLACE INTO calendar_style_cache (id, data) VALUES (?, ?);`, [1, json]);
        });
    }

    async getCalendarStyleCache(): Promise<CalendarStyle> {
        try {
            const db = await openDatabase();
            const result = await db.executeSql(`SELECT data FROM calendar_style_cache WHERE id = ?;`, [1]);
            const data = result[0].rows.length ? result[0].rows.item(0).data : null;
            return data ? JSON.parse(data) : new CalendarStyle();
        } catch {
            return new CalendarStyle();
        }
    }

    async clearCalendarStyleCache() {
        return this.withLoading(async () => {
            const db = await openDatabase();
            await db.executeSql(`DELETE FROM calendar_style_cache WHERE id = ?;`, [1]);
        });
    }
}
