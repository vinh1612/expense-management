import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, useColorScheme } from 'react-native';
import { addMonths, subMonths, startOfWeek, endOfWeek, isSameDay, getWeek, addYears, subYears } from 'date-fns';
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
import { getWeekDaysFromDevice } from '../utils/StringUtils';

interface CustomDateTimePickerBaseProps {
    isShow: boolean;
    onClose: () => void;
    initialDate?: Date
    minDate?: Date;
    maxDate?: Date;
}

interface DayPickerProps extends CustomDateTimePickerBaseProps {
    type?: 'day' | 'month' | 'year';
    onConfirm: (date: Date) => void;
}

interface WeekPickerProps extends CustomDateTimePickerBaseProps {
    type: 'weekday';
    onConfirm: (date: { dateSelect: Date; firstDay: Date; lastDay: Date }) => void;
}

type CustomDateTimePickerProps = DayPickerProps | WeekPickerProps;
type DisplayType = 'date' | 'month' | 'year';

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
    isShow, type = 'day', initialDate,
    minDate, maxDate,
    onClose, onConfirm
}) => {

    const [date, setDate] = React.useState(new Date());
    const [weekOfYear, setWeekOfYear] = React.useState(getWeek(new Date(), { weekStartsOn: 1 }));
    const [week, setWeek] = React.useState<{ dateSelect: Date; firstDay: Date; lastDay: Date }>({
        dateSelect: new Date(),
        firstDay: startOfWeek(new Date(), { weekStartsOn: 1 }),
        lastDay: endOfWeek(new Date(), { weekStartsOn: 1 }),
    });
    const [typeDisplay, setTypeDisplay] = React.useState<DisplayType>('date');
    const isDarkMode = useColorScheme() === 'dark';

    const weekDays = getWeekDaysFromDevice();
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

    const handleTypeDisplay = () => {
        if (type === 'weekday' || type === 'day') {
            setTypeDisplay('date');
        } else {
            setTypeDisplay(type);
        }
    }

    React.useEffect(() => {
        if (!isShow) { return; }
        // Initial Type
        handleTypeDisplay()
        // Initial Date
        setDate(initialDate ?? new Date());
        setWeekOfYear(getWeek((initialDate ?? new Date()), { weekStartsOn: 1 }));
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
        switch (typeDisplay) {
            case 'date':
                setDate((prevDate) => (next ? addMonths(prevDate, 1) : subMonths(prevDate, 1)));
                break;
            case 'month':
                setDate((prevDate) => (next ? addYears(prevDate, 1) : subYears(prevDate, 1)));
                break;
            case 'year':
                setDate((prevDate) => (next ? addYears(prevDate, 10) : subYears(prevDate, 10)));
                break;
            default:
                break;
        }
    };

    const isDisabledPrevButton = (): boolean => {
        const prevMonth = subMonths(date, 1);
        return Boolean(minDate && prevMonth < minDate);
    };

    const isDisabledNextButton = (): boolean => {
        const nextMonth = addMonths(date, 1);
        return Boolean(maxDate && nextMonth > maxDate);
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
        handleTypeDisplay()
        if (type === 'weekday') {
            setWeekOfYear(getWeek(new Date(), { weekStartsOn: 1 }))
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
        setWeekOfYear(getWeek(newDate, { weekStartsOn: 1 })); // Update the week of year
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
                            className={`text-base ${isToday && 'font-bold'}`}
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

    const renderDayView = () => {
        return (
            <View>
                <View className="flex flex-row justify-between w-full mb-2">
                    {weekDays.map((day) => (
                        <Text key={day} className="flex-1 w-10 py-1 text-base text-center" style={{ color: isDarkMode ? textColor : 'black' }}>
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
        )
    }


    const renderMonthView = () => {
        const months = Array.from({ length: 12 }, (_, i) => {
            return new Date(date.getFullYear(), i, 1).toLocaleString('default', { month: 'long' });
        });
        return (
            <FlatList
                data={months}
                numColumns={3}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => {
                    const isSelected = date.getMonth() === index;
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                setDate(new Date(date.getFullYear(), index, date.getDate()));
                                handleTypeDisplay()
                            }}
                            className="flex-1 p-2"
                        >
                            <View
                                {...(isSelected && {
                                    style: {
                                        backgroundColor: backgroundHeaderColor,
                                        borderRadius: 8
                                    }
                                })}
                                className="items-center justify-center p-2"
                            >
                                <Text
                                    className="text-base"
                                    style={{
                                        color: isSelected ? 'white' : isDarkMode ? textColor : 'black'
                                    }}
                                >
                                    {item}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        );
    };

    const renderYearView = () => {
        const currentYear = Math.floor(date.getFullYear() / 10) * 10;
        const startYear = currentYear;
        const endYear = currentYear + 10;
        const years = Array.from({ length: endYear - startYear }, (_, i) => startYear + i);
        return (
            <View className="flex flex-row flex-wrap">
                {years.map(item => {
                    const isSelected = date.getFullYear() === item;
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                setDate(new Date(item, date.getMonth(), date.getDate()));
                                handleTypeDisplay()
                            }}
                            className="w-1/3 p-2"
                            key={item}
                        >
                            <View
                                {...(isSelected && {
                                    style: {
                                        backgroundColor: backgroundHeaderColor,
                                        borderRadius: 8
                                    }
                                })}
                                className="items-center justify-center p-2"
                            >
                                <Text
                                    className="text-base"
                                    style={{
                                        color: isSelected ? 'white' : isDarkMode ? textColor : 'black'
                                    }}
                                >
                                    {item}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const getHeaderText = () => {
        switch (typeDisplay) {
            case 'month':
                return date.getFullYear().toString();
            case 'year':
                const currentYear = Math.floor(date.getFullYear() / 10) * 10;
                const startYear = currentYear;
                const endYear = currentYear + 9;
                return `${startYear} - ${endYear}`;
            default:
                return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        }
    };

    const getTextCurrentDate = () => {
        switch (type) {
            case 'month':
                return 'Tháng này'
            case 'year':
                return 'Năm nay'
            case 'weekday':
                return 'Tuần này'
            default:
                return 'Hôm nay'
        }
    }

    return (
        <Modal visible={isShow} animationType="fade" transparent={true}>
            <View className="items-center justify-center flex-1 bg-black/50">
                <View className="w-[90%] max-h-[90%] bg-gray-700 border border-gray-600 rounded-lg">
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
                                disabled={isDisabledPrevButton()}
                                onPress={() => handleDateChange(false)}
                                className={`p-2 ${isDisabledPrevButton() && 'opacity-50'}`}
                            >
                                <ArrowIcon direction='left' color={isDarkMode ? 'white' : 'black'} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setTypeDisplay(typeDisplay === 'date' ? 'month' : typeDisplay === 'month' ? 'year' : 'year')
                                }}
                            >
                                <Text className="text-lg font-bold" style={{ color: isDarkMode ? textColor : 'black' }}>
                                    {getHeaderText()}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={isDisabledNextButton()}
                                onPress={() => handleDateChange(true)}
                                className={`p-2 ${isDisabledNextButton() && 'opacity-50'}`}
                            >
                                <ArrowIcon direction='right' color={isDarkMode ? 'white' : 'black'} />
                            </TouchableOpacity>
                        </View>

                        {(() => {
                            switch (typeDisplay) {
                                case 'date':
                                    return renderDayView();
                                case 'month':
                                    return renderMonthView();
                                case 'year':
                                    return renderYearView();
                                default:
                                    return <></>;
                            }
                        })()}

                        <View className='flex flex-row items-center justify-between mt-4'>
                            <TouchableOpacity
                                onPress={handleSelectCurrentDate}
                                className="p-2 rounded-md"
                            >
                                <Text className="text-base font-bold text-center" style={{ color: backgroundHeaderColor }} >
                                    {getTextCurrentDate()}
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
