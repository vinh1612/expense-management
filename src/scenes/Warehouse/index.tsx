import { View, SafeAreaView } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'

const WarehouseScreen = () => {
  return (
    <SafeAreaView>
      <View className='flex items-center justify-center h-full'>
        <FastImage
          source={require('../../assets/imageGIFs/coming-soon.gif')}
          resizeMode={FastImage.resizeMode.contain}
          className='w-full h-28'
        />
      </View>
    </SafeAreaView>
  )
}

export default WarehouseScreen