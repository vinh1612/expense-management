import React, { useEffect } from 'react';
import { Modal, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import ArrowIcon from '../../assets/svgIcons/ArrowIcon';
import PencilIcon from '../../assets/svgIcons/PencilIcon';
import ColorPickerCustom from '../ColorPickerCustom';
import { getHeaderText, getTextCurrentDate, useCalendarState } from '../../hooks/useCalendarLogic';
import { useColorLogic } from '../../hooks/useColorLogic';
import DateView from './DateView';
import MonthView from './MonthView';
import YearView from './YearView';
import { ACTION_CONTENT } from '../../constants/String';
import type { CustomDateTimePickerProps } from '../../models/DateTimePickerTypes';

const CustomDateTimePicker = ({
    isShow,
    type = 'day',
    initialDate,
    minDate,
    maxDate,
    onClose,
    onConfirm
}: CustomDateTimePickerProps) => {
    const isDarkMode = useColorScheme() === 'dark';

    const {
        date,
        typeDisplay,
        week,
        weekOfYear,
        handleTypeDisplay,
        handleDateChange,
        handleConfirmDate,
        handleResetDate,
        handleSelectDate,
        handleSelectCurrentDate,
        setDate,
        setTypeDisplay
    } = useCalendarState({
        ...(type === 'weekday'
            ? {
                type: 'weekday' as const,
                onConfirm: onConfirm as (date: { dateSelect: Date; firstDay: Date; lastDay: Date }) => void,
            }
            : {
                type: (type ?? 'day') as 'day' | 'month' | 'year',
                onConfirm: onConfirm as (date: Date) => void,
            }),
        onClose, isShow, initialDate, minDate, maxDate
    });

    const {
        colorStyle,
        showEditColor,
        backgroundColorReview,
        textColorReview,
        todayDateColorReview,
        calendarTypeStyle,
        handleReviewColor,
        handleSaveColor,
        handleResetColor,
        setShowEditColor,
        setCalendarTypeStyle,
        initialColor,
        setInitialColor
    } = useColorLogic();

    const backgroundHeaderColor = `rgba(${backgroundColorReview.red}, ${backgroundColorReview.green}, ${backgroundColorReview.blue}, ${backgroundColorReview.opacity})`;
    const textColor = `rgba(${textColorReview.red}, ${textColorReview.green}, ${textColorReview.blue}, ${textColorReview.opacity})`;

    const renderMainView = () => {
        switch (typeDisplay) {
            case 'date':
                return (
                    <DateView
                        date={date}
                        setDate={setDate}
                        backgroundColor={backgroundColorReview}
                        textColor={textColorReview}
                        todayColor={todayDateColorReview}
                        type={type === 'day' || type === 'weekday' ? type : 'day'}
                        selectedWeek={week}
                        onDaySelect={handleSelectDate}
                    />
                );
            case 'month':
                return (
                    <MonthView
                        date={date}
                        onSelectMonth={(month: number) => {
                            setDate(new Date(date.getFullYear(), month, 1));
                            handleTypeDisplay();
                        }}
                        backgroundColor={backgroundHeaderColor}
                        textColor={textColor}
                    />
                );
            case 'year':
                return (
                    <YearView
                        date={date}
                        onSelectYear={(year: number) => {
                            setDate(new Date(year, date.getMonth(), 1));
                            handleTypeDisplay();
                        }}
                        backgroundColor={backgroundHeaderColor}
                        textColor={textColor}
                    />
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        if (!isShow) return;
        handleTypeDisplay();
    }, [isShow, handleTypeDisplay]);

    return (
        <Modal visible={isShow} animationType="fade" transparent>
            <View className="items-center justify-center flex-1 bg-black/50">
                <View className="w-[90%] max-h-[90%] bg-gray-700 border border-gray-600 rounded-lg">
                    <View
                        className='flex flex-col px-4 py-6 space-y-2 border border-gray-600 rounded-t-lg'
                        style={{ backgroundColor: backgroundHeaderColor }}
                    >
                        {type === 'weekday' ? (
                            <>
                                <Text className='text-4xl font-bold' style={{ color: textColor }}>Tuần {weekOfYear}, {date.getFullYear()}</Text>
                                <Text className='text-lg' style={{ color: textColor }}>
                                    {week.firstDay.toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                    {' - '}
                                    {week.lastDay.toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text className='text-xl' style={{ color: textColor }}>{date.getFullYear()}</Text>
                                <Text className='text-4xl font-bold' style={{ color: textColor }}>
                                    {date.toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Text>
                            </>
                        )}
                        <TouchableOpacity className='absolute top-2 right-4' onPress={() => setShowEditColor(true)}>
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
                                onChangeType={(selectedType: number) => {
                                    setCalendarTypeStyle(selectedType);
                                    const selected =
                                        selectedType === 0 ? colorStyle.backgroundColor :
                                            selectedType === 1 ? colorStyle.textColor :
                                                colorStyle.itemToDayColor;
                                    setInitialColor(selected);
                                }}
                            />
                        </View>
                    )}

                    <View className='p-4'>
                        <View className="flex flex-row items-center justify-between mb-4">
                            <TouchableOpacity onPress={() => handleDateChange(false)}>
                                <ArrowIcon direction='left' color={isDarkMode ? 'white' : 'black'} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className='flex-1'
                                onPress={() => {
                                    setTypeDisplay(
                                        typeDisplay === 'date' ? 'month' : typeDisplay === 'month' ? 'year' : 'year'
                                    );
                                }}
                            >
                                <Text className="text-lg font-bold text-center" style={{ color: isDarkMode ? textColor : undefined }}>
                                    {getHeaderText(typeDisplay, date)}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDateChange(true)}>
                                <ArrowIcon direction='right' color={isDarkMode ? 'white' : 'black'} />
                            </TouchableOpacity>
                        </View>

                        {renderMainView()}

                        <View className='flex flex-row items-center justify-between mt-4'>
                            <TouchableOpacity onPress={handleSelectCurrentDate}>
                                <Text className="text-base font-bold text-center" style={{ color: backgroundHeaderColor }}>
                                    {getTextCurrentDate(type)}
                                </Text>
                            </TouchableOpacity>
                            <View className='flex flex-row space-x-6'>
                                <TouchableOpacity onPress={() => { handleResetDate(); handleResetColor(); onClose(); }}>
                                    <Text className="text-base font-bold text-center" style={{ color: backgroundHeaderColor }}>
                                        {ACTION_CONTENT.CLOSE}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleConfirmDate}>
                                    <Text className="text-base font-bold text-center" style={{ color: backgroundHeaderColor }}>
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