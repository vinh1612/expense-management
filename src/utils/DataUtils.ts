import { TransactionByMonth, Transaction } from "../models/Transaction";
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
            const transactionDate = parseDateString(item.createdAt);
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
            const existingGroup = acc.find(group => group.dateTime === item.createdAt);
            existingGroup
                ? existingGroup.data.push(item)
                : acc.push({ dateTime: item.createdAt, data: [item] });
            return acc;
        }, [])
        .sort((a, b) => parseDateString(b.dateTime).getTime() - parseDateString(a.dateTime).getTime());
};

export const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
};

export const getFirstWeekdayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
};

export const getLastWeekdayOfMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDay();
};