import React from 'react';
import { CalendarStyleCache } from '../storages/Storages';
import { RGBAColorStyle, CalendarStyle } from '../models/CalendarStyle';
import { showToast } from '../utils/ToastUtils';
import { TOAST_MESSAGE } from '../constants/String';
import { CALENDAR_STYLE } from '../constants/Status';
import { StorageService } from '../services/StorageService';

export const useColorLogic = () => {

    const [colorStyle, setColorStyle] = React.useState<CalendarStyle>(new CalendarStyle());
    const [showEditColor, setShowEditColor] = React.useState(false);
    const [calendarTypeStyle, setCalendarTypeStyle] = React.useState(CALENDAR_STYLE.THEME);

    const [backgroundColorReview, setBackgroundColorReview] = React.useState<RGBAColorStyle>(
        colorStyle.backgroundColor ?? new RGBAColorStyle()
    );
    const [textColorReview, setTextColorReview] = React.useState<RGBAColorStyle>(
        colorStyle.textColor ?? new RGBAColorStyle()
    );
    const [todayDateColorReview, setTodayDateColorReview] = React.useState<RGBAColorStyle>(
        colorStyle.itemToDayColor ?? new RGBAColorStyle()
    );
    const [initialColor, setInitialColor] = React.useState<RGBAColorStyle>(colorStyle.backgroundColor);

    React.useEffect(() => {
        const fetchColorStyle = async () => {
            const style = await StorageService.getInstance().getCalendarStyleCache();
            setColorStyle(style);
            setBackgroundColorReview(style.backgroundColor ?? new RGBAColorStyle());
            setTextColorReview(style.textColor ?? new RGBAColorStyle());
            setTodayDateColorReview(style.itemToDayColor ?? new RGBAColorStyle());
            setInitialColor(style.backgroundColor ?? new RGBAColorStyle());
        };

        fetchColorStyle();
    }, []);

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

    const handleSaveColor = async () => {
        const newStyle: CalendarStyle = {
            ...colorStyle,
            backgroundColor: backgroundColorReview,
            textColor: textColorReview,
            itemToDayColor: todayDateColorReview,
        };
        await StorageService.getInstance().saveCalendarStyleCache(newStyle);
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
