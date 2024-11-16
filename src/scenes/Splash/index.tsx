import React from "react";
import { Image, ImageBackground, Text, View } from 'react-native';

const SplashScreen = () => {
    return (
        <ImageBackground source={require('../../assets/images/background-splash.png')} className="relative w-screen h-screen">
            <View className="flex items-center justify-center w-full h-full">
                <Image source={require('../../assets/images/slash-logo.png')} />
            </View>

            <View className="absolute inset-x-0 flex items-center bottom-6">
                <Text className="text-base text-white">From</Text>
                <Text className="text-lg text-white">ViHo with love</Text>
            </View>
        </ImageBackground>
    );
}

export default SplashScreen; 