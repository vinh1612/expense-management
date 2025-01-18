/*
import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import LineChartComponent from '../../../components/LineChartComponent'
import PieChartComponent from '../../../components/PieChartComponent'
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import AppScreenEnum from '../../../navigation/enums/AppScreenEnum';
import useArray from '../../../hooks/useArray';
import { TransactionCache } from '../../../storages/Storages';
import CustomDropdown from '../../../components/CustomDropdown';
import { REPORT_BY } from '../../../constants/Constant';
import CustomMonthYearPicker from '../../../components/CustomMonthYearPicker';
import CustomDateTimePicker from '../../../components/CustomDateTimePicker';
import { convertDateFormatToString } from '../../../utils/TimeUtil';
import { groupDataByTime } from '../../../utils/DataUtils';
import { TransactionByMonth } from '../../../types/Transaction';
import { formatMoney } from '../../../utils/NumberUtils';
import EmptyList from '../../../components/EmptyList';
import { getRandomHexColor } from '../../../utils/StringUtils';
import { getWeek } from 'date-fns';

const Tab = createMaterialTopTabNavigator();

const ReportScreen = () => {

  const isInitialRender = React.useRef(true);
  const [filter, setFilter] = React.useState({ income: REPORT_BY.MONTH, expense: REPORT_BY.MONTH });
  const [showMonthYearPicker, setShowMonthYearPicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [isIncomeState, setIsIncomeState] = React.useState(false);
  const [totalAmountState, setTotalAmountState] = React.useState({ income: 0, expense: 0 });
  const [reportState, setReportState] = React.useState({
    fromDateIncome: new Date(), toDateIncome: new Date(),
    fromDateExpense: new Date(), toDateExpense: new Date(),
    dateIncome: new Date(), dateExpense: new Date(),
    dateStringIncome: convertDateFormatToString({ date: new Date(), format: 'MM/YYYY' }),
    dateStringExpense: convertDateFormatToString({ date: new Date(), format: 'MM/YYYY' }),
  });

  const transactionData = TransactionCache.getInstance.getTransactionCache()
  const transactionsSection = useArray<TransactionByMonth>(
    groupDataByTime({ data: transactionData, month: new Date().getMonth(), year: new Date().getFullYear() })
  )

  const [pieData, setPieData] = React.useState<{
    income: { value: number, color: string, text: string }[],
    expense: { value: number, color: string, text: string }[],
    subIncome: { color: string, text: string }[],
    subExpense: { color: string, text: string }[]
  }>({ income: [], expense: [], subIncome: [], subExpense: [] })

  const options = [
    { id: REPORT_BY.WEEK, label: 'Lọc theo tuần' },
    { id: REPORT_BY.MONTH, label: 'Lọc theo tháng' },
    { id: REPORT_BY.YEAR, label: 'Lọc theo năm' },
  ];

  // const [lineData, setLineData] = React.useState<{
  //   income: { value: number, label: string }[],
  //   expense: { value: number, label: string }[]
  // }>({ income: [], expense: [] })

  const lineData = {
    income: Array(12).fill(null).map((_, i) => ({ value: 12e6, label: `T${i + 1}` })),
    expense: [6e6, 3e6, 75e5, 12e5, 5e6, 3e6, 2e6, 9e6, 12e6, 11e6, 7e6, 9e6]
      .map((value, i) => ({ value, label: `T${i + 1}` }))
  }

  React.useEffect(() => {
    const newSection = groupDataByTime({
      data: transactionData.filter((item) => {
        return item.transaction_type.is_income === isIncomeState
      }),
      ...((isIncomeState ? filter.income : filter.expense) === REPORT_BY.WEEK ? {
        fromDate: isIncomeState ? reportState.fromDateIncome : reportState.fromDateExpense,
        toDate: isIncomeState ? reportState.toDateIncome : reportState.toDateExpense,
      } : {
        ...((isIncomeState ? filter.income : filter.expense) === REPORT_BY.YEAR ? {
          year: isIncomeState ? reportState.dateIncome.getFullYear() : reportState.dateExpense.getFullYear(),
        } : {
          month: isIncomeState ? reportState.dateIncome.getMonth() : reportState.dateExpense.getMonth(),
          year: isIncomeState ? reportState.dateIncome.getFullYear() : reportState.dateExpense.getFullYear(),
        })
      }),
    })
    transactionsSection.set(newSection)
  }, [reportState, isIncomeState]);

  const processTransactionData = React.useCallback((transactions: TransactionByMonth[]) => {
    const categoryMap = new Map()
    let totalAmount = 0
    transactions.forEach(section => {
      section.data.forEach(item => {
        totalAmount += item.transaction_amount
        const color = getRandomHexColor()
        const categoryId = item.transaction_type.category_id
        categoryMap.set(categoryId, {
          amount: (categoryMap.get(categoryId)?.amount ?? 0) + item.transaction_amount,
          color,
          name: item.transaction_type.category_name
        })
      })
    })
    return { categoryMap, totalAmount }
  }, [])

  const handleDataLineChart = ({ isIncome }: {
    isIncome: boolean
  }) => {
    switch (isIncome ? filter.income : filter.expense) {
      case REPORT_BY.WEEK:
        // setLineData((prevLineData) => ({
        //   ...prevLineData,
        //   ...(isIncome
        //     ? { income: Array(7).fill(null).map((_, i) => ({ value: 12e6, label: `T${i + 1}` })) }
        //     : { expense: Array(7).fill(null).map((_, i) => ({ value: 12e6, label: `T${i + 1}` })) })
        // }));
        break;
      case REPORT_BY.MONTH:
        const date = isIncome ? reportState.dateIncome : reportState.dateExpense
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        let newDateLine: { value: number, label: string }[] = []
        Array.from({ length: daysInMonth }, (_, index) => index + 1).forEach((day) => {
          newDateLine.push({ value: 12e6, label: `${day}` })
        });
        // setLineData((prevLineData) => ({
        //   ...prevLineData,
        //   ...(
        //     isIncome ? { income: newDateLine } : { expense: newDateLine }
        //   )
        // }));
        console.log(newDateLine);
        break
      default:
        break

    };
  }

  React.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false; return; // Skip the first render
    }
    const { categoryMap, totalAmount } = processTransactionData(transactionsSection.array)
    let newSubPieData: { color: string, text: string }[] = [];
    const newPieData = Array.from(categoryMap).map(([_, item]) => {
      newSubPieData.push({ color: item.color, text: item.name });
      const value = (item.amount / totalAmount) * 100
      const valueDisplay = value % 1 === 0 ? value : value.toFixed(2)
      return { value: value, color: item.color, text: `${valueDisplay}%` };
    });
    setTotalAmountState((prevState) => ({
      ...prevState,
      ...(isIncomeState
        ? { income: totalAmount }
        : { expense: totalAmount })
    }))
    setPieData((prevPieData) => ({
      ...prevPieData,
      ...(isIncomeState
        ? { income: newPieData, subIncome: newSubPieData }
        : { expense: newPieData, subExpense: newSubPieData })
    }));
    handleDataLineChart({ isIncome: isIncomeState })
  }, [transactionsSection.array]);

  const handleChooseMonthYear = (dateTime: Date) => {
    const newFilter = isIncomeState ? filter.income : filter.expense
    const stringDate = convertDateFormatToString({ date: dateTime, format: newFilter === REPORT_BY.MONTH ? 'MM/YYYY' : 'YYYY' })
    setReportState((prevState) => ({
      ...prevState,
      ...(isIncomeState
        ? { dateIncome: dateTime, dateStringIncome: stringDate }
        : { dateExpense: dateTime, dateStringExpense: stringDate })
    }));
  }

  const handleChooseWeek = (date: { firstDay: Date; lastDay: Date; } | Date) => {
    const firstDay = 'firstDay' in date ? date.firstDay : date;
    const lastDay = 'lastDay' in date ? date.lastDay : date;
    const weekDayString = `Tuần ${getWeek(firstDay)}/${lastDay.getFullYear()}`
    setReportState((prevState) => ({
      ...prevState,
      ...(isIncomeState
        ? { fromDateIncome: firstDay, toDateIncome: lastDay, dateStringIncome: weekDayString }
        : { fromDateExpense: firstDay, toDateExpense: lastDay, dateStringExpense: weekDayString })
    }));
  }

  const optionScreen: MaterialTopTabNavigationOptions = {
    tabBarIndicatorStyle: {
      backgroundColor: '#0071BB',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      height: 3
    },
    tabBarLabelStyle: { fontWeight: 700 },
    tabBarStyle: { backgroundColor: '#111827' },
    tabBarActiveTintColor: '#0071BB',
    tabBarInactiveTintColor: 'white',
    tabBarPressColor: 'rgb(0, 113, 187)'
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

  const DotChart = ({ color, text }: { color: string, text: string }) => (
    <View className='flex flex-row items-center space-x-2'>
      <View style={{ backgroundColor: color }} className='w-3 h-3 rounded-full' />
      <Text className='text-white'>{text}</Text>
    </View>
  )

  function pieChartSection({ pieData, subPieData }: {
    pieData: { value: number, color: string, text: string }[],
    subPieData: { color: string, text: string }[]
  }) {
    return (
      pieData.length === 0 ? <EmptyList /> : (
        <View className='flex flex-row items-center pt-2 space-x-4'>
          <PieChartComponent pieData={pieData} />
          <View className='flex flex-col flex-1 space-y-2'>
            {subPieData.map((item, index) => (
              <DotChart key={index} color={item.color} text={item.text} />
            ))}
          </View>
        </View>
      )
    )
  }

  function lineChartSection({ lineData1, color1 }: {
    lineData1: { value: number, label: string }[], color1: string
  }) {
    return (
      lineData1.length < 2 ? <EmptyList /> : (
        <View className='pt-2'>
          <LineChartComponent
            lineData1={lineData1}
            color1={color1}
          />
        </View>
      )
    )
  }

  const renderContentReport = ({ isIncome }: { isIncome: boolean }) => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} className='bg-gray-900'>
        <View className='h-full px-2 py-4 space-y-4'>
          <View className='flex flex-row items-center justify-between px-2 space-x-4'>
            <View className='flex flex-col'>
              <Text className='text-xl font-bold text-white'>{isIncome ? 'Thu nhập 💵' : 'Chi tiêu 💸'}</Text>
              {(isIncome ? filter.income : filter.expense) === REPORT_BY.WEEK && (
                <Text className='text-sm text-white'>
                  {isIncome ? (
                    reportState.fromDateIncome.toLocaleDateString() + ' - ' + reportState.toDateIncome.toLocaleDateString()
                  ) : (
                    reportState.fromDateExpense.toLocaleDateString() + ' - ' + reportState.toDateExpense.toLocaleDateString()
                  )}
                </Text>
              )}
              <Text className='text-xl font-bold text-white'>{isIncome ? '+' : '-'}{formatMoney(isIncome ? totalAmountState.income : totalAmountState.expense)} VND</Text>
            </View>
            <View className='min-w-[140px]'>
              <CustomDropdown
                options={options}
                selectedId={isIncomeState ? filter.income : filter.expense}
                labelShowSpec={isIncome ? reportState.dateStringIncome : reportState.dateStringExpense}
                onSelect={(option) => {
                  option.id === REPORT_BY.WEEK ? setShowDatePicker(true) : setShowMonthYearPicker(true)
                  setFilter({
                    ...filter,
                    ...(isIncomeState ? { income: option.id } : { expense: option.id })
                  })
                }}
              />
            </View>
          </View>
          <View className='p-2 bg-gray-700 border border-gray-600 rounded-xl'>
            <Text className='text-base font-bold text-white'>Thống kê {isIncome ? 'thu nhập' : 'chi tiêu'} theo {
              (isIncome ? filter.income : filter.expense) === REPORT_BY.WEEK
                ? 'tuần'
                : ((isIncome ? filter.income : filter.expense) === REPORT_BY.MONTH ? 'tháng' : 'năm')
            }</Text>
            {lineChartSection({
              lineData1: isIncome ? lineData.income : lineData.expense,
              color1: isIncome ? '#FC00A8' : '#46BB1D',
            })}
          </View>
          <View className='p-2 bg-gray-700 border border-gray-600 rounded-xl'>
            <Text className='text-base font-bold text-white'>So sánh các loại {isIncome ? 'thu nhập' : 'chi tiêu'}</Text>
            {pieChartSection({
              pieData: isIncome ? pieData.income : pieData.expense,
              subPieData: isIncome ? pieData.subIncome : pieData.subExpense
            })}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView className='bg-gray-900'>
      <View className='h-full'>
        {navigationTabBar()}
        <CustomMonthYearPicker
          showPicker={showMonthYearPicker}
          mode={(isIncomeState ? filter.income : filter.expense) === REPORT_BY.MONTH ? "month" : "year"}
          onConfirm={handleChooseMonthYear}
          onClose={() => setShowMonthYearPicker(false)}
          initialDate={isIncomeState ? reportState.dateIncome : reportState.dateExpense}
        />
        <CustomDateTimePicker
          type='weekday'
          isShow={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onConfirm={handleChooseWeek}
        />
      </View>
    </SafeAreaView >
  )
}

export default ReportScreen
*/

import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { getRandomHexColor } from "../../../utils/StringUtils";
import CustomDropdown from "../../../components/CustomDropdown";
import { REPORT_BY, TRANSACTION_TYPE } from "../../../constants/Constant";
import { convertDateFormatToString } from "../../../utils/TimeUtil";
import CustomMonthYearPicker from "../../../components/CustomMonthYearPicker";
import CustomDateTimePicker from "../../../components/CustomDateTimePicker";
import { getWeek } from "date-fns";
import PieChartComponent from "../../../components/PieChartComponent";
import EmptyList from "../../../components/EmptyList";
import useArray from "../../../hooks/useArray";
import { TransactionCache } from "../../../storages/Storages";
import { groupDataByTime } from "../../../utils/DataUtils";
import { TransactionByMonth } from "../../../types/Transaction";
import { formatMoney } from "../../../utils/NumberUtils";

const ReportScreen = () => {

  const isInitialRender = React.useRef(true);
  const [filter, setFilter] = React.useState(TRANSACTION_TYPE.BOTH);
  const [filterTime, setFilterTime] = React.useState(REPORT_BY.MONTH);
  const [showMonthYearPicker, setShowMonthYearPicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [reportState, setReportState] = React.useState({
    fromDate: new Date(), toDate: new Date(), date: new Date(),
    dateString: convertDateFormatToString({ date: new Date(), format: 'MM/YYYY' }),
  });
  const [totalState, setTotalState] = React.useState({ income: 0, expense: 0 });
  const transactionData = TransactionCache.getInstance.getTransactionCache()
  const transactionsSection = useArray<TransactionByMonth>(
    groupDataByTime({ data: transactionData, month: new Date().getMonth(), year: new Date().getFullYear() })
  )

  const optionReportTypes = [
    { id: TRANSACTION_TYPE.BOTH, label: 'Tất cả' },
    { id: TRANSACTION_TYPE.INCOME, label: 'Thu nhập' },
    { id: TRANSACTION_TYPE.EXPENSE, label: 'Chi tiêu' },
  ];

  const optionTimes = [
    { id: REPORT_BY.WEEK, label: 'Lọc theo tuần' },
    { id: REPORT_BY.MONTH, label: 'Lọc theo tháng' },
    { id: REPORT_BY.YEAR, label: 'Lọc theo năm' },
  ];

  const [pieData, setPieData] = React.useState<{
    data: { value: number, color: string, text: string }[],
    subData: { color: string, text: string }[],
  }>({ data: [], subData: [] })

  const processTransactionData = React.useCallback((transactions: TransactionByMonth[]) => {
    const categoryMap = new Map()
    let totalAmount = 0
    let totalIncome = 0
    let totalExpense = 0
    transactions.forEach(section => {
      section.data
        .filter(item => {
          switch (filter) {
            case TRANSACTION_TYPE.INCOME:
              return item.transaction_type.is_income
            case TRANSACTION_TYPE.EXPENSE:
              return !item.transaction_type.is_income
            default:
              return true
          }
        })
        .forEach(item => {
          switch (filter) {
            case TRANSACTION_TYPE.INCOME:
              totalIncome += item.transaction_amount
              break
            case TRANSACTION_TYPE.EXPENSE:
              totalExpense += item.transaction_amount
              break
            default:
              totalAmount += item.transaction_amount
              break
          }
          const color = getRandomHexColor()
          const categoryId = item.transaction_type.category_id
          categoryMap.set(categoryId, {
            amount: (categoryMap.get(categoryId)?.amount ?? 0) + item.transaction_amount,
            color,
            name: item.transaction_type.category_name
          })
        })
    })
    return { categoryMap, totalAmount, totalIncome, totalExpense }
  }, [])

  React.useEffect(() => {
    const newSection = groupDataByTime({
      data: transactionData.filter((item) => {
        switch (filter) {
          case TRANSACTION_TYPE.INCOME:
            return item.transaction_type.is_income
          case TRANSACTION_TYPE.EXPENSE:
            return !item.transaction_type.is_income
          default:
            return true
        }
      }),
      ...(filterTime === REPORT_BY.WEEK ? {
        fromDate: reportState.fromDate, toDate: reportState.toDate,
      } : {
        ...(filterTime === REPORT_BY.YEAR ? {
          year: reportState.date.getFullYear(),
        } : {
          month: reportState.date.getMonth(),
          year: reportState.date.getFullYear(),
        })
      }),
    })
    transactionsSection.set(newSection)
  }, [reportState, filter]);

  React.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false; return; // Skip the first render
    }
    const { categoryMap, totalAmount, totalIncome, totalExpense } = processTransactionData(transactionsSection.array)
    let newSubPieData: { color: string, text: string }[] = [];
    const newPieData = Array.from(categoryMap).map(([_, item]) => {
      newSubPieData.push({ color: item.color, text: item.name });
      const value = (item.amount / totalAmount) * 100
      const valueDisplay = value % 1 === 0 ? value : value.toFixed(2)
      return { value: value, color: item.color, text: `${valueDisplay}%` };
    });
    switch (filter) {
      case TRANSACTION_TYPE.INCOME:
        setTotalState((prevState) => ({
          ...prevState,
          ...({ income: totalAmount })
        }))
        break;
      case TRANSACTION_TYPE.EXPENSE:
        setTotalState((prevState) => ({
          ...prevState,
          ...({ expense: totalAmount })
        }))
        break;
      default:
        setTotalState((prevState) => ({
          ...prevState,
          ...({ income: totalIncome, expense: totalExpense })
        }))
        break;
    }
    setPieData({ data: newPieData, subData: newSubPieData });
  }, [transactionsSection.array]);

  const handleChooseMonthYear = (dateTime: Date) => {
    const stringDate = convertDateFormatToString({ date: dateTime, format: filterTime === REPORT_BY.MONTH ? 'MM/YYYY' : 'YYYY' })
    setReportState((prevState) => ({
      ...prevState,
      ...({ date: dateTime, dateString: stringDate })
    }));
  }

  const handleChooseWeek = (date: { firstDay: Date; lastDay: Date; } | Date) => {
    const firstDay = 'firstDay' in date ? date.firstDay : date;
    const lastDay = 'lastDay' in date ? date.lastDay : date;
    const weekDayString = `Tuần ${getWeek(firstDay)}/${lastDay.getFullYear()}`
    setReportState((prevState) => ({
      ...prevState,
      ...({ fromDate: firstDay, toDate: lastDay, dateString: weekDayString })
    }));
  }

  function pieChartSection({ pieData, subPieData }: {
    pieData: { value: number, color: string, text: string }[],
    subPieData: { color: string, text: string }[]
  }) {
    return (
      pieData.length === 0 ? <EmptyList /> : (
        <View className='flex flex-row items-center pt-2 space-x-4'>
          <PieChartComponent pieData={pieData} />
          <View className='flex flex-col flex-1 space-y-2'>
            {subPieData.map((item) => (
              <View className='flex flex-row items-center space-x-2' key={item.text}>
                <View style={{ backgroundColor: item.color }} className='w-3 h-3 rounded-full' />
                <Text className='text-white'>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      )
    )
  }

  return (
    <SafeAreaView className="flex-1 px-4 pt-6 bg-gray-900">
      {/* Tiêu đề */}
      <Text className="pb-4 text-2xl font-bold text-center text-white">Thống kê tài chính</Text>
      <View className="flex-col pb-4 space-y-4">
        <View className="flex-row items-center justify-between">
          <View className='min-w-[140px]'>
            <CustomDropdown
              options={optionReportTypes}
              selectedId={filter}
              onSelect={(option) => {
                setFilter(option.id)
              }}
            />
          </View>
          <View className='min-w-[140px]'>
            <CustomDropdown
              options={optionTimes}
              selectedId={filterTime}
              labelShowSpec={reportState.dateString}
              onSelect={(option) => {
                option.id === REPORT_BY.WEEK ? setShowDatePicker(true) : setShowMonthYearPicker(true)
                setFilterTime(option.id)
              }}
            />
          </View>
        </View>

        {filterTime === REPORT_BY.WEEK && (
          <Text className='text-base text-white'>
            {reportState.fromDate.toLocaleDateString() + ' - ' + reportState.toDate.toLocaleDateString()}
          </Text>
        )}

        {filter === TRANSACTION_TYPE.BOTH ? (
          <View className="flex-row justify-between">
            <View>
              <Text className='w-full text-xl font-bold text-white'>Thu nhập 💰</Text>
              <Text className='w-full text-xl font-bold text-white'>{formatMoney(totalState.income)} VND</Text>
            </View>
            <View>
              <Text className='w-full text-xl font-bold text-right text-white'>Chi tiêu 💸</Text>
              <Text className='w-full text-xl font-bold text-right text-white'>{formatMoney(totalState.expense)} VND</Text>
            </View>
          </View>
        ) : (
          <View className="flex-col items-center align-middle">
            <Text className='text-xl font-bold text-white'>
              {filter === TRANSACTION_TYPE.INCOME ? 'Thu nhập 💰' : 'Chi tiêu 💸'}
            </Text>
            <Text className='text-xl font-bold text-center text-white'>
              {formatMoney(filter === TRANSACTION_TYPE.INCOME ? totalState.income : totalState.expense)} VND
            </Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-col mb-4 space-y-4">
          {/* Biểu đồ */}
          <View className="p-4 bg-gray-800 rounded-xl">
            <Text className="mb-4 text-lg font-semibold text-white">Thống kê theo {
              filterTime === REPORT_BY.WEEK
                ? "tuần"
                : (filterTime === REPORT_BY.MONTH ? "tháng" : "năm")
            }</Text>
            <View className="h-60">
              {/* Biểu đồ đường */}
            </View>
          </View>

          {/* So sánh các danh mục */}
          <View className="p-4 bg-gray-800 rounded-xl">
            <Text className="mb-4 text-lg font-semibold text-white">
              So sánh {filter === TRANSACTION_TYPE.INCOME
                ? "các nguồn thu nhập"
                : (filter === TRANSACTION_TYPE.EXPENSE ? "các loại chi tiêu" : "các loại tài chính")}
            </Text>
            <View className="h-60">
              {pieChartSection({
                pieData: pieData.data,
                subPieData: pieData.subData
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomMonthYearPicker
        showPicker={showMonthYearPicker}
        mode={filterTime === REPORT_BY.MONTH ? "month" : "year"}
        onConfirm={handleChooseMonthYear}
        onClose={() => setShowMonthYearPicker(false)}
        initialDate={reportState.date}
      />
      <CustomDateTimePicker
        type='weekday'
        isShow={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleChooseWeek}
      />
    </SafeAreaView>
  );
}

export default ReportScreen