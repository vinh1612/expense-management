import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Animated } from 'react-native';
import { formatMoney, formatMoneyWithUnit } from '../utils/NumberUtils';
import ArrowIcon from '../assets/svgIcons/ArrowIcon';
import { TransactionByMonth } from '../types/Transaction';
import { parseDateString } from '../utils/TimeUtil';

interface CalendarComponentProps {
    data: TransactionByMonth[];
    onMonthChange: (newMonth: number, newYear: number) => void;
    isExpanded?: boolean
}

const CalendarComponent = ({
    data,
    isExpanded = true,
    onMonthChange
}: CalendarComponentProps) => {

    const today = new Date();
    const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());
    const [currentYear, setCurrentYear] = React.useState(today.getFullYear());
    const weekdayTitles = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    const changeMonth = (direction: string) => {
        let newMonth = currentMonth;
        let newYear = currentYear;

        if (direction === 'next') {
            if (currentMonth === 11) {
                newMonth = 0;
                newYear = currentYear + 1;
            } else {
                newMonth = currentMonth + 1;
            }
        } else if (direction === 'prev') {
            if (currentMonth === 0) {
                newMonth = 11;
                newYear = currentYear - 1;
            } else {
                newMonth = currentMonth - 1;
            }
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        onMonthChange(newMonth, newYear);
    };

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstWeekdayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const getLastWeekdayOfMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDay();
    };

    // Group transactions by date (created_at)
    const groupTransactionsByDate = () => {
        const transactionsByDate: { [key: string]: { income: number; expense: number } } = {};

        data.forEach((monthData) => {
            monthData.data.forEach((transaction) => {
                const date = parseDateString(transaction.created_at);
                const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

                if (!transactionsByDate[dateKey]) {
                    transactionsByDate[dateKey] = { income: 0, expense: 0 };
                }

                if (transaction.transaction_type.is_income) {
                    transactionsByDate[dateKey].income += transaction.transaction_amount;
                } else {
                    transactionsByDate[dateKey].expense += transaction.transaction_amount;
                }
            });
        });

        return transactionsByDate;
    };

    const transactionsByDate = React.useMemo(groupTransactionsByDate, [data]);

    const generateDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstWeekday = getFirstWeekdayOfMonth(currentMonth, currentYear);
        const lastWeekday = getLastWeekdayOfMonth(currentMonth, currentYear);
        const daysArray = [];

        const addPlaceholders = (count: number) => {
            return Array.from({ length: count }, () => ({ day: null }));
        };

        daysArray.push(...addPlaceholders(firstWeekday === 0 ? 6 : firstWeekday - 1));

        for (let i = 1; i <= daysInMonth; i++) {
            const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayData = transactionsByDate[dateKey] ?? { income: 0, expense: 0 };
            daysArray.push({ day: i, ...dayData });
        }

        daysArray.push(...addPlaceholders(lastWeekday === 0 ? 0 : 7 - lastWeekday));

        return daysArray;
    };

    const calculateTotals = () => {
        let totalIncome = 0;
        let totalExpense = 0;

        Object.keys(transactionsByDate).forEach((key) => {
            const [year, month] = key.split('-');
            if (parseInt(month, 10) === currentMonth + 1 && parseInt(year, 10) === currentYear) {
                totalIncome += transactionsByDate[key].income ?? 0;
                totalExpense += transactionsByDate[key].expense ?? 0;
            }
        });

        return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
    };

    const { totalIncome, totalExpense, balance } = calculateTotals();

    const displayMoney = (value: number, className: string) => (
        <Text className={`text-xs text-right ${className}`}>{value > 0 ? formatMoneyWithUnit(value) : ''}</Text>
    );

    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    return (
        <View>
            {/* Header */}
            <View className='flex-row items-center p-2 border-b justify-evenly border-b-white'>
                <TouchableOpacity onPress={() => changeMonth('prev')} className='p-2'>
                    <ArrowIcon direction='left' color='white' />
                </TouchableOpacity>
                <Text className='w-40 text-lg font-bold text-center text-yellow-200'>
                    Tháng {isCurrentMonth ? 'này' : `${(currentMonth + 1)}/${currentYear}`}
                </Text>
                <TouchableOpacity onPress={() => changeMonth('next')} className='p-2'>
                    <ArrowIcon direction='right' color='white' />
                </TouchableOpacity>
            </View>

            {/* Summary */}
            <View className='flex-row items-center justify-center p-4 space-x-10'>
                <View className='flex items-center'>
                    <Text className='text-xs text-white'>Tổng thu</Text>
                    <Text className='text-base text-blue-500'>{formatMoney(totalIncome)}đ</Text>
                </View>
                <View className='flex items-center'>
                    <Text className='text-xs text-white'>Tổng chi</Text>
                    <Text className='text-base text-red-500'>{formatMoney(totalExpense)}đ</Text>
                </View>
                <View className='flex items-center'>
                    <Text className='text-xs text-white'>Chênh lệch</Text>
                    <Text className='text-base text-green-500'>{formatMoney(balance)}đ</Text>
                </View>
            </View>

            <Animated.View style={{ ...(!isExpanded && { height: 0, opacity: 0 }) }}>
                <View>
                    {/* Weekday Titles */}
                    <View className='flex-row justify-between w-full bg-blue-200' >
                        {weekdayTitles.map((weekday) => (
                            <Text key={weekday} className='flex-1 py-1 text-sm font-bold text-center text-black'>
                                {weekday}
                            </Text>
                        ))}
                    </View>

                    {/* Calendar Grid */}
                    <FlatList
                        data={generateDays()}
                        numColumns={7}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => {
                            if (!item.day) {
                                return <View className='flex-1 p-1 border border-gray-200' />;
                            }
                            return (
                                <View className='flex-1 p-1 border border-gray-200'>
                                    <Text className='text-sm font-bold text-white'>{item.day}</Text>
                                    {displayMoney(item.income, 'text-blue-500')}
                                    {displayMoney(item.expense, 'text-red-500')}
                                </View>
                            );
                        }}
                    />
                </View>
            </Animated.View>
        </View>
    );
};
export default CalendarComponent;
