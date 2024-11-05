import { TouchableOpacity, Text, ViewStyle } from 'react-native'
import React from 'react'

interface ButtonComponentProps {
    title: string
    onPress?: () => void;
    className?: string;
    classNameText?: string;
    style?: ViewStyle
}

const ButtonComponent = ({
    onPress, title, className, classNameText, style
}: ButtonComponentProps) => {
  return (
    <TouchableOpacity
        className={`px-10 py-3 rounded-lg ${className}`}
        onPress={onPress}
        style={style}
    >
        <Text className={`font-bold text-white ${classNameText}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default ButtonComponent