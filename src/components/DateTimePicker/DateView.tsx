import React, { useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { getDaysInMonth, getFirstWeekdayOfMonth, getLastWeekdayOfMonth } from '../../utils/DataUtils';
import { isSameDay } from 'date-fns';
import { RGBAColorStyle } from '../../models/CalendarStyle';
import { getWeekDaysFromDevice } from '../../utils/StringUtils';

interface DateViewProps {
    date: Date;
    setDate: (date: Date) => void;
    backgroundColor?: RGBAColorStyle;
    textColor?: RGBAColorStyle;
    todayColor?: RGBAColorStyle;
    type?: 'day' | 'weekday';
    onDaySelect?: (date: Date) => void;
    selectedWeek?: {
        dateSelect: Date;
        firstDay: Date;
        lastDay: Date;
    };
}

const DateView: React.FC<DateViewProps> = ({
    date,
    setDate,
    backgroundColor,
    textColor,
    todayColor,
    type = 'day',
    selectedWeek,
    onDaySelect,
}) => {
    const isDarkMode = useColorScheme() === 'dark';
    const weekDays = getWeekDaysFromDevice();

    const days = useMemo(() => {
        const daysArray = [];
        const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);

        const daysInMonth = getDaysInMonth(date.getMonth(), date.getFullYear());
        const firstWeekday = getFirstWeekdayOfMonth(date.getMonth(), date.getFullYear());
        const lastWeekday = getLastWeekdayOfMonth(date.getMonth(), date.getFullYear());

        const prefixDays = firstWeekday === 0 ? 6 : firstWeekday - 1;
        const suffixDays = lastWeekday === 0 ? 0 : 7 - lastWeekday;

        const renderDay = (day: number, monthDate: Date, isGrayedOut: boolean = false) => {
            const thisDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
            const isSelected =
                type === 'day'
                    ? isSameDay(thisDate, date)
                    : selectedWeek && thisDate >= selectedWeek.firstDay && thisDate <= selectedWeek.lastDay;

            const isToday = isSameDay(thisDate, new Date());

            return (
                <TouchableOpacity
                    key={`${monthDate.getMonth()}-${day}`}
                    onPress={() => {
                        onDaySelect?.(thisDate);
                        setDate(thisDate);
                    }}
                    className="items-center flex-1"
                >
                    <View
                        className="flex items-center justify-center w-8 h-8"
                        style={isSelected && [{ backgroundColor: rgba(backgroundColor) }, { borderRadius: 9999 }]}
                    >
                        <Text
                            className={`text-base ${isToday && 'font-bold'}`}
                            style={{
                                color: isToday
                                    ? rgba(todayColor)
                                    : isGrayedOut
                                        ? 'rgb(156 163 175)'
                                        : rgba(textColor),
                            }}
                        >
                            {day}
                        </Text>
                        {isToday && <View className="w-1 h-1 rounded-full" style={{ backgroundColor: rgba(todayColor) }} />}
                    </View>
                </TouchableOpacity>
            );
        };

        const lastDatePrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();
        for (let i = prefixDays; i > 0; i--) {
            daysArray.push(renderDay(lastDatePrevMonth - i + 1, prevMonth, true));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            daysArray.push(renderDay(day, currentMonth));
        }

        for (let day = 1; day <= suffixDays; day++) {
            daysArray.push(renderDay(day, nextMonth, true));
        }
        return daysArray;
    }, [date, backgroundColor, textColor, todayColor, type, selectedWeek, onDaySelect, setDate]);

    return (
        <View>
            <View className="flex flex-row justify-between w-full mb-2">
                {weekDays.map(day => (
                    <Text
                        key={day}
                        className="flex-1 w-10 py-1 text-base text-center"
                        style={{
                            color: isDarkMode ? rgba(textColor) : undefined
                        }}
                    >
                        {day}
                    </Text>
                ))}
            </View>
            <FlatList
                data={days}
                numColumns={7}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => item}
            />
        </View>
    );
};

const rgba = (c?: RGBAColorStyle) => {
    if (!c) return 'black';
    return `rgba(${c.red}, ${c.green}, ${c.blue}, ${c.opacity})`;
};

export default DateView;
