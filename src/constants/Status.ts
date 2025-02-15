export enum TRANSACTION_SOURCE {
    CASH = 0,
    MOMO = 1,
    BANK = 2
}

export enum REPORT_BY {
    WEEK = 0,
    MONTH = 1,
    YEAR = 2
}

export enum TRANSACTION_TYPE {
    BOTH = -1,
    INCOME = 1,
    EXPENSE = 2
}

export enum CALENDAR_STYLE {
    THEME = 0,
    TEXT = 1,
    CURRENT_DATE = 2
}

export enum CATEGORY_INCOME {
    ADD_OTHER = 1,
    SALARY = 2,
    BONUS = 3,
    INVEST = 4,
    OTHER_MONEY = 5
}

export enum CATEGORY_EXPENSE {
    ADD_OTHER = 1,
    FOOD = 2,
    MOVING = 3,
    FASHION = 4,
    PET = 5,
    EDUCATION = 6,
    HEALTH = 7,
    TRAVEL = 8,
    ENTERTAINMENT = 9,
    ELECTRICITY_BILL = 10,
    GIFT = 11
}

export const CATEGORY_TYPE = {
    INCOME: CATEGORY_INCOME,
    EXPENSE: CATEGORY_EXPENSE
}