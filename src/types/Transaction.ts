import { ImageRequireSource } from "react-native"
import { generateId } from "../utils/NumberUtils";
export class Transaction {

    transaction_id: number = 0;
    transaction_type: TransactionCategory = new TransactionCategory();
    transaction_avatar: string = "";
    transaction_amount: number = 0;
    transaction_note: string = "";
    source: number = 0;
    created_at: string = "";

    constructor(data?: Partial<Transaction>) {
        this.transaction_id = generateId();
        Object.assign(this, data);
    }
}

export class TransactionCategory {

    category_id: number | string = 0;
    category_name: string = "";
    category_note: string = "";
    is_income: boolean = false;
    category_source: ImageRequireSource = require("../assets/images/salary.png");
    created_at: string = "";

    constructor(data?: Partial<TransactionCategory>) {
        this.category_id = generateId();
        Object.assign(this, data);
    }
}

export class TransactionByMonth {

    date_time: string = "";
    data: Transaction[] = [];

    constructor(data?: Partial<TransactionByMonth>) {
        Object.assign(this, data);
    }
}