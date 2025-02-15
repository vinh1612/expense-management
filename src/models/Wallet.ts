export class Wallet {

    totalIncome: number = 0;
    totalExpenditure: number = 0;
    totalAmount: number = 0;

    constructor(data?: Partial<Wallet>) {
        Object.assign(this, data);
    }
}