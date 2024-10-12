export const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount).replace(/\./g, ',')
}