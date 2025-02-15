import { ImageRequireSource } from "react-native"
import { generateId } from "../utils/NumberUtils";

export class Transaction {

    transactionId: number = 0;
    transactionType: TransactionCategory = new TransactionCategory();
    transactionAmount: number = 0;
    transactionNote: string = "";
    source: number = 0;
    createdAt: string = "";

    constructor(data?: Partial<Transaction>) {
        this.transactionId = generateId();
        Object.assign(this, data);
    }
}

export class TransactionCategory {

    categoryId: number | string = 0;
    categoryName: string = "";
    isIncome: boolean = false;
    categorySource: string | ArrayBuffer | ImageRequireSource = '';

    constructor(data?: Partial<TransactionCategory>) {
        this.categoryId = generateId();
        Object.assign(this, data);
    }
}

export class TransactionByMonth {

    dateTime: string = "";
    data: Transaction[] = [];

    constructor(data?: Partial<TransactionByMonth>) {
        Object.assign(this, data);
    }
}