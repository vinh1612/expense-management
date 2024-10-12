import React from "react";
import { Image, ImageBackground, Text, View } from 'react-native';

const SplashScreen = () => {
    return (
        <>
            <ImageBackground source={require('../../assets/images/background-splash.png')} className="h-screen w-screen relative">
                <View className="flex items-center justify-center w-full h-full">
                    <Image source={require('../../assets/images/slash-logo.png')}/>
                </View>
                
                <View className="absolute bottom-6 inset-x-0 flex items-center">
                    <Text className="text-white text-base">From</Text>
                    <Text className="text-white text-lg">ViHo with love</Text>
                </View>
            </ImageBackground>
        </> 
    );
}

export default SplashScreen; 