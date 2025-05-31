import { format } from "date-fns";
import { TransactionByMonth, Transaction } from "../models/Transaction";
import { parseDateString } from "./TimeUtil";

export const groupDataByTime = ({ data, day, month, year, fromDate, toDate }: {
    data: Transaction[],
    day?: number,
    month?: number,
    year?: number,
    fromDate?: Date,
    toDate?: Date
}): TransactionByMonth[] => {
    return data
        .filter(item => {
            const transactionDate = new Date(format(parseDateString(item.createdAt), 'yyyy-MM-dd'));
            if (fromDate && toDate) {
                return transactionDate >= fromDate &&
                    transactionDate <= toDate;
            } else if (day !== undefined) {
                return transactionDate.getDate() === day &&
                    transactionDate.getMonth() === month &&
                    transactionDate.getFullYear() === year
            } else if (month !== undefined) {
                return transactionDate.getMonth() === month &&
                    transactionDate.getFullYear() === year
            }
            return year !== undefined && transactionDate.getFullYear() === year;
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