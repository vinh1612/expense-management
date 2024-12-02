import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import LineChartComponent from '../../../components/LineChartComponent'
import PieChartComponent from '../../../components/PieChartComponent'
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import AppScreenEnum from '../../../navigation/enums/AppScreenEnum';
import useArray from '../../../hooks/useArray';
import { Transaction } from '../../../types';
import { TransactionCache } from '../../../storages/Storages';
import CustomDropdown from '../../../components/CustomDropdown';
import { REPORT_BY } from '../../../constants/Constant';
import dayjs from 'dayjs';
import CustomMonthYearPicker from '../../../components/CustomMonthYearPicker';
import CustomDateTimePicker from '../../../components/CustomDateTimePicker';

const Tab = createMaterialTopTabNavigator();
const ReportScreen = () => {

  const transactions = useArray<Transaction>(TransactionCache.getInstance.getTransactionCache())

  const [selected, setSelected] = React.useState<number>(REPORT_BY.MONTH);
  const [showMonthYearPicker, setShowMonthYearPicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [isIncomeState, setIsIncomeState] = React.useState(false);
  const [reportState, setReportState] = React.useState({
    dateTimeIncome: new Date(),
    dateStringIncome: dayjs(new Date()).format('MM/YYYY'),
    dateTimeExpense: new Date(),
    dateStringExpense: dayjs(new Date()).format('MM/YYYY'),
  });

  const options = [
    { id: REPORT_BY.WEEK, label: 'Lọc theo tuần' },
    { id: REPORT_BY.MONTH, label: 'Lọc theo tháng' },
    { id: REPORT_BY.YEAR, label: 'Lọc theo năm' },
  ];

  const pieData = [
    { value: 47, color: '#FFA84A', text: '47%' },
    { value: 20, color: '#FB67CA', text: '20%' },
    { value: 23, color: '#9B88ED', text: '23%' },
    { value: 40, color: '#04BFDA', text: '40%' },
  ];

  const lineIncome = [
    { value: 12e6, label: 'T1' },
    { value: 12e6, label: 'T2' },
    { value: 12e6, label: 'T3' },
    { value: 12e6, label: 'T4' },
    { value: 12e6, label: 'T5' },
    { value: 12e6, label: 'T6' },
    { value: 12e6, label: 'T7' },
    { value: 12e6, label: 'T8' },
    { value: 12e6, label: 'T9' },
    { value: 12e6, label: 'T10' },
    { value: 12e6, label: 'T11' },
    { value: 12e6, label: 'T12' },
  ];
  const lineExpense = [
    { value: 6e6, label: 'T1' },
    { value: 3e6, label: 'T2' },
    { value: 75e5, label: 'T3' },
    { value: 12e5, label: 'T4' },
    { value: 5e6, label: 'T5' },
    { value: 3e6, label: 'T6' },
    { value: 2e6, label: 'T7' },
    { value: 9e6, label: 'T8' },
    { value: 12e6, label: 'T9' },
    { value: 11e6, label: 'T10' },
    { value: 7e6, label: 'T11' },
    { value: 9e6, label: 'T12' },
  ];

  const handleChooseTime = (dateTime: Date) => {
    const stringDate = dayjs(dateTime).format(selected === REPORT_BY.MONTH ? 'MM/YYYY' : 'YYYY')
    setReportState((prevState) => ({
      ...prevState,
      ...(isIncomeState
        ? { dateTimeIncome: dateTime, dateStringIncome: stringDate }
        : { dateTimeExpense: dateTime, dateStringExpense: stringDate })
    }));
    setShowDatePicker(false)
  }

  const renderDotChart = ({ color, text }: { color: string, text: string }) => {
    return (
      <View className='flex flex-row items-center space-x-2'>
        <View className={`w-3 h-3 ${color} rounded-full`}></View>
        <Text className='text-white'>{text}</Text>
      </View>
    )
  }

  const optionScreen: MaterialTopTabNavigationOptions = {
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
  }

  function navigationTabBar() {
    return (
      <Tab.Navigator screenOptions={optionScreen} >
        <Tab.Screen
          options={{ tabBarLabel: 'Chi tiêu' }}
          name={AppScreenEnum.EXPENDITURE_SCREEN}
          listeners={{ blur: () => setIsIncomeState(true) }}
        >
          {() => renderContentReport({ isIncome: false })}
        </Tab.Screen>
        <Tab.Screen
          options={{ tabBarLabel: 'Thu nhập' }}
          name={AppScreenEnum.INCOME_SCREEN}
          listeners={{ blur: () => setIsIncomeState(false) }}
        >
          {() => renderContentReport({ isIncome: true })}
        </Tab.Screen>
      </Tab.Navigator>
    )
  }

  const renderContentReport = ({ isIncome }: { isIncome: boolean }) => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} className='bg-gray-900'>
        <View className='h-full px-2 py-4 space-y-4'>
          <View className='flex flex-row items-center justify-between px-2 space-x-4'>
            <View className='flex flex-col'>
              <Text className='text-xl font-bold text-white'>{isIncome ? 'Thu nhập' : 'Chi tiêu'}</Text>
              <Text className='text-xl font-bold text-white'>{isIncome ? '+' : '-'}10,000,000 VND</Text>
            </View>
            <View className='min-w-[140px]'>
              <CustomDropdown
                options={options}
                selectedId={selected}
                labelShowSpec={isIncome ? reportState.dateStringIncome : reportState.dateStringExpense}
                onSelect={(option) => {
                  if (option.id === REPORT_BY.WEEK) {
                    setShowDatePicker(true)
                  } else {
                    setShowMonthYearPicker(true)
                  }
                  setSelected(option.id)
                }}
              />
            </View>
          </View>
          <View className='p-2 bg-gray-700 border border-gray-600 rounded-xl'>
            <Text className='text-base text-white'>Thống kê {isIncome ? 'thu nhập' : 'chi tiêu'} theo tháng</Text>
            <View className='py-2'>
              <LineChartComponent
                lineData1={isIncome ? lineIncome : lineExpense}
                color1={isIncome ? '#FC00A8' : '#46BB1D'}
              />
            </View>
          </View>
          <View className='p-2 space-y-4 bg-gray-700 border border-gray-600 rounded-xl'>
            <Text className='text-base text-white'>So sánh các loại {isIncome ? 'thu nhập' : 'chi tiêu'}</Text>
            <View className='flex flex-row items-center space-x-4'>
              <PieChartComponent pieData={pieData} />
              <View className='flex flex-col flex-1 space-y-2'>
                {renderDotChart({ color: 'bg-[#FFA84A]', text: 'Thu nhập' })}
                {renderDotChart({ color: 'bg-[#FB67CA]', text: 'Riêng tôi' })}
                {renderDotChart({ color: 'bg-[#9B88ED]', text: 'Thú cưng' })}
                {renderDotChart({ color: 'bg-[#04BFDA]', text: 'Xã giao' })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView className='bg-gray-900'>
      <View className='h-full'>
        {
          navigationTabBar()
        }
        <CustomMonthYearPicker
          showPicker={showMonthYearPicker}
          mode={selected === REPORT_BY.MONTH ? "month" : "year"}
          onConfirm={(selectedDate) => {
            handleChooseTime(selectedDate)
            setShowMonthYearPicker(false)
          }}
          onClose={() => setShowMonthYearPicker(false)}
          initialDate={
            isIncomeState ? reportState.dateTimeIncome : reportState.dateTimeExpense
          }
        />
        <CustomDateTimePicker
          isShow={showDatePicker}
          onClose={() => setShowDatePicker(false)}
        />
      </View>
    </SafeAreaView >
  )
}

export default ReportScreen