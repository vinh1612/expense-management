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
    NONE = 1,
    SALARY = 2,
    BONUS = 3,
    INVEST = 4,
    OTHER_MONEY = 5
}

export enum CATEGORY_EXPENSE {
    NONE = 1,
    FOOD = 2,
    EATING = 3,
    MOVING = 4,
    FASHION = 5,
    DRINK = 6,
    PET = 7,
    EDUCATION = 8,
    HEALTH = 9,
    TRAVEL = 10,
    ENTERTAINMENT = 11,
    WATER_BILL = 12,
    ELECTRICITY_BILL = 13,
    INTERNET_BILL = 14,
    GIFT = 15
}

export const CATEGORY_TYPE = {
    INCOME: CATEGORY_INCOME,
    EXPENSE: CATEGORY_EXPENSE
}