export class Wallet {
    
    total_income: number = 0;
    total_expenditure: number = 0;
    total_amount: number = 0;
    
    constructor(data?: Partial<Wallet>) {
        Object.assign(this, data);
    }
}