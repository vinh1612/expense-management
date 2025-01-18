import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { addMonths, subMonths, startOfWeek, endOfWeek, isSameDay, getWeek } from 'date-fns';
import ArrowIcon from '../assets/svgIcons/ArrowIcon';
import PencilIcon from '../assets/svgIcons/PencilIcon';
import ColorPickerCustom from './ColorPickerCustom';
import { CalendarStyleCache } from '../storages/Storages';
import { CalendarStyle } from '../types';
import { RGBAColorStyle } from '../types/CalendarStyle';
import { showToast } from '../utils/ToastUtils';
import { CALENDAR_STYLE } from '../constants/Constant';

interface CustomDateTimePickerProps {
    isShow: boolean;
    onClose: () => void;
    onConfirm: (date: { firstDay: Date; lastDay: Date } | Date) => void;
    type?: 'day' | 'weekday';
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
    isShow, type = 'day', onClose, onConfirm
}) => {

    const [date, setDate] = React.useState(new Date());
    const [week, setWeek] = React.useState<{ firstDay: Date; lastDay: Date }>({
        firstDay: startOfWeek(new Date(), { weekStartsOn: 1 }),
        lastDay: endOfWeek(new Date(), { weekStartsOn: 1 }),
    });
    const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const [showEditColor, setShowEditColor] = React.useState(false);
    const colorStyle = CalendarStyleCache.getInstance.getCalendarStyleCache()
    const [backgroundColorReview, setBackgroundColorReview] = React.useState<RGBAColorStyle>(colorStyle.background_color ?? new RGBAColorStyle()); // RGBA Color
    const [textColorReview, setTextColorReview] = React.useState<RGBAColorStyle>(colorStyle.text_color ?? new RGBAColorStyle()); // RGBA Color
    const [todayDateColorReview, setTodayDateColorReview] = React.useState<RGBAColorStyle>(colorStyle.item_to_day_color ?? new RGBAColorStyle()); // RGBA Color
    const backgroundHeaderColor = `rgba(${backgroundColorReview.red}, ${backgroundColorReview.green}, ${backgroundColorReview.blue}, ${backgroundColorReview.opacity})`
    const textColor = `rgba(${textColorReview.red}, ${textColorReview.green}, ${textColorReview.blue}, ${textColorReview.opacity})`
    const dateTodayColor = `rgba(${todayDateColorReview.red}, ${todayDateColorReview.green}, ${todayDateColorReview.blue}, ${todayDateColorReview.opacity})`
    const [calendarTypeStyle, setCalendarTypeStyle] = React.useState(CALENDAR_STYLE.THEME);
    const [initialColor, setInitialColor] = React.useState(colorStyle.background_color);

    const convertDate = (date: Date): string => {
        return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    };

    const handleDateChange = (next: boolean) => {
        setDate((prevDate) => (next ? addMonths(prevDate, 1) : subMonths(prevDate, 1)));
    };

    const handleConfirmDate = () => {
        type === 'weekday' ? onConfirm(week) : onConfirm(date);
        onClose();
    };

    const handleSelectCurrentDate = () => {
        setDate(new Date());
        if (type === 'weekday') {
            setWeek({
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
            background_color: backgroundColorReview,
            text_color: textColorReview,
            item_to_day_color: todayDateColorReview,
        }
        CalendarStyleCache.getInstance.saveCalendarStyleCache(newStyle)
        setShowEditColor(false);
        showToast('Lưu màu sắc cho lịch thành công');
    };

    const handleResetColor = () => {
        setBackgroundColorReview(colorStyle.background_color);
        setTextColorReview(colorStyle.text_color);
        setTodayDateColorReview(colorStyle.item_to_day_color);
        setInitialColor(colorStyle.background_color)
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
        const firstDay = startOfWeek(newDate, { weekStartsOn: 1 });
        const lastDay = endOfWeek(newDate, { weekStartsOn: 1 });
        setWeek({ firstDay, lastDay }); // Update the selected week
    };

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const renderDays = () => {
        const daysArray = [];
        // Determine the number of days to display from the previous month
        const prevMonthDate = subMonths(date, 1);
        const totalDaysInPrevMonth = new Date(
            prevMonthDate.getFullYear(),
            prevMonthDate.getMonth() + 1,
            0
        ).getDate();
        const prevMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const firstWeekday = prevMonth === 0 ? 6 : prevMonth - 1

        // Add days from the previous month
        for (let day = totalDaysInPrevMonth - firstWeekday + 1; day <= totalDaysInPrevMonth; day++) {
            const currentDate = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), day);
            const isSelected = type === 'weekday' && currentDate >= week.firstDay && currentDate <= week.lastDay;
            daysArray.push(
                <TouchableOpacity
                    key={`prev-${day}`}
                    onPress={() => handleDayClick(-1, day)}
                    className={`flex justify-center items-center w-8 h-8 m-1 rounded-full`}
                    {...(isSelected && { style: { backgroundColor: backgroundHeaderColor } })}
                >
                    <Text className="text-sm text-gray-400">{day}</Text>
                </TouchableOpacity>
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
            const isSelected = type === 'day' ? date.getDate() === day : currentDate >= week.firstDay && currentDate <= week.lastDay;
            const isToday = isSameDay(currentDate, new Date());
            daysArray.push(
                <TouchableOpacity
                    key={`current-${day}`}
                    onPress={() => handleDayClick(null, day)}
                    className={`flex justify-center items-center w-8 h-8 m-1 rounded-full`}
                    {...(isSelected && { style: { backgroundColor: backgroundHeaderColor } })}
                >
                    <Text
                        className={`text-sm ${isToday && 'font-bold'}`}
                        style={{ color: isToday ? dateTodayColor : textColor }}
                    >
                        {day}
                    </Text>
                    {isToday && (
                        <View className='w-1 h-1 rounded-full' style={{ backgroundColor: dateTodayColor }} ></View>
                    )}
                </TouchableOpacity>
            );
        }

        // Add days for the next month to complete the grid
        const nextMonthDays = (daysArray.length > 35 ? 42 : 35) - daysArray.length; // Ensure 5 or 6 rows of 7 days
        for (let day = 1; day <= nextMonthDays; day++) {
            const currentDate = new Date(date.getFullYear(), date.getMonth() + 1, day);
            const isSelected = type === 'weekday' && currentDate >= week.firstDay && currentDate <= week.lastDay;
            daysArray.push(
                <TouchableOpacity
                    key={`next-${day}`}
                    onPress={() => handleDayClick(1, day)}
                    className={`flex justify-center items-center w-8 h-8 m-1 rounded-full`}
                    {...(isSelected && { style: { backgroundColor: backgroundHeaderColor } })}
                >
                    <Text className="text-sm text-gray-400">{day}</Text>
                </TouchableOpacity>
            );
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
                                    Tuần {getWeek(date)}
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
                                        setInitialColor(colorStyle.background_color);
                                    } else if (type === CALENDAR_STYLE.TEXT) {
                                        setInitialColor(colorStyle.text_color);
                                    } else {
                                        setInitialColor(colorStyle.item_to_day_color);
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

                        <View className="flex flex-row justify-between mb-2">
                            {weekDays.map((day) => (
                                <Text key={day} className="flex-1 py-1 text-sm text-center" style={{ color: textColor }}>
                                    {day}
                                </Text>
                            ))}
                        </View>

                        <ScrollView
                            contentContainerStyle={{
                                flexWrap: 'wrap',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            {renderDays()}
                        </ScrollView>

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
                                        Đóng
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleConfirmDate()}
                                    className="p-2 rounded-md"
                                >
                                    <Text className="text-base font-bold text-center" style={{ color: backgroundHeaderColor }} >
                                        Chọn
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
