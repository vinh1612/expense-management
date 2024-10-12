import { View, Text, SafeAreaView, FlatList, useColorScheme, Image, Platform } from 'react-native'
import React from 'react'
import { formatDate } from '../../../utils/TimeUtil'
import { formatMoney } from '../../../utils/NumberUtils';

const TransactionScreen = () => {
  
  const isDarkMode = useColorScheme() === 'dark';

  const data = [
    { id: 1, transaction_name: 'Transaction 1', transaction_type: 'Riêng tôi', amount: 100000, source: 'Ví của tôi', created_at: '22/04/2024' },
    { id: 2, transaction_name: 'Transaction 2', transaction_type: 'Riêng tôi', amount: 50000, source: 'Ví của tôi', created_at: '23/04/2024' },
    { id: 3, transaction_name: 'Transaction 3', transaction_type: 'Riêng tôi', amount: 50000, source: 'Ví của tôi', created_at: '24/04/2024' },
    { id: 4, transaction_name: 'Transaction 4', transaction_type: 'Riêng tôi', amount: 50000, source: 'Ví của tôi', created_at: '25/04/2024' },
    { id: 5, transaction_name: 'Transaction 5', transaction_type: 'Riêng tôi', amount: 50000, source: 'Ví của tôi', created_at: '26/04/2024' },
    { id: 6, transaction_name: 'Transaction 6', transaction_type: 'Riêng tôi', amount: 50000, source: 'Ví của tôi', created_at: '27/04/2024' },
    { id: 7, transaction_name: 'Transaction 7', transaction_type: 'Riêng tôi', amount: 50000, source: 'Ví của tôi', created_at: '28/04/2024' },
    { id: 8, transaction_name: 'Transaction 8', transaction_type: 'Riêng tôi', amount: 50000, source: 'Ví của tôi', created_at: '29/04/2024' },
  ]

  return (
    <SafeAreaView style={{ 
      ...isDarkMode && ({ backgroundColor: '#161B27' })
      }}
    >
      <View className='h-full' style={{ paddingBottom: Platform.OS === 'ios' ? 50 : 85 }}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const { formattedDate, dayOfWeek } = formatDate(item.created_at)
            return (
              <View className='px-3 pb-5'>
                <View
                  className='flex flex-row justify-between p-2 rounded-md'
                  style={{
                    backgroundColor: isDarkMode ? '#474B54' : '#E5E5E5'
                  }}
                >
                  <Text className='dark:text-white'>{formattedDate}</Text>
                  <Text className='dark:text-white'>{dayOfWeek}</Text>
                </View>
                <View className='flex flex-row items-center justify-between gap-2 pt-3'>
                  <Image
                    source={require('../../../assets/images/food.png')}
                    className='flex-none w-12 h-12 rounded-full'
                    style={{ backgroundColor: isDarkMode ? '#fff' : '#000'}}
                  />
                  <View className='flex flex-row justify-between flex-1'>
                    <View>
                      <Text className='dark:text-white'>{item.transaction_name}</Text>
                      <Text className='dark:text-white'>{item.transaction_type}</Text>
                    </View>
                    <View>
                      <Text className='dark:text-white'>{formatMoney(item.amount)} đ</Text>
                      <Text className='dark:text-white'>{item.source}</Text>
                    </View> 
                  </View>
                </View>
              </View>
            )
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default TransactionScreen