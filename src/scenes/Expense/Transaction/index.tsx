import { View, Text, SafeAreaView, Image, SectionList, FlatList, Pressable, Animated, Easing, ImageSourcePropType } from 'react-native'
import React from 'react'
import { formatDate, parseDateString } from '../../../utils/TimeUtil'
import { formatMoney } from '../../../utils/NumberUtils';
import useArray from '../../../hooks/useArray';
import { Transaction, TransactionByMonth } from '../../../types/Transaction';
import { TransactionCache } from '../../../storages/Storages';
import EmptyList from '../../../components/EmptyList';
import { useIsFocused } from '@react-navigation/native';
import { TRANSACTION_SOURCE } from '../../../constants/Constant';
import CalendarComponent from '../../../components/CalendarComponent';
import DoubleArrowIcon from '../../../assets/svgIcons/DoubleArrowIcon';

const TransactionScreen = () => {

  const groupDataByTime = (data: Transaction[], month: number, year: number): TransactionByMonth[] => {
    return data.reduce((acc: TransactionByMonth[], item) => {
      const transactionDate = parseDateString(item.created_at);
      if (transactionDate.getMonth() === month && transactionDate.getFullYear() === year) {
        const existingGroup = acc.find((group: TransactionByMonth) => group.date_time === item.created_at);
        if (existingGroup) {
          existingGroup.data.push(item);
        } else {
          acc.push({
            date_time: item.created_at,
            data: [item],
          });
        }
      }
      return acc;
    }, []).sort((a: TransactionByMonth, b: TransactionByMonth) => {
      return parseDateString(b.date_time).getTime() - parseDateString(a.date_time).getTime();
    });
  };

  const transactions = useArray<Transaction>(TransactionCache.getInstance.getTransactionCache())
  const transactionsSection = useArray<TransactionByMonth>(
    groupDataByTime(TransactionCache.getInstance.getTransactionCache(),
      new Date().getMonth(),
      new Date().getFullYear())
  )
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused && TransactionCache.getInstance.getTransactionCache().length !== transactions.array.length) {
      transactions.set(TransactionCache.getInstance.getTransactionCache())
      transactionsSection.set(
        groupDataByTime(
          TransactionCache.getInstance.getTransactionCache(),
          new Date().getMonth(),
          new Date().getFullYear()
        )
      )
    }
  }, [isFocused])

  const handleMonthChange = (newMonth: number, newYear: number) => {
    transactionsSection.set(groupDataByTime(transactions.array, newMonth, newYear));
  };

  const getTransactionSourceText = (transactionSource: number) => {
    switch (transactionSource) {
      case TRANSACTION_SOURCE.CASH:
        return 'Tiền Mặt'
      case TRANSACTION_SOURCE.BANK:
        return 'Tài Khoản Ngân Hàng'
      default:
        return 'Ví MoMo'
    }
  }

  const [isRotated, setIsRotated] = React.useState(true); // State to toggle rotation
  const rotationValue = React.useRef(new Animated.Value(0)).current; // Ref for the animation value

  const handlePress = () => {
    setIsRotated(!isRotated); // Toggle the rotation state
    Animated.timing(rotationValue, {
      toValue: isRotated ? 0 : 1, // Rotate back and forth
      duration: 500,
      useNativeDriver: true, // Enable native driver for better performance
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  return (
    <SafeAreaView className='bg-gray-900'>
      <FlatList
        data={[]}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        className='h-full'
        ListHeaderComponent={
          <View className='h-full px-2 pt-2 space-y-6'>
            <View
              className={`p-2 ${isRotated ? 'pb-4' : ''} bg-gray-700 border border-gray-600 rounded-xl`}
            >
              <CalendarComponent
                data={transactionsSection.array}
                onMonthChange={handleMonthChange}
                isExpanded={isRotated}
              />

              <Pressable
                className='absolute bottom-[-16px] self-center bg-gray-700 px-8 pt-2 pb-1 rounded-full'
                onPress={handlePress}
              >
                <DoubleArrowIcon direction={isRotated ? 'up' : 'down'} color='gray' size={18} />
              </Pressable>
            </View>

            <SectionList
              sections={transactionsSection.array}
              contentContainerStyle={{ flexGrow: 1 }}
              scrollEnabled={false}
              ListEmptyComponent={<EmptyList message='Chưa có dữ liệu giao dịch' />}
              keyExtractor={(item) => item.transaction_id.toString()}
              renderItem={({ item }) => {
                const isIncome = item.transaction_type.is_income ? '+' : '-'
                return (
                  <View className='flex flex-row items-center justify-between pb-3 space-x-2'>
                    <Image
                      source={typeof item.transaction_type.category_source === 'string'
                        ? { uri: item.transaction_type.category_source }
                        : item.transaction_type.category_source as ImageSourcePropType
                      }
                      className='flex-none w-12 h-12 bg-white rounded-full'
                    />
                    <View className='flex flex-row items-center justify-between flex-1 space-x-4'>
                      <View className='flex-1'>
                        <Text className='text-white'>{item.transaction_type.category_name}</Text>
                        <Text className='text-white'>{item.transaction_note}</Text>
                      </View>
                      <View className='items-end flex-none'>
                        <Text className='text-white'>{isIncome + formatMoney(item.transaction_amount)} đ</Text>
                        <Text className='text-white'>{getTransactionSourceText(item.source)}</Text>
                      </View>
                    </View>
                  </View>
                )
              }} renderSectionHeader={({ section: { date_time } }) => {
                const { formattedDate, dayOfWeek } = formatDate(date_time)
                return (
                  <View
                    className='flex flex-row justify-between p-2 my-2 bg-gray-700 border border-gray-600 rounded-md'
                  >
                    <Text className='text-white'>{formattedDate}</Text>
                    <Text className='text-white'>{dayOfWeek}</Text>
                  </View>
                )
              }}
            />
          </View>
        }
      />
    </SafeAreaView>
  )
}
export default TransactionScreen