import { View, Text, SafeAreaView, Image, SectionList } from 'react-native'
import React from 'react'
import { formatDate } from '../../../utils/TimeUtil'
import { formatMoney } from '../../../utils/NumberUtils';
import useArray from '../../../hooks/useArray';
import { Transaction, TransactionSection } from '../../../types/Transaction';
import { TransactionCache } from '../../../storages/Storages';
import EmptyList from '../../../components/EmptyList';
import { useIsFocused } from '@react-navigation/native';
import LineChartComponent from '../../../components/LineChartComponent';

const TransactionScreen = () => {

  const groupDataByTime = (data: any[]) => {
    return data.reduce((acc, item) => {
      const existingGroup = acc.find((group: any) => group.title === item.created_at);
      if (existingGroup) {
        existingGroup.data.push(item);
      } else {
        acc.push({
          title: item.created_at,
          data: [item]
        });
      }
      return acc;
    }, []);
  };
  const transactions = useArray<Transaction>(TransactionCache.getInstance.getTransactionCache())
  const transactionsSection = useArray<TransactionSection>(groupDataByTime(TransactionCache.getInstance.getTransactionCache()))
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused && TransactionCache.getInstance.getTransactionCache().length !== transactions.array.length) {
      transactions.set(TransactionCache.getInstance.getTransactionCache())
      transactionsSection.set(groupDataByTime(TransactionCache.getInstance.getTransactionCache()))
    }
  }, [isFocused])



  return (
    <SafeAreaView className='bg-gray-900'>
      <View className='h-full px-2 pt-2 space-y-4'>
        <View
          className='p-2 bg-gray-700 border border-gray-600 rounded-xl'
        >
          <View className='flex flex-row items-center justify-start py-4 space-x-4'>
            <View className='flex flex-row items-center space-x-2'>
              <View className='w-3 h-3 rounded-sm' style={{ backgroundColor: '#FC00A8' }} />
              <Text className='font-bold text-white'>Thu nhập</Text>
            </View>
            <View className='flex flex-row items-center space-x-2'>
              <View className='w-3 h-3 rounded-sm' style={{ backgroundColor: '#46BB1D' }} />
              <Text className='font-bold text-white'>Chi tiêu</Text>
            </View>
          </View>
          <LineChartComponent />
        </View>
        <SectionList
          sections={transactionsSection.array}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyList message='Chưa có dữ liệu giao dịch' />}
          keyExtractor={(item) => item.transaction_id.toString()}
          renderItem={({ item }) => {
            const isIncome = item.transaction_type.is_income ? '+' : '-'
            return (
              <View className='flex flex-row items-center justify-between pb-3 space-x-2'>
                <Image
                  source={item.transaction_type.category_source}
                  className='flex-none w-12 h-12 bg-white rounded-full'
                />
                <View className='flex flex-row items-center justify-between flex-1 space-x-4'>
                  <View className='flex-1'>
                    <Text className='text-white'>{item.transaction_name}</Text>
                    <Text className='text-white'>{item.transaction_type.category_name}</Text>
                  </View>
                  <View className='items-end flex-none'>
                    <Text className='text-white'>{isIncome + formatMoney(item.transaction_amount)} đ</Text>
                    <Text className='text-white'>{item.source}</Text>
                  </View>
                </View>
              </View>
            )
          }}
          renderSectionHeader={({ section: { title } }) => {
            const { formattedDate, dayOfWeek } = formatDate(title)
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
    </SafeAreaView>
  )
}

export default TransactionScreen