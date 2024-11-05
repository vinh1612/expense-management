import { ImageRequireSource } from "react-native"
import { generateId } from "../utils/NumberUtils";
export class Transaction {
    
    transaction_id: number = 0;
    transaction_name: string = "";
    transaction_type: TransactionCategory = new TransactionCategory();
    transaction_avatar: string = "";
    transaction_amount: number = 0;
    transaction_note: string = "";
    source: string = "";
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

export class TransactionSection {
    
    title: string = "";
    data: Transaction[] = [];
    
    constructor(data?: Partial<TransactionSection>) {
        Object.assign(this, data);
    }
}