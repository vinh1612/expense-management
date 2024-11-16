export const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount).replace(/\./g, ',')
}

export const formatMoneyWithUnit = (amount: number) => {
    const roundNumber = (num: number) => {
        if (num % 1 === 0) {
            return num.toFixed(0); // No decimals
        } else if (num * 10 % 1 === 0) {
            return num.toFixed(1); // 1 decimal place
        } else if (num * 100 % 1 === 0) {
            return num.toFixed(2); // 2 decimal places
        } else {
            return num.toFixed(3); // 3 decimal places
        }
    };

    if (amount >= 1e9) {
        return roundNumber(amount / 1e9) + ' tỷ'; // For billions
    } else if (amount >= 1e7) {
        return roundNumber(amount / 1e6) + ' triệu'; // For millions
    } else if (amount >= 1e4) {
        return roundNumber(amount / 1e3) + 'k'; // For thousands
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

export function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}