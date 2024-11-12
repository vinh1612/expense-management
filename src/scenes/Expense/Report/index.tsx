import { View, Text, SafeAreaView, useColorScheme } from 'react-native'
import React from 'react'
import LineChartComponent from '../../../components/LineChartComponent'

const ReportScreen = () => {

  return (
    <SafeAreaView className='bg-gray-900'>
      <View className='h-full p-2'>
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
      </View>
    </SafeAreaView>
  )
}

export default ReportScreen