import { TRANSACTION_SOURCE } from "../constants/Status"
import { PAYMENT_METHOD } from "../constants/String"

export const getTransactionSourceText = (transactionSource: number) => {
    switch (transactionSource) {
        case TRANSACTION_SOURCE.CASH:
            return PAYMENT_METHOD.CASH
        case TRANSACTION_SOURCE.BANK:
            return PAYMENT_METHOD.BANK
        default:
            return PAYMENT_METHOD.MOMO
    }
}

export function getRandomHexColor(): string {
    // Generating a random number between 0 and 0xFFFFFF
    const randomColor = Math.floor(Math.random() * 0xffffff);
    // Converting the number to a hexadecimal string and padding with zeros
    return `#${randomColor.toString(16).padStart(6, "0")}`;
}

export function capitalizeWords(str: string): string {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}