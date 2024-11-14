import { View, Text, Image } from 'react-native'
import React from 'react'


interface EmptyListProps {
  message?: string
}

const EmptyList = ({ message }: EmptyListProps) => {
  return (
    <View className="flex items-center justify-center pb-4 space-y-1">
      <Image
        source={require('../assets/images/empty.png')}
        className='w-full h-52'
        resizeMode='contain'
      />
      <Text className='text-lg font-bold text-center text-gray-400'>{message ?? 'Chưa có dữ liệu'}</Text>
    </View>
  )
}

export default EmptyList