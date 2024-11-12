export const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount).replace(/\./g, ',')
}

export const formatMoneyWithUnit = (amount: number) => {
    if (amount >= 1e9) {
        return (amount / 1e9).toFixed(1).replace(/\.0$/, '') + ' tỷ'; // For billions
    } else if (amount >= 1e6) {
        return (amount / 1e6).toFixed(1).replace(/\.0$/, '') + ' triệu'; // For millions
    } else if (amount >= 1e4) {
        return (amount / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'; // For thousands
    }
    return formatMoney(amount);
};


export const removeFormatMoney = (amount: string) => {
    if (amount === '') {
        return 0;
    }
    return parseInt(amount.replace(/,/g, ''));
}

export const generateId = (): number => {
    return Math.floor(Math.random() * 1e9); // Generates a random number up to 1 billion
}