import { View, Text, SafeAreaView, useColorScheme } from 'react-native'
import React from 'react'

const ReportScreen = () => {

  return (
    <SafeAreaView className='bg-gray-900'>
      <View className='flex items-center justify-center h-full'>
        <Text className='dark:text-white'>Report Screen</Text>
      </View>
    </SafeAreaView>
  )
}

export default ReportScreen