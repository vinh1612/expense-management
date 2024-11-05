import { View, Text, SafeAreaView, Animated } from 'react-native'
import React from 'react'
import { formatMoney } from '../../../utils/NumberUtils';
import { WalletCache } from '../../../storages/Storages';
import { Wallet } from '../../../types';
import CalendarComponent from '../../../components/CalendarComponent';

const WalletScreen = () => {

  const [progressIncome] = React.useState(new Animated.Value(0));
  const [progressExpenditure] = React.useState(new Animated.Value(0));
  const [maxWidthIncome, setMaxWidthIncome] = React.useState(0);
  const [maxWidthExpenditure, setMaxWidthExpenditure] = React.useState(0);

  const [wallet, setWallet] = React.useState<Wallet>(new Wallet())

  React.useEffect(() => {
    setWallet(WalletCache.getInstance.getWalletCache())
  }, []);

  React.useEffect(() => {
    if (maxWidthIncome > 0) {
      const total_income = wallet.total_income
      let percentage_income = 0
      if (total_income > 0) {
        const total_amount = wallet.total_amount
        percentage_income = total_amount / total_income * 100
      }
      Animated.timing(progressIncome, {
        toValue: percentage_income, // Animate to 100%
        duration: 2000, // Duration for the animation
        useNativeDriver: false, // Native driver can't handle width, so set this to false
      }).start();
    }
  }, [maxWidthIncome, wallet]);

  React.useEffect(() => {
    if (maxWidthExpenditure > 0) {
      const total_expenditure = wallet.total_expenditure
      let percentage_expenditure = 0
      if (total_expenditure > 0) {
        const total_amount = wallet.total_amount
        percentage_expenditure = total_expenditure / total_amount * 100
      }
      Animated.timing(progressExpenditure, {
        toValue: percentage_expenditure,
        duration: 2000,
        useNativeDriver: false
      }).start();
    }
  }, [maxWidthExpenditure, wallet]);

  const animatedWidthIncome = progressIncome.interpolate({
    inputRange: [0, 100], // Input range is from 0% to 100%
    outputRange: [0, maxWidthIncome], // Output range is from 0 to maxWidth
  });

  const animatedWidthExpenditure = progressExpenditure.interpolate({
    inputRange: [0, 100],
    outputRange: [0, maxWidthExpenditure],
  });

  return (
    <SafeAreaView className='bg-gray-900'>
      <View className='h-full p-2'>
        <View className='flex p-4 space-y-4 bg-gray-700 border border-gray-600 rounded-lg'>
          <View className='flex flex-row justify-between'>
            <Text className='text-base font-extrabold text-white'>Tài khoản của tôi</Text>
            <Text className='text-base font-bold text-white'>{formatMoney(wallet.total_amount)} VND</Text>
          </View>

          <View className='flex'>
            <Text className='text-base font-extrabold text-white'>Thu nhập</Text>
            <View
              className='h-3 bg-white rounded-full'
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setMaxWidthIncome(width);
              }}
            >
              <Animated.View
                className='h-3 rounded-full'
                style={{
                  backgroundColor: '#FC00A8',
                  width: animatedWidthIncome
                }} />
            </View>
            <Text className='pt-2 font-bold text-white' style={{ color: '#FC00A8' }}>+{formatMoney(wallet.total_income)} VND</Text>
          </View>

          <View className='flex'>
            <Text className='text-base font-extrabold text-white'>Chi tiêu</Text>
            <View
              className='h-3 bg-white rounded-full'
              style={{ backgroundColor: '#C4C4C4' }}
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setMaxWidthExpenditure(width);
              }}
            >
              <Animated.View
                className='h-3 rounded-full'
                style={{
                  backgroundColor: '#46BB1D',
                  width: animatedWidthExpenditure
                }} />
            </View>
            <Text className='pt-2 font-bold text-white' style={{ color: '#46BB1D' }}>-{formatMoney(wallet.total_expenditure)} VND</Text>
          </View>
        </View>
        <View
          className='flex flex-row justify-between p-2 my-2 bg-gray-700 border border-gray-600 rounded-md'
        >
          <CalendarComponent />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default WalletScreen