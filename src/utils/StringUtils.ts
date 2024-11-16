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