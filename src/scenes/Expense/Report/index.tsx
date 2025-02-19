import React from "react";
import { View, Text, SafeAreaView, ScrollView, RefreshControl, FlatList } from "react-native";
import { capitalizeWords, getRandomHexColor } from "../../../utils/StringUtils";
import CustomDropdown from "../../../components/CustomDropdown";
import { REPORT_BY, TRANSACTION_TYPE } from "../../../constants/Status";
import { convertDateFormatToString, parseDateString } from "../../../utils/TimeUtil";
import CustomMonthYearPicker from "../../../components/CustomMonthYearPicker";
import CustomDateTimePicker from "../../../components/CustomDateTimePicker";
import { getWeek } from "date-fns";
import PieChartComponent from "../../../components/PieChart";
import EmptyList from "../../../components/EmptyList";
import useArray from "../../../hooks/useArray";
import { TransactionCache } from "../../../storages/Storages";
import { getDaysInMonth, groupDataByTime } from "../../../utils/DataUtils";
import { Transaction, TransactionByMonth } from "../../../models/Transaction";
import { formatMoney, formatMoneyWithUnitShort } from "../../../utils/NumberUtils";
import BarChartComponent from "../../../components/BarChart";
import { barDataItem, lineDataItem } from "react-native-gifted-charts";
import { TEXT_STRING, MENU_TITLE, REPORT_STRING_BY_TIMES } from "../../../constants/String";
import LineChartComponent from "../../../components/LineChart";

const ReportScreen = () => {

  const isInitialRender = React.useRef(true);
  const [filter, setFilter] = React.useState(TRANSACTION_TYPE.BOTH);
  const [filterTime, setFilterTime] = React.useState(REPORT_BY.MONTH);
  const [filterTimeTemp, setFilterTimeTemp] = React.useState(REPORT_BY.MONTH);
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
    { id: TRANSACTION_TYPE.BOTH, label: TEXT_STRING.ALL },
    { id: TRANSACTION_TYPE.INCOME, label: TEXT_STRING.INCOME },
    { id: TRANSACTION_TYPE.EXPENSE, label: TEXT_STRING.EXPENSE },
  ];

  const optionTimes = [
    { id: REPORT_BY.WEEK, label: REPORT_STRING_BY_TIMES.WEEK },
    { id: REPORT_BY.MONTH, label: REPORT_STRING_BY_TIMES.MONTH },
    { id: REPORT_BY.YEAR, label: REPORT_STRING_BY_TIMES.YEAR },
  ];

  const [lineData, setLineData] = React.useState<{
    income: lineDataItem[], expense: lineDataItem[]
  }>({ income: [], expense: [] })
  const [barData, setBarData] = React.useState<barDataItem[]>([])
  const [pieData, setPieData] = React.useState<{
    data: { value: number, color: string, text: string }[],
    subData: { color: string, text: string }[],
  }>({ data: [], subData: [] })
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const isValidTransaction = (item: Transaction, day: number) => {
    const transDate = parseDateString(item.createdAt);
    switch (filterTime) {
      case REPORT_BY.MONTH:
        return transDate.getDate() === day && transDate.getMonth() === reportState.date.getMonth();
      case REPORT_BY.YEAR:
        return transDate.getMonth() + 1 === day;
      case REPORT_BY.WEEK:
        return transDate.getDate() === day &&
          [reportState.fromDate.getMonth(), reportState.toDate.getMonth()].includes(transDate.getMonth());
      default:
        return false;
    }
  };

  const getDateRange = () => {
    switch (filterTime) {
      case REPORT_BY.MONTH:
        return Array.from({ length: getDaysInMonth(reportState.date.getMonth(), reportState.date.getFullYear()) }, (_, i) => i + 1);
      case REPORT_BY.YEAR:
        return Array.from({ length: 12 }, (_, i) => i + 1);
      case REPORT_BY.WEEK:
        const fromDate = reportState.fromDate.getDate();
        return Array.from({ length: 7 }, (_, i) => fromDate + i);
      default:
        return [];
    }
  };

  const processTransactionData = (transactions: TransactionByMonth[]) => {
    const categoryMap = new Map()
    const totals = { amount: 0, income: 0, expense: 0 }
    getDateRange().forEach(day => {
      transactions.forEach(section => {
        section.data.filter(item => {
          if (filter === TRANSACTION_TYPE.INCOME) return item.transactionType.isIncome
          if (filter === TRANSACTION_TYPE.EXPENSE) return !item.transactionType.isIncome
          return true
        }).forEach(item => {
          if (!isValidTransaction(item, day)) { return }
          const amount = item.transactionAmount
          const isIncome = item.transactionType.isIncome
          totals.amount += amount
          if (isIncome) totals.income += amount
          else totals.expense += amount
          const categoryId = item.transactionType.categoryId
          categoryMap.set(categoryId, {
            amount: (categoryMap.get(categoryId)?.amount ?? 0) + amount,

            color: getRandomHexColor(),
            name: item.transactionType.categoryName
          })
        })
      })
    })
    return { categoryMap, totalAmount: totals.amount, totalIncome: totals.income, totalExpense: totals.expense }
  }

  const handleLineChart = ({ data }: { data: TransactionByMonth[] }) => {
    const result = { income: [], expense: [] } as { income: lineDataItem[], expense: lineDataItem[] };

    const getLabel = (index: number) =>
      filterTime === REPORT_BY.YEAR
        ? `${capitalizeWords(TEXT_STRING.MONTH_SHORT)}${index}`
        : `${index.toString().padStart(2, "0")}/${(reportState.date.getMonth() + 1).toString().padStart(2, "0")}`;

    getDateRange().forEach(day => {
      const totals = data.reduce((acc, section) => {
        section.data.forEach(item => {
          if (!isValidTransaction(item, day)) return;
          const key = item.transactionType.isIncome ? 'income' : 'expense';
          acc[key] += item.transactionAmount;
        });
        return acc;
      }, { income: 0, expense: 0 });

      const createDataPoint = (value: number) => ({
        label: getLabel(day),
        value,
        ...(value > 0 ? { dataPointText: formatMoneyWithUnitShort(value) } : { hideDataPoint: true })
      });

      if (filter === TRANSACTION_TYPE.INCOME) {
        result.income.push(createDataPoint(totals.income));
      } else if (filter === TRANSACTION_TYPE.EXPENSE) {
        result.expense.push(createDataPoint(totals.expense));
      } else {
        result.income.push(createDataPoint(totals.income));
        result.expense.push(createDataPoint(totals.expense));
      }
    });

    return result;
  };

  const handleBarChart = ({ data, color1, color2 }: { data: TransactionByMonth[], color1: string, color2: string }): barDataItem[] => {
    const result: barDataItem[] = [];
    const getLabel = (index: number) => {
      return filterTime === REPORT_BY.YEAR ? `${capitalizeWords(TEXT_STRING.MONTH)} ${index}` : `${capitalizeWords(TEXT_STRING.DAY)} ${index}`;
    };
    getDateRange().forEach(day => {
      const totals = { income: 0, expense: 0 }
      data.forEach(section => {
        section.data.forEach(item => {
          if (!isValidTransaction(item, day)) { return; }
          if (item.transactionType.isIncome) {
            totals.income += item.transactionAmount;
          } else {
            totals.expense += item.transactionAmount;
          }
        });
      });
      const baseProps = {
        label: getLabel(day),
        spacing: filter === TRANSACTION_TYPE.BOTH ? 2 : 30,
        labelWidth: filter === TRANSACTION_TYPE.BOTH ? 60 : undefined
      };
      if (filter === TRANSACTION_TYPE.INCOME) {
        result.push({ ...baseProps, value: totals.income, frontColor: color1 });
      } else if (filter === TRANSACTION_TYPE.EXPENSE) {
        result.push({ ...baseProps, value: totals.expense, frontColor: color2 });
      } else {
        result.push({ ...baseProps, value: totals.income, frontColor: color1 });
        result.push({ value: totals.expense, frontColor: color2 });
      }
    });
    return result;
  };

  React.useEffect(() => {
    if (refreshing) { return }
    const filteredData = transactionData.filter(item => {
      if (filter === TRANSACTION_TYPE.INCOME) return item.transactionType.isIncome
      if (filter === TRANSACTION_TYPE.EXPENSE) return !item.transactionType.isIncome
      return true
    })
    const timeParams = filterTime === REPORT_BY.WEEK
      ? { fromDate: reportState.fromDate, toDate: reportState.toDate }
      : filterTime === REPORT_BY.YEAR
        ? { year: reportState.date.getFullYear() }
        : { month: reportState.date.getMonth(), year: reportState.date.getFullYear() }
    const newSection = groupDataByTime({ data: filteredData, ...timeParams })
    transactionsSection.set(newSection)
  }, [reportState.dateString, filter, filterTime, refreshing])

  React.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    const { categoryMap, totalAmount, totalIncome, totalExpense } = processTransactionData(transactionsSection.array);
    const barData = handleBarChart({ data: transactionsSection.array, color1: '#FC00A8', color2: '#46BB1D' });
    const lineData = handleLineChart({ data: transactionsSection.array });
    const newPieData = Array.from(categoryMap).map(([_, item]) => ({
      value: (item.amount / totalAmount) * 100,
      color: item.color,
      text: `${((item.amount / totalAmount) * 100) % 1 === 0 ? (item.amount / totalAmount) * 100 : ((item.amount / totalAmount) * 100).toFixed(2)}%`,
    }));
    const newSubPieData = Array.from(categoryMap).map(([_, item]) => ({
      color: item.color,
      text: item.name
    }));
    const newTotalState = {
      ...totalState,
      ...(
        filter === TRANSACTION_TYPE.INCOME
          ? { income: totalAmount }
          : filter === TRANSACTION_TYPE.EXPENSE
            ? { expense: totalAmount }
            : { income: totalIncome, expense: totalExpense }
      )
    };
    setTotalState(newTotalState);
    setPieData({ data: newPieData, subData: newSubPieData });
    setBarData(barData);
    setLineData({ income: lineData.income, expense: lineData.expense });
  }, [transactionsSection.array]);

  const handleChooseMonthYear = (dateTime: Date) => {
    const stringDate = convertDateFormatToString({ date: dateTime, format: filterTimeTemp === REPORT_BY.MONTH ? 'MM/YYYY' : 'YYYY' })
    setReportState((prevState) => ({
      ...prevState,
      ...({ date: dateTime, dateString: stringDate })
    }));
    setFilterTime(filterTimeTemp)
  }

  const handleChooseWeek = (date: { dateSelect: Date; firstDay: Date; lastDay: Date; }) => {
    const weekDayString = `Tuần ${getWeek(date.firstDay)}/${date.lastDay.getFullYear()}`
    setReportState((prevState) => ({
      ...prevState,
      ...({
        date: date.dateSelect,
        fromDate: date.firstDay,
        toDate: date.lastDay,
        dateString: weekDayString
      })
    }));
    setFilterTime(filterTimeTemp)
  }

  function lineChartSection({ income, expense }: { income: lineDataItem[], expense: lineDataItem[] }) {
    const valueIncome = income.reduce((total, currentValue) => total + (currentValue.value ?? 0), 0)
    const valueExpense = expense.reduce((total, currentValue) => total + (currentValue.value ?? 0), 0)
    const isEmptyData = filter === TRANSACTION_TYPE.INCOME
      ? valueIncome === 0
      : (filter === TRANSACTION_TYPE.EXPENSE ? valueExpense === 0 : (valueIncome === 0 && valueExpense === 0))
    return (
      isEmptyData ? <EmptyList /> : (
        <>
          <LineChartComponent
            lineData={income}
            lineData2={expense}
            color1="#FC00A8"
            color2="#46BB1D"
          />
          {filter === TRANSACTION_TYPE.BOTH && (
            <View className="flex-row justify-center pt-2 space-x-4">
              <View className="flex-row items-center space-x-2">
                <View className="w-3 h-3 bg-[#FC00A8] rounded-full" />
                <Text className="text-white">{TEXT_STRING.INCOME}</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <View className="w-3 h-3 bg-[#46BB1D] rounded-full" />
                <Text className="text-white">{TEXT_STRING.EXPENSE}</Text>
              </View>
            </View>
          )}
        </>
      )
    )
  }

  function barChartSection({ data }: { data: barDataItem[] }) {
    const isEmptyData = data.reduce((total, currentValue) => total + (currentValue.value ?? 0), 0) === 0
    return (
      isEmptyData ? <EmptyList /> : (
        <>
          <BarChartComponent barData={data} />
          {filter === TRANSACTION_TYPE.BOTH && (
            <View className="flex-row justify-center pt-2 space-x-4">
              <View className="flex-row items-center space-x-2">
                <View className="w-3 h-3 bg-[#FC00A8] rounded-full" />
                <Text className="text-white">{TEXT_STRING.INCOME}</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <View className="w-3 h-3 bg-[#46BB1D] rounded-full" />
                <Text className="text-white">{TEXT_STRING.EXPENSE}</Text>
              </View>
            </View>
          )}
        </>
      )
    )
  }

  function pieChartSection({ pieData, subPieData }: {
    pieData: { value: number, color: string, text: string }[],
    subPieData: { color: string, text: string }[]
  }) {
    return (
      pieData.length === 0 ? <EmptyList /> : (
        <View className='flex flex-col items-center'>
          <PieChartComponent pieData={pieData} />
          <View className="w-full">
            <FlatList
              data={subPieData}
              keyExtractor={item => item.text}
              numColumns={3}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className='flex flex-row items-center justify-center flex-1 space-x-2' key={item.text}>
                  <View style={{ backgroundColor: item.color }} className='w-3 h-3 border rounded-full' />
                  <Text className='text-white'>{item.text}</Text>
                </View>
              )}
            />
          </View>
        </View>
      )
    )
  }

  return (
    <SafeAreaView className="flex-1 px-4 pt-6 space-y-4 bg-gray-900">
      {/* Tiêu đề */}
      <View>
        <Text className="text-2xl font-bold text-center text-white capitalize">{MENU_TITLE.FINANCE_REPORT}</Text>
        {filterTime === REPORT_BY.WEEK && (
          <Text className='text-base text-center text-white'>
            {reportState.fromDate.toLocaleDateString() + ' - ' + reportState.toDate.toLocaleDateString()}
          </Text>
        )}
      </View>
      <View className="flex-col space-y-4">
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
                setFilterTimeTemp(option.id)
              }}
            />
          </View>
        </View>

        {filter === TRANSACTION_TYPE.BOTH ? (
          <View className="flex-row justify-between">
            <View>
              <Text className='w-full text-xl font-bold text-white'>{TEXT_STRING.INCOME} 💰</Text>
              <Text className='w-full text-xl font-bold text-white'>{formatMoney(totalState.income)} {TEXT_STRING.UNIT}</Text>
            </View>
            <View>
              <Text className='w-full text-xl font-bold text-right text-white'>{TEXT_STRING.EXPENSE} 💸</Text>
              <Text className='w-full text-xl font-bold text-right text-white'>{formatMoney(totalState.expense)} {TEXT_STRING.UNIT}</Text>
            </View>
          </View>
        ) : (
          <View className="flex-col items-center">
            <Text className='w-full text-xl font-bold text-center text-white'>
              {filter === TRANSACTION_TYPE.INCOME ? `${TEXT_STRING.INCOME} 💰` : `${TEXT_STRING.EXPENSE} 💸`}
            </Text>
            <Text className='text-xl font-bold text-center text-white'>
              {formatMoney(filter === TRANSACTION_TYPE.INCOME ? totalState.income : totalState.expense)} {TEXT_STRING.UNIT}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex flex-col mb-4 space-y-4">
          {/* Xu hường thu chi */}
          <View className="p-4 bg-gray-800 rounded-xl">
            <Text className="mb-4 text-lg font-semibold text-white capitalize">
              {filter === TRANSACTION_TYPE.INCOME
                ? TEXT_STRING.INCOME_TREND_BY
                : (filter === TRANSACTION_TYPE.EXPENSE ? TEXT_STRING.EXPENSE_TREND_BY : TEXT_STRING.FINANCIAL_TREND_BY)
              } {
                filterTime === REPORT_BY.WEEK
                  ? TEXT_STRING.WEEK
                  : (filterTime === REPORT_BY.MONTH ? TEXT_STRING.MONTH : TEXT_STRING.YEAR)}
            </Text>
            {lineChartSection({ income: lineData.income, expense: lineData.expense })}
          </View>
          {/* Thống kê thu chi */}
          <View className="p-4 capitalize bg-gray-800 rounded-xl">
            <Text className="mb-4 text-lg font-semibold text-white capitalize">
              {filter === TRANSACTION_TYPE.INCOME
                ? TEXT_STRING.INCOME_STATISTICAL_BY
                : (filter === TRANSACTION_TYPE.EXPENSE ? TEXT_STRING.EXPENSE_STATISTICAL_BY : TEXT_STRING.FINANCIAL_OVERVIEW_BY)
              } {
                filterTime === REPORT_BY.WEEK
                  ? TEXT_STRING.WEEK
                  : (filterTime === REPORT_BY.MONTH ? TEXT_STRING.MONTH : TEXT_STRING.YEAR)}
            </Text>
            {barChartSection({ data: barData })}
          </View>
          {/* Phân bổ tài chính */}
          <View className="p-4 capitalize bg-gray-800 rounded-xl">
            <Text className="text-lg font-semibold text-white capitalize">
              {filter === TRANSACTION_TYPE.INCOME
                ? TEXT_STRING.INCOME_ALLOCATION
                : (filter === TRANSACTION_TYPE.EXPENSE ? TEXT_STRING.EXPENSE_ALLOCATION : TEXT_STRING.FINANCIAL_ALLOCATION_BY)
              } {
                filterTime === REPORT_BY.WEEK
                  ? TEXT_STRING.WEEK
                  : (filterTime === REPORT_BY.MONTH ? TEXT_STRING.MONTH : TEXT_STRING.YEAR)
              }
            </Text>
            {pieChartSection({
              pieData: pieData.data,
              subPieData: pieData.subData
            })}
          </View>
        </View>
      </ScrollView>
      <CustomMonthYearPicker
        showPicker={showMonthYearPicker}
        mode={filterTimeTemp === REPORT_BY.MONTH ? "month" : "year"}
        onConfirm={handleChooseMonthYear}
        onClose={() => setShowMonthYearPicker(false)}
        initialDate={reportState.date}
      />
      <CustomDateTimePicker
        type='weekday'
        initialDate={reportState.date}
        isShow={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleChooseWeek}
      />
    </SafeAreaView>
  );
}

export default ReportScreen