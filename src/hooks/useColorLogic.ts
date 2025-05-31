import { useState } from 'react';
import { CalendarStyleCache } from '../storages/Storages';
import { RGBAColorStyle, CalendarStyle } from '../models/CalendarStyle';
import { showToast } from '../utils/ToastUtils';
import { TOAST_MESSAGE } from '../constants/String';
import { CALENDAR_STYLE } from '../constants/Status';

export const useColorLogic = () => {
    const colorStyle = CalendarStyleCache.getInstance.getCalendarStyleCache();

    const [showEditColor, setShowEditColor] = useState(false);
    const [calendarTypeStyle, setCalendarTypeStyle] = useState(CALENDAR_STYLE.THEME);

    const [backgroundColorReview, setBackgroundColorReview] = useState<RGBAColorStyle>(
        colorStyle.backgroundColor ?? new RGBAColorStyle()
    );
    const [textColorReview, setTextColorReview] = useState<RGBAColorStyle>(
        colorStyle.textColor ?? new RGBAColorStyle()
    );
    const [todayDateColorReview, setTodayDateColorReview] = useState<RGBAColorStyle>(
        colorStyle.itemToDayColor ?? new RGBAColorStyle()
    );
    const [initialColor, setInitialColor] = useState<RGBAColorStyle>(colorStyle.backgroundColor);

    const handleReviewColor = (red: number, green: number, blue: number, opacity: number, type: number) => {
        const updatedColor = new RGBAColorStyle({ red, green, blue, opacity });
        switch (type) {
            case CALENDAR_STYLE.THEME:
                setBackgroundColorReview(updatedColor);
                break;
            case CALENDAR_STYLE.TEXT:
                setTextColorReview(updatedColor);
                break;
            case CALENDAR_STYLE.CURRENT_DATE:
            default:
                setTodayDateColorReview(updatedColor);
                break;
        }
    };

    const handleSaveColor = () => {
        const newStyle: CalendarStyle = {
            ...colorStyle,
            backgroundColor: backgroundColorReview,
            textColor: textColorReview,
            itemToDayColor: todayDateColorReview,
        };
        CalendarStyleCache.getInstance.saveCalendarStyleCache(newStyle);
        setShowEditColor(false);
        showToast(TOAST_MESSAGE.SUCCESS.SAVE_CUSTOMIZE_CALENDAR);
    };

    const handleResetColor = () => {
        setBackgroundColorReview(colorStyle.backgroundColor);
        setTextColorReview(colorStyle.textColor);
        setTodayDateColorReview(colorStyle.itemToDayColor);
        setInitialColor(colorStyle.backgroundColor);
        setCalendarTypeStyle(CALENDAR_STYLE.THEME);
        setShowEditColor(false);
    };

    return {
        colorStyle,
        showEditColor,
        setShowEditColor,
        calendarTypeStyle,
        setCalendarTypeStyle,
        backgroundColorReview,
        textColorReview,
        todayDateColorReview,
        handleReviewColor,
        handleSaveColor,
        handleResetColor,
        initialColor,
        setInitialColor,
    };
};
