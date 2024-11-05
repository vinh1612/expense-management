export const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount).replace(/\./g, ',')
}

export const removeFormatMoney = (amount: string) => {
    if (amount === '') {
        return 0;
    }
    return parseInt(amount.replace(/,/g, ''));
}

export const generateId = (): number => {
    return Math.floor(Math.random() * 1_000_000_000); // Generates a random number up to 1 billion
}