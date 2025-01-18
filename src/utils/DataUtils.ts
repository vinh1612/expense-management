import { TransactionByMonth, Transaction } from "../types/Transaction";
import { parseDateString } from "./TimeUtil";

export const groupDataByTime = ({ data, month, year, fromDate, toDate }: {
    data: Transaction[],
    month?: number,
    year?: number,
    fromDate?: Date,
    toDate?: Date
}): TransactionByMonth[] => {
    return data
        .filter(item => {
            const transactionDate = parseDateString(item.created_at);
            if (fromDate && toDate) {
                return transactionDate >= fromDate &&
                    transactionDate <= toDate;
            } else if (month) {
                return month && transactionDate.getMonth() === month &&
                    transactionDate.getFullYear() === year
            }
            return year && transactionDate.getFullYear() === year;
        })
        .reduce((acc: TransactionByMonth[], item) => {
            const existingGroup = acc.find(group => group.date_time === item.created_at);
            existingGroup
                ? existingGroup.data.push(item)
                : acc.push({ date_time: item.created_at, data: [item] });
            return acc;
        }, [])
        .sort((a, b) => parseDateString(b.date_time).getTime() - parseDateString(a.date_time).getTime());
};