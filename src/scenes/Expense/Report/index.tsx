import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import LineChartComponent from '../../../components/LineChartComponent'
import PieChartComponent from '../../../components/PieChartComponent'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppScreenEnum from '../../../navigation/enums/AppScreenEnum';

const Tab = createMaterialTopTabNavigator();
const ReportScreen = () => {

  const renderDotChart = ({ color, text }: { color: string, text: string }) => {
    return (
      <View className='flex flex-row items-center space-x-2'>
        <View className={`w-3 h-3 ${color} rounded-full`}></View>
        <Text className='text-white'>{text}</Text>
      </View>
    )
  }

  const pieData = [
    { value: 47, color: '#FFA84A', text: '47%' },
    { value: 20, color: '#FB67CA', text: '20%' },
    { value: 23, color: '#9B88ED', text: '23%' },
    { value: 40, color: '#04BFDA', text: '40%' },
  ];

  function navigationTabBar() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: '#0071BB',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            height: 3
          },
          tabBarLabelStyle: {
            fontWeight: 700
          },
          tabBarStyle: {
            backgroundColor: '#111827'

          },
          tabBarActiveTintColor: '#0071BB',
          tabBarInactiveTintColor: 'white',
          tabBarPressColor: 'rgba(0, 113, 187, .1)'
        }}
      >
        <Tab.Screen
          options={{ tabBarLabel: 'Chi tiêu' }}
          name={AppScreenEnum.EXPENDITURE_SCREEN}
        >
          {() => renderContentReport()}
        </Tab.Screen>
        <Tab.Screen
          options={{ tabBarLabel: 'Thu nhập' }}
          name={AppScreenEnum.INCOME_SCREEN}
        >
          {() => renderContentReport()}
        </Tab.Screen>
      </Tab.Navigator>
    )
  }

  function renderContentReport() {
    return (
      <ScrollView showsVerticalScrollIndicator={false} className='bg-gray-900'>
        <View className='h-full p-2 space-y-4'>
          <View className='p-2 bg-gray-700 border border-gray-600 rounded-xl'>
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
          <View className='flex flex-row items-center flex-1 p-2 space-x-4 bg-gray-700 border border-gray-600 rounded-xl'>
            <PieChartComponent pieData={pieData} />
            <View className='flex flex-col flex-1 space-y-2'>
              {renderDotChart({ color: 'bg-[#FFA84A]', text: 'Thu nhập' })}
              {renderDotChart({ color: 'bg-[#FB67CA]', text: 'Riêng tôi' })}
              {renderDotChart({ color: 'bg-[#9B88ED]', text: 'Thú cưng' })}
              {renderDotChart({ color: 'bg-[#04BFDA]', text: 'Xã giao' })}
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <SafeAreaView className='bg-gray-900'>
      <View className='h-full'>
        {navigationTabBar()}
      </View>
    </SafeAreaView >
  )
}

export default ReportScreen