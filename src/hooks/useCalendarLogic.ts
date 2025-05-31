import { useEffect, useState, useCallback } from 'react';
import {
    addMonths,
    subMonths,
    addYears,
    subYears,
    getWeek,
    startOfWeek,
    endOfWeek,
} from 'date-fns';
import { DisplayType, CustomDateTimePickerProps } from '../models/DateTimePickerTypes';

export const useCalendarState = ({ type = 'day', initialDate, minDate, maxDate, onClose, onConfirm }: CustomDateTimePickerProps) => {
    const [date, setDate] = useState(new Date());
    const [weekOfYear, setWeekOfYear] = useState(getWeek(new Date(), { weekStartsOn: 1 }));
    const [typeDisplay, setTypeDisplay] = useState<DisplayType>('date');
    const [week, setWeek] = useState({
        dateSelect: new Date(),
        firstDay: startOfWeek(new Date(), { weekStartsOn: 1 }),
        lastDay: endOfWeek(new Date(), { weekStartsOn: 1 }),
    });
    const [backupDate, setBackupDate] = useState<Date | undefined>();
    const [backupWeek, setBackupWeek] = useState<typeof week>();

    useEffect(() => {
        if (!initialDate) return;
        setDate(initialDate);
        setWeekOfYear(getWeek(initialDate, { weekStartsOn: 1 }));
        setWeek({
            dateSelect: initialDate,
            firstDay: startOfWeek(initialDate, { weekStartsOn: 1 }),
            lastDay: endOfWeek(initialDate, { weekStartsOn: 1 }),
        });
        setBackupDate(initialDate);
        setBackupWeek({
            dateSelect: initialDate,
            firstDay: startOfWeek(initialDate, { weekStartsOn: 1 }),
            lastDay: endOfWeek(initialDate, { weekStartsOn: 1 }),
        });
    }, [initialDate]);

    useEffect(() => {
        if (type === 'weekday' || type === 'day') setTypeDisplay('date');
        else setTypeDisplay(type);
    }, [type]);

    const handleDateChange = useCallback((next: boolean) => {
        setDate(prev => {
            let newDate = prev;
            if (typeDisplay === 'date') newDate = next ? addMonths(prev, 1) : subMonths(prev, 1);
            else if (typeDisplay === 'month') newDate = next ? addYears(prev, 1) : subYears(prev, 1);
            else if (typeDisplay === 'year') newDate = next ? addYears(prev, 10) : subYears(prev, 10);

            if (type === 'weekday') {
                setWeekOfYear(getWeek(newDate, { weekStartsOn: 1 }));
                setWeek({
                    dateSelect: newDate,
                    firstDay: startOfWeek(newDate, { weekStartsOn: 1 }),
                    lastDay: endOfWeek(newDate, { weekStartsOn: 1 }),
                });
            }

            return newDate;
        });
    }, [typeDisplay, type]);

    const handleSelectDate = (selectedDate: Date) => {
        setDate(selectedDate);
        if (type === 'weekday') {
            setWeek({
                dateSelect: selectedDate,
                firstDay: startOfWeek(selectedDate, { weekStartsOn: 1 }),
                lastDay: endOfWeek(selectedDate, { weekStartsOn: 1 }),
            });
            setWeekOfYear(getWeek(selectedDate, { weekStartsOn: 1 }));
        }
    };


    const handleConfirmDate = () => {
        if (type === 'weekday') {
            (onConfirm as (date: { dateSelect: Date; firstDay: Date; lastDay: Date }) => void)(week);
        } else {
            (onConfirm as (date: Date) => void)(date);
        }
        onClose();
    };

    const handleResetDate = () => {
        if (backupDate) {
            setDate(backupDate);
        }
        if (type === 'weekday' && backupWeek) {
            setWeek(backupWeek);
            setWeekOfYear(getWeek(backupWeek.dateSelect, { weekStartsOn: 1 }));
        }
    };

    const handleSelectCurrentDate = () => {
        const now = new Date();
        setDate(now);
        if (type === 'weekday') {
            setWeekOfYear(getWeek(now, { weekStartsOn: 1 }));
            setWeek({
                dateSelect: now,
                firstDay: startOfWeek(now, { weekStartsOn: 1 }),
                lastDay: endOfWeek(now, { weekStartsOn: 1 }),
            });
        }
    };

    const handleTypeDisplay = useCallback(() => {
        if (type === 'weekday' || type === 'day') setTypeDisplay('date');
        else setTypeDisplay(type);
    }, [type]);

    return {
        date,
        setDate,
        week,
        weekOfYear,
        typeDisplay,
        setTypeDisplay,
        handleDateChange,
        handleConfirmDate,
        handleResetDate,
        handleSelectDate,
        handleSelectCurrentDate,
        handleTypeDisplay,
    };
};

export const getHeaderText = (typeDisplay: DisplayType, date: Date) => {
    switch (typeDisplay) {
        case 'month':
            return date.getFullYear().toString();
        case 'year': {
            const start = Math.floor(date.getFullYear() / 10) * 10;
            return `${start} - ${start + 9}`;
        }
        default:
            return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    }
};

export const getTextCurrentDate = (type: CustomDateTimePickerProps['type']) => {
    switch (type) {
        case 'month': return 'Tháng này';
        case 'year': return 'Năm nay';
        case 'weekday': return 'Tuần này';
        default: return 'Hôm nay';
    }
};
