import { View, Text, SafeAreaView, Animated } from 'react-native'
import React from 'react'
import { formatMoney, randomIntFromInterval } from '../../../utils/NumberUtils';
import { WalletCache } from '../../../storages/Storages';
import { Wallet } from '../../../types';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const WalletScreen = () => {

  const [progressIncome] = React.useState(new Animated.Value(0));
  const [progressExpenditure] = React.useState(new Animated.Value(0));
  const [maxWidthIncome, setMaxWidthIncome] = React.useState(0);
  const [maxWidthExpenditure, setMaxWidthExpenditure] = React.useState(0);
  const [wallet, setWallet] = React.useState<Wallet>(new Wallet())
  const isFocused = useIsFocused();

  const animatedWidthIncome = progressIncome.interpolate({
    inputRange: [0, 100], // Input range is from 0% to 100%
    outputRange: [0, maxWidthIncome], // Output range is from 0 to maxWidth
  });

  const animatedWidthExpenditure = progressExpenditure.interpolate({
    inputRange: [0, 100],
    outputRange: [0, maxWidthExpenditure],
  });

  const setAnimatedProgress = (progress: Animated.Value, forItem: number) => {
    let percentage = 0
    if (forItem > 0) {
      const total_amount = wallet.total_income + wallet.total_expenditure
      percentage = forItem / total_amount * 100
    }
    Animated.timing(progress, {
      toValue: percentage, // Animate to 100%
      duration: 2000, // Duration for the animation
      useNativeDriver: false, // Native driver can't handle width, so set this to false
    }).start();
  }

  React.useEffect(() => {
    if (maxWidthIncome > 0) {
      setAnimatedProgress(progressIncome, wallet.total_income)
    }
  }, [maxWidthIncome, wallet]);

  React.useEffect(() => {
    if (maxWidthExpenditure > 0) {
      setAnimatedProgress(progressExpenditure, wallet.total_expenditure)
    }
  }, [maxWidthExpenditure, wallet]);

  React.useEffect(() => {
    if (isFocused && WalletCache.getInstance.getWalletCache().total_amount !== wallet.total_amount) {
      setWallet(WalletCache.getInstance.getWalletCache())
    }
  }, [isFocused]);

  interface ViewProgressProps {
    progressTitle: string;
    progressColor: string;
    progressWidth: Animated.AnimatedInterpolation<string | number>;
    amount: string;
    setMaxWidth: (width: number) => void;
  }

  const renderViewProgress = ({ progressTitle, progressColor, progressWidth, amount, setMaxWidth }: ViewProgressProps) => {
    return (
      <View className='flex space-y-1'>
        <Text className='text-base font-extrabold text-white'>{progressTitle}</Text>
        <View
          className='h-3 bg-white rounded-full'
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setMaxWidth(width);
          }}
        >
          <Animated.View
            className='h-3 rounded-full'
            style={{ backgroundColor: progressColor, width: progressWidth }}
          />
        </View>
        <Text className='font-bold' style={{ color: progressColor }}>{amount} VND</Text>
      </View>
    )
  }

  const imageGIFsFunny = [
    require('../../../assets/imageGIFs/goma-cat-toilet.gif'),
    require('../../../assets/imageGIFs/peach-calm-mind.gif'),
    require('../../../assets/imageGIFs/peach-goma-fan.gif'),
    require('../../../assets/imageGIFs/peach-goma-sleep.gif'),
    require('../../../assets/imageGIFs/peach-goma-tease.gif'),
    require('../../../assets/imageGIFs/peach-goma-tease-2.gif'),
    require('../../../assets/imageGIFs/peach-too-fat.gif'),
  ]

  return (
    <SafeAreaView className='bg-gray-900'>
      <View className='h-full px-2 py-4 space-y-4'>
        <View className='flex p-4 space-y-4 bg-gray-700 border border-gray-600 rounded-lg'>
          <View className='flex flex-row items-center justify-between'>
            <Text className='text-2xl font-extrabold text-white'>Tài khoản của tôi</Text>
            <Text className='text-base font-bold text-white'>{formatMoney(wallet.total_amount)} VND</Text>
          </View>

          {renderViewProgress({
            progressTitle: 'Thu nhập',
            progressColor: '#FC00A8',
            progressWidth: animatedWidthIncome,
            amount: `+${formatMoney(wallet.total_income)}`,
            setMaxWidth: setMaxWidthIncome
          })}

          {renderViewProgress({
            progressTitle: 'Chi tiêu',
            progressColor: '#46BB1D',
            progressWidth: animatedWidthExpenditure,
            amount: `-${formatMoney(wallet.total_expenditure)}`,
            setMaxWidth: setMaxWidthExpenditure
          })}
        </View>
        <View className='flex justify-center flex-1 bg-gray-700 border border-gray-600 rounded-lg'>
          <FastImage
            source={imageGIFsFunny[randomIntFromInterval(0, imageGIFsFunny.length - 1)]}
            resizeMode={FastImage.resizeMode.center}
            className='w-full h-full'
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default WalletScreen