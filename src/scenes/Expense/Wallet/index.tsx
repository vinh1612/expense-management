import { View, Text, SafeAreaView, Animated } from 'react-native'
import React from 'react'
import { formatMoney, randomIntFromInterval } from '../../../utils/NumberUtils';
import { WalletCache } from '../../../storages/Storages';
import { Wallet } from '../../../models';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { MENU_TITLE, TEXT_STRING } from '../../../constants/String';

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
      const totalAmount = wallet.totalIncome + wallet.totalExpenditure
      percentage = forItem / totalAmount * 100
    }
    Animated.timing(progress, {
      toValue: percentage, // Animate to 100%
      duration: 2000, // Duration for the animation
      useNativeDriver: false, // Native driver can't handle width, so set this to false
    }).start();
  }

  React.useEffect(() => {
    if (maxWidthIncome > 0) {
      setAnimatedProgress(progressIncome, wallet.totalIncome)
    }
  }, [maxWidthIncome, wallet]);

  React.useEffect(() => {
    if (maxWidthExpenditure > 0) {
      setAnimatedProgress(progressExpenditure, wallet.totalExpenditure)
    }
  }, [maxWidthExpenditure, wallet]);

  React.useEffect(() => {
    if (isFocused && WalletCache.getInstance.getWalletCache().totalAmount !== wallet.totalAmount) {
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
      <View className='space-y-1'>
        <View className='flex flex-row items-center justify-between gap-x-4'>
          <Text className='text-lg font-bold text-white'>{progressTitle}</Text>
          <Text className='flex-1 text-base font-bold text-right' style={{ color: progressColor }}>{amount} {TEXT_STRING.UNIT}</Text>
        </View>
        <View
          className='h-4 bg-white rounded-full'
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setMaxWidth(width);
          }}
        >
          <Animated.View
            className='h-4 rounded-full'
            style={{ backgroundColor: progressColor, width: progressWidth }}
          />
        </View>
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
          <View className='flex flex-row items-center justify-between gap-x-4'>
            <Text className='text-2xl font-bold text-white capitalize'>{MENU_TITLE.MY_ACCOUNT}</Text>
            <Text className='flex-1 text-lg font-bold text-right text-white'>{formatMoney(wallet.totalAmount)} {TEXT_STRING.UNIT}</Text>
          </View>

          {renderViewProgress({
            progressTitle: TEXT_STRING.INCOME,
            progressColor: '#FC00A8',
            progressWidth: animatedWidthIncome,
            amount: `+${formatMoney(wallet.totalIncome)}`,
            setMaxWidth: setMaxWidthIncome
          })}

          {renderViewProgress({
            progressTitle: TEXT_STRING.EXPENSE,
            progressColor: '#46BB1D',
            progressWidth: animatedWidthExpenditure,
            amount: `-${formatMoney(wallet.totalExpenditure)}`,
            setMaxWidth: setMaxWidthExpenditure
          })}
        </View>
        <View className='flex items-center justify-center flex-1 bg-gray-700 border border-gray-600 rounded-lg'>
          <FastImage
            source={imageGIFsFunny[randomIntFromInterval(0, imageGIFsFunny.length - 1)]}
            resizeMode={FastImage.resizeMode.contain}
            className='w-full h-full'
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default WalletScreen