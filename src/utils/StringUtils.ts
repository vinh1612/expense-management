import { TRANSACTION_SOURCE } from "../constants/Constant"


export const getTransactionSourceText = (transactionSource: number) => {
    switch (transactionSource) {
        case TRANSACTION_SOURCE.CASH:
            return 'Tiền Mặt'
        case TRANSACTION_SOURCE.BANK:
            return 'Tài Khoản Ngân Hàng'
        default:
            return 'Ví MoMo'
    }
}

export function getRandomHexColor(): string {
    // Generating a random number between 0 and 0xFFFFFF
    const randomColor = Math.floor(Math.random() * 0xffffff);
    // Converting the number to a hexadecimal string and padding with zeros
    return `#${randomColor.toString(16).padStart(6, "0")}`;
}