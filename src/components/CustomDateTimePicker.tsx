import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, FlatList } from 'react-native';
import { addMonths, subMonths, startOfWeek, endOfWeek, isSameDay, getWeek } from 'date-fns';
import ArrowIcon from '../assets/svgIcons/ArrowIcon';
import PencilIcon from '../assets/svgIcons/PencilIcon';
import ColorPickerCustom from './ColorPickerCustom';
import { CalendarStyleCache } from '../storages/Storages';
import { CalendarStyle } from '../models';
import { RGBAColorStyle } from '../models/CalendarStyle';
import { showToast } from '../utils/ToastUtils';
import { CALENDAR_STYLE } from '../constants/Status';
import { getDaysInMonth, getFirstWeekdayOfMonth, getLastWeekdayOfMonth } from '../utils/DataUtils';
import { ACTION_CONTENT, TOAST_MESSAGE } from '../constants/String';

interface CustomDateTimePickerBaseProps {
    isShow: boolean;
    onClose: () => void;
    type?: 'day' | 'weekday';
    initialDate?: Date
}

interface DayPickerProps extends CustomDateTimePickerBaseProps {
    type?: 'day';
    onConfirm: (date: Date) => void;
}

interface WeekPickerProps extends CustomDateTimePickerBaseProps {
    type: 'weekday';
    onConfirm: (date: { dateSelect: Date; firstDay: Date; lastDay: Date }) => void;
}

type CustomDateTimePickerProps = DayPickerProps | WeekPickerProps;

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
    isShow, type = 'day', initialDate,
    onClose, onConfirm
}) => {

    const [date, setDate] = React.useState(new Date());
    const [weekOfYear, setWeekOfYear] = React.useState(getWeek(new Date()));
    const [week, setWeek] = React.useState<{ dateSelect: Date; firstDay: Date; lastDay: Date }>({
        dateSelect: new Date(),
        firstDay: startOfWeek(new Date(), { weekStartsOn: 1 }),
        lastDay: endOfWeek(new Date(), { weekStartsOn: 1 }),
    });
    const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const [showEditColor, setShowEditColor] = React.useState(false);
    const colorStyle = CalendarStyleCache.getInstance.getCalendarStyleCache()
    const [backgroundColorReview, setBackgroundColorReview] = React.useState<RGBAColorStyle>(new RGBAColorStyle()); // RGBA Color
    const [textColorReview, setTextColorReview] = React.useState<RGBAColorStyle>(new RGBAColorStyle()); // RGBA Color
    const [todayDateColorReview, setTodayDateColorReview] = React.useState<RGBAColorStyle>(new RGBAColorStyle()); // RGBA Color
    const backgroundHeaderColor = `rgba(${backgroundColorReview.red}, ${backgroundColorReview.green}, ${backgroundColorReview.blue}, ${backgroundColorReview.opacity})`
    const textColor = `rgba(${textColorReview.red}, ${textColorReview.green}, ${textColorReview.blue}, ${textColorReview.opacity})`
    const dateTodayColor = `rgba(${todayDateColorReview.red}, ${todayDateColorReview.green}, ${todayDateColorReview.blue}, ${todayDateColorReview.opacity})`
    const [calendarTypeStyle, setCalendarTypeStyle] = React.useState(CALENDAR_STYLE.THEME);
    const [initialColor, setInitialColor] = React.useState(colorStyle.backgroundColor);

    React.useEffect(() => {
        if (!isShow) { return; }
        // Initial Date
        setDate(initialDate ?? new Date());
        setWeekOfYear(getWeek(initialDate ?? new Date()));
        setWeek({
            dateSelect: initialDate ?? new Date(),
            firstDay: startOfWeek(initialDate ?? new Date(), { weekStartsOn: 1 }),
            lastDay: endOfWeek(initialDate ?? new Date(), { weekStartsOn: 1 }),
        });
        // Initial Color
        setBackgroundColorReview(colorStyle.backgroundColor ?? new RGBAColorStyle());
        setTextColorReview(colorStyle.textColor ?? new RGBAColorStyle());
        setTodayDateColorReview(colorStyle.itemToDayColor ?? new RGBAColorStyle());
    }, [isShow]);

    const convertDate = (date: Date): string => {
        return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    };

    const handleDateChange = (next: boolean) => {
        setDate((prevDate) => (next ? addMonths(prevDate, 1) : subMonths(prevDate, 1)));
    };

    const handleConfirmDate = () => {
        if (type === 'weekday') {
            (onConfirm as (date: { dateSelect: Date; firstDay: Date; lastDay: Date }) => void)(week);
        } else {
            (onConfirm as (date: Date) => void)(date);
        }
        onClose();
    };

    const handleSelectCurrentDate = () => {
        setDate(new Date());
        setWeekOfYear(getWeek(new Date()))
        if (type === 'weekday') {
            setWeek({
                dateSelect: date,
                firstDay: startOfWeek(new Date(), { weekStartsOn: 1 }),
                lastDay: endOfWeek(new Date(), { weekStartsOn: 1 }),
            })
        }
    }

    const handleReviewColor = (red: number, green: number, blue: number, opacity: number, type: number) => {
        if (type === CALENDAR_STYLE.THEME) {
            setBackgroundColorReview(new RGBAColorStyle({ red, green, blue, opacity }));
        } else if (type === CALENDAR_STYLE.TEXT) {
            setTextColorReview(new RGBAColorStyle({ red, green, blue, opacity }));
        } else {
            setTodayDateColorReview(new RGBAColorStyle({ red, green, blue, opacity }));
        }
    };

    const handleSaveColor = () => {
        const newStyle: CalendarStyle = {
            ...colorStyle,
            backgroundColor: backgroundColorReview,
            textColor: textColorReview,
            itemToDayColor: todayDateColorReview,
        }
        CalendarStyleCache.getInstance.saveCalendarStyleCache(newStyle)
        setShowEditColor(false);
        showToast(TOAST_MESSAGE.SUCCESS.SAVE_CUSTOMIZE_CALENDAR);
    };

    const handleResetColor = () => {
        setBackgroundColorReview(colorStyle.backgroundColor);
        setTextColorReview(colorStyle.textColor);
        setTodayDateColorReview(colorStyle.itemToDayColor);
        setInitialColor(colorStyle.backgroundColor)
        setCalendarTypeStyle(CALENDAR_STYLE.THEME)
        setShowEditColor(false);
    }

    const handleDayClick = (monthOffset: number | null, day: number) => {
        let newDate;
        if (monthOffset === -1) {
            // Select a day from the previous month
            newDate = new Date(date.getFullYear(), date.getMonth() - 1, day);
        } else if (monthOffset === 1) {
            // Select a day from the next month
            newDate = new Date(date.getFullYear(), date.getMonth() + 1, day);
        } else {
            // Select a day from the current month
            newDate = new Date(date.getFullYear(), date.getMonth(), day);
        }
        setDate(newDate); // Update the state to the new date
        setWeekOfYear(getWeek(newDate)); // Update the week of year
        setWeek({
            dateSelect: newDate,
            firstDay: startOfWeek(newDate, { weekStartsOn: 1 }),
            lastDay: endOfWeek(newDate, { weekStartsOn: 1 })
        }); // Update the selected week
    };

    const renderDays = () => {
        const daysArray = [];
        const prevMonthDate = subMonths(date, 1);
        const daysInMonth = getDaysInMonth(date.getMonth(), date.getFullYear());
        const firstWeekday = getFirstWeekdayOfMonth(date.getMonth(), date.getFullYear());
        const lastWeekday = getLastWeekdayOfMonth(date.getMonth(), date.getFullYear());
        const totalInFirstWeekday = firstWeekday === 0 ? 6 : firstWeekday - 1;
        const totalInLastWeekday = lastWeekday === 0 ? 0 : 7 - lastWeekday;

        const renderDay = (day: number, monthOffset: number | null, isGrayedOut = false) => {
            const monthDate = monthOffset === -1 ? prevMonthDate :
                monthOffset === 1 ? new Date(date.getFullYear(), date.getMonth() + 1) : date;
            const currentDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
            const isSelected = type === 'day' ?
                (monthOffset === null && date.getDate() === day) :
                (currentDate >= week.firstDay && currentDate <= week.lastDay);
            const isToday = monthOffset === null && isSameDay(currentDate, new Date());

            return (
                <TouchableOpacity
                    key={`${monthOffset}-${day}`}
                    onPress={() => handleDayClick(monthOffset, day)}
                    className="items-center flex-1"
                >
                    <View
                        {...(isSelected && { style: { backgroundColor: backgroundHeaderColor } })}
                        className='flex items-center justify-center w-8 h-8 rounded-full'
                    >
                        <Text
                            className={`text-sm ${isToday && 'font-bold'}`}
                            style={{ color: isToday ? dateTodayColor : isGrayedOut ? 'rgb(156 163 175)' : textColor }}
                        >
                            {day}
                        </Text>
                        {isToday && (
                            <View className='w-1 h-1 rounded-full' style={{ backgroundColor: dateTodayColor }} />
                        )}
                    </View>
                </TouchableOpacity>
            );
        };

        // Previous month days
        for (let i = totalInFirstWeekday; i > 0; i--) {
            const day = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 0).getDate() - i + 1;
            daysArray.push(renderDay(day, -1, true));
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            daysArray.push(renderDay(day, null));
        }

        // Next month days
        for (let day = 1; day <= totalInLastWeekday; day++) {
            daysArray.push(renderDay(day, 1, true));
        }

        return daysArray;
    };

    return (
        <Modal visible={isShow} animationType="fade" transparent={true}>
            <View className="items-center justify-center flex-1 bg-black/50">
                <View className="w-4/5 bg-gray-700 border border-gray-600 rounded-lg">
                    <View
                        className='flex flex-col p-6 space-y-2 border border-gray-600 rounded-t-lg'
                        style={{ backgroundColor: backgroundHeaderColor }}
                    >
                        {type === 'weekday' ? (
                            <>
                                <Text className='text-base' style={{ color: textColor }}>{
                                    convertDate(week.firstDay)} - {convertDate(week.lastDay)}
                                </Text>
                                <Text className='text-4xl font-bold' style={{ color: textColor }}>
                                    Tuần {weekOfYear}
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text className='text-base' style={{ color: textColor }}>{date.getFullYear()}</Text>
                                <Text className='text-4xl font-bold' style={{ color: textColor }}>
                                    {date.toLocaleString('default', { weekday: 'short', day: '2-digit', month: 'short' })}
                                </Text>
                            </>
                        )}
                        <TouchableOpacity
                            className='absolute top-2 right-4'
                            onPress={() => setShowEditColor(true)}
                        >
                            <PencilIcon size={20} color='white' />
                        </TouchableOpacity>
                    </View>
                    {showEditColor && (
                        <View className='px-2 pt-2'>
                            <ColorPickerCustom
                                initialColor={initialColor}
                                onColorChange={handleReviewColor}
                                onClose={handleResetColor}
                                onConfirm={handleSaveColor}
                                typeSelected={calendarTypeStyle}
                                onChangeType={(type: number) => {
                                    setCalendarTypeStyle(type)
                                    if (type === CALENDAR_STYLE.THEME) {
                                        setInitialColor(colorStyle.backgroundColor);
                                    } else if (type === CALENDAR_STYLE.TEXT) {
                                        setInitialColor(colorStyle.textColor);
                                    } else {
                                        setInitialColor(colorStyle.itemToDayColor);
                                    }
                                }}
                            />
                        </View>
                    )}
                    <View className='p-4'>
                        <View className="flex flex-row items-center justify-between mb-4">
                            <TouchableOpacity
                                onPress={() => handleDateChange(false)}
                                className="p-2"
                            >
                                <ArrowIcon direction='left' color='white' />
                            </TouchableOpacity>
                            <Text className="text-lg font-bold" style={{ color: textColor }}>
                                {date.toLocaleString('default', { month: 'long' })}
                                {' '}
                                {date.getFullYear()}
                            </Text>
                            <TouchableOpacity
                                onPress={() => handleDateChange(true)}
                                className="p-2"
                            >
                                <ArrowIcon direction='right' color='white' />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <View className="flex flex-row justify-between w-full mb-2">
                                {weekDays.map((day) => (
                                    <Text key={day} className="flex-1 py-1 text-sm text-center" style={{ color: textColor }}>
                                        {day}
                                    </Text>
                                ))}
                            </View>

                            <FlatList
                                data={renderDays()}
                                numColumns={7}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item }) => {
                                    return item;
                                }}
                            />
                        </View>

                        <View className='flex flex-row items-center justify-between mt-4'>
                            <TouchableOpacity
                                onPress={handleSelectCurrentDate}
                                className="p-2 rounded-md"
                            >
                                <Text className="text-base font-bold text-center" style={{ color: backgroundHeaderColor }} >
                                    {type === 'weekday' ? 'Tuần này' : 'Hôm nay'}
                                </Text>
                            </TouchableOpacity>
                            <View className='flex flex-row space-x-4'>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleResetColor()
                                        onClose()
                                    }}
                                    className="p-2 rounded-md"
                                >
                                    <Text className="text-base font-bold text-center" style={{ color: backgroundHeaderColor }} >
                                        {ACTION_CONTENT.CLOSE}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleConfirmDate()}
                                    className="p-2 rounded-md"
                                >
                                    <Text className="text-base font-bold text-center" style={{ color: backgroundHeaderColor }} >
                                        {ACTION_CONTENT.CHOOSE}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomDateTimePicker;
