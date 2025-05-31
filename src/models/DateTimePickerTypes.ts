// File: types/DateTimePickerTypes.ts

export type DisplayType = 'date' | 'month' | 'year';

export interface CustomDateTimePickerBaseProps {
    isShow: boolean;
    onClose: () => void;
    initialDate?: Date;
    minDate?: Date;
    maxDate?: Date;
}

export interface DayPickerProps extends CustomDateTimePickerBaseProps {
    type?: 'day' | 'month' | 'year';
    onConfirm: (date: Date) => void;
}

export interface WeekPickerProps extends CustomDateTimePickerBaseProps {
    type: 'weekday';
    onConfirm: (date: { dateSelect: Date; firstDay: Date; lastDay: Date }) => void;
}

export type CustomDateTimePickerProps = DayPickerProps | WeekPickerProps;
