import { View, Text, SafeAreaView, useColorScheme } from 'react-native'
import React from 'react'

const WalletScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaView style={{ 
      ...isDarkMode && ({ backgroundColor: '#161B27' })
      }}>
      <View className='flex items-center justify-center h-full'>
        <Text className='dark:text-white'>Wallet Screen</Text>
      </View>
    </SafeAreaView>
  )
}

export default WalletScreen