import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AppScreenEnum from '../../navigation/enums/AppScreenEnum';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const HomeScreen = ({ navigation }: any) => {
    
    return (
        <SafeAreaView>
            <View className='flex flex-row items-center h-full gap-4 px-4'>
                <TouchableOpacity
                    className='flex-1 p-3 bg-white border border-gray-200 shadow-lg rounded-2xl'
                    onPress={() => navigation.push(AppScreenEnum.EXPENSE_NAVIGATOR)}
                >
                    <View>
                        <Image source={require('../../assets/images/expense-banner.png')} className='mb-2 w-36 h-36'/>
                        <Text className='font-bold text-center text-gray-700'>Chi tiêu</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    className='flex-1 p-3 bg-white border border-gray-200 shadow-lg rounded-2xl'
                    onPress={() => navigation.push(AppScreenEnum.WAREHOUSE_NAVIGATOR)}
                >
                    <View>
                        <Image source={require('../../assets/images/4.png')} className='mb-2 w-36 h-36'/>
                        <Text className='font-bold text-center text-gray-700'>Kho hàng</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;
