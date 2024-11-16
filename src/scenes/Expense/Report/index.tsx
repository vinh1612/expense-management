import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import LineChartComponent from '../../../components/LineChartComponent'
import PieChartComponent from '../../../components/PieChartComponent'

const ReportScreen = () => {

  // const renderDotChart = (color: string, text: string) => {
  //   return (
  //     <View>
  //       <View className={`w-3 h-3 ${color} rounded-full`}></View>
  //       <Text className='text-white'>{text}</Text>
  //     </View>
  //   )
  // }

  return (
    <SafeAreaView className='bg-gray-900'>
      <View className='h-full p-2 space-y-4'>
        <View
          className='p-2 bg-gray-700 border border-gray-600 rounded-xl'
        >
          <View className='flex flex-row items-center justify-start py-4 space-x-4'>
            <View className='flex flex-row items-center space-x-2'>
              <View className='w-3 h-3 rounded-sm bg-[#FC00A8]' />
              <Text className='font-bold text-white'>Thu nhập</Text>
            </View>
            <View className='flex flex-row items-center space-x-2'>
              <View className='w-3 h-3 rounded-sm bg-[#46BB1D]' />
              <Text className='font-bold text-white'>Chi tiêu</Text>
            </View>
          </View>
          <LineChartComponent />
        </View>
        <View className='flex flex-row '>
          <PieChartComponent />
          <View className='flex flex-col items-center justify-center space-y-2'>
            <View className='w-3 h-3 bg-green-400 rounded-full'></View>
            <View className='w-3 h-3 bg-red-400 rounded-full'></View>
            <View className='w-3 h-3 bg-blue-400 rounded-full'></View>
            <View className='w-3 h-3 bg-pink-400 rounded-full'></View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ReportScreen