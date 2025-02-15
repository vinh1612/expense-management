import {
  View, Text, SafeAreaView, Image,
  SectionList, FlatList, Pressable,
  ImageSourcePropType, TouchableOpacity
} from 'react-native'
import React from 'react'
import { formatDate } from '../../../utils/TimeUtil'
import { formatMoney } from '../../../utils/NumberUtils';
import useArray from '../../../hooks/useArray';
import { Transaction, TransactionByMonth } from '../../../models/Transaction';
import { TransactionCache } from '../../../storages/Storages';
import EmptyList from '../../../components/EmptyList';
import { useIsFocused } from '@react-navigation/native';
import CalendarComponent from '../../../components/Calendar';
import DoubleArrowIcon from '../../../assets/svgIcons/DoubleArrowIcon';
import ModalTransactionOption from './modals/ModalTransactionOption';
import { getTransactionSourceText } from '../../../utils/StringUtils';
import ModalTransactionUpdate from './modals/ModalTransactionUpdate';
import ModalTransactionDelete from './modals/ModalTransactionDelete';
import { showToast } from '../../../utils/ToastUtils';
import { groupDataByTime } from '../../../utils/DataUtils';
import { getImageAsBase64 } from '../../../utils/ImageUtils';
import { TEXT_STRING, TOAST_MESSAGE } from '../../../constants/String';
import Svg, { Path } from 'react-native-svg';
import TransactionArrow from '../../../assets/svgIcons/TransactionArrow';
import { TRANSACTION_SOURCE } from '../../../constants/Status';

const TransactionScreen = () => {

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = React.useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = React.useState(false);
  const [isRotated, setIsRotated] = React.useState(true);
  const [itemSelected, setItemSelected] = React.useState<Transaction>(new Transaction());
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const isFocused = useIsFocused();

  const transactions = useArray<Transaction>(TransactionCache.getInstance.getTransactionCache())
  const transactionsSection = useArray<TransactionByMonth>(
    groupDataByTime({ data: TransactionCache.getInstance.getTransactionCache(), month: currentMonth, year: currentYear })
  )

  const getDataTransaction = () => {
    transactions.set(TransactionCache.getInstance.getTransactionCache())
    transactionsSection.set(
      groupDataByTime({ data: TransactionCache.getInstance.getTransactionCache(), month: currentMonth, year: currentYear })
    )
  }

  React.useEffect(() => {
    if (isFocused && TransactionCache.getInstance.getTransactionCache().length !== transactions.array.length) {
      getDataTransaction()
    }
  }, [isFocused])

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setCurrentMonth(newMonth)
    setCurrentYear(newYear);
    transactionsSection.set(groupDataByTime({ data: transactions.array, month: newMonth, year: newYear }));
  };

  const handDeleteTransaction = (transactionId: number) => {
    showToast(TOAST_MESSAGE.SUCCESS.DELETE_TRANSACTION)
    TransactionCache.getInstance.removeTransactionWith(transactionId)
    getDataTransaction()
    setItemSelected(new Transaction({ transactionId: 0 }))
  }

  const handUpdateTransaction = (newTransaction: Transaction) => {
    showToast(TOAST_MESSAGE.SUCCESS.UPDATE_TRANSACTION)
    TransactionCache.getInstance.updateTransactionWith(newTransaction)
    getDataTransaction()
    setItemSelected(new Transaction({ transactionId: 0 }))
  }

  return (
    <SafeAreaView className='bg-gray-900'>
      <FlatList
        data={[]}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        className='h-full'
        ListHeaderComponent={
          <View className='h-full px-2 pt-2 space-y-6'>
            <View
              className={`p-2 ${isRotated ? 'pb-4' : 'pb-0'} bg-gray-700 border border-gray-600 rounded-xl`}
            >
              <CalendarComponent
                data={transactionsSection.array}
                onMonthChange={handleMonthChange}
                isExpanded={isRotated}
              />

              <Pressable
                className='absolute bottom-[-16px] self-center bg-gray-700 px-8 pt-2 pb-1 rounded-full'
                onPress={() => setIsRotated(!isRotated)}
              >
                <DoubleArrowIcon direction={isRotated ? 'up' : 'down'} color='gray' size={18} />
              </Pressable>
            </View>

            <SectionList
              sections={transactionsSection.array}
              contentContainerStyle={{ flexGrow: 1 }}
              scrollEnabled={false}
              ListEmptyComponent={<EmptyList message={TEXT_STRING.NO_TRANSACTION} />}
              keyExtractor={(item) => item.transactionId.toString()}
              renderItem={({ item }) => {
                const isIncome = item.transactionType.isIncome ? '+' : '-'
                const colorText = item.source === TRANSACTION_SOURCE.CASH
                  ? 'text-green-500'
                  : item.source === TRANSACTION_SOURCE.BANK
                    ? 'text-[#0071BB]'
                    : 'text-[#A50064]'
                return (
                  <TouchableOpacity
                    className='flex flex-row items-center justify-between pb-3 space-x-2'
                    onLongPress={() => {
                      setItemSelected(item)
                      setModalVisible(true)
                    }}
                  >
                    <Image
                      source={
                        item.transactionType.categorySource instanceof Object
                          ? { uri: `data:image/png;base64,${getImageAsBase64(Object.values(item.transactionType.categorySource) as any)}` }
                          : (
                            typeof item.transactionType.categorySource === 'string'
                              ? { uri: `data:image/png;base64,${item.transactionType.categorySource}` }
                              : (item.transactionType.categorySource as ImageSourcePropType)
                          )
                      }
                      className='flex-none w-12 h-12 bg-white rounded-full'
                    />
                    <View className='flex flex-row items-center justify-between flex-1 space-x-4'>
                      <View className='flex-1'>
                        <Text className='text-white'>{item.transactionType.categoryName}</Text>
                        <Text className='text-white'>{item.transactionNote}</Text>
                      </View>
                      <View className='flex-row items-center flex-none'>
                        <View className='items-end'>
                          <Text className={`text-white ${colorText} font-bold`}>
                            {isIncome + formatMoney(item.transactionAmount)} {TEXT_STRING.UNIT_SHOT}
                          </Text>
                          <Text className={`text-white ${colorText}`}>{getTransactionSourceText(item.source)}</Text>
                        </View>
                        <TransactionArrow type={item.transactionType.isIncome ? 'income' : 'expense'} />
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }}
              renderSectionHeader={({ section: { dateTime } }) => {
                const { formattedDate, dayOfWeek } = formatDate(dateTime)
                return (
                  <View
                    className='flex flex-row justify-between p-2 my-2 bg-gray-700 border border-gray-600 rounded-md'
                  >
                    <Text className='text-white'>{formattedDate}</Text>
                    <Text className='text-white'>{dayOfWeek}</Text>
                  </View>
                )
              }}
            />
          </View>
        }
      />

      <ModalTransactionOption
        modalVisible={modalVisible}
        setModalVisible={(visible) => {
          setModalVisible(visible)
          setItemSelected(new Transaction({ transactionId: 0 }))
        }}
        actionChosen={(action) => {
          setModalVisible(false)
          if (action === 'delete') {
            setModalDeleteVisible(true)
          } else {
            setModalUpdateVisible(true)
          }
        }}
      />

      <ModalTransactionUpdate
        modalVisible={modalUpdateVisible}
        itemSelected={itemSelected}
        setModalVisible={(visible) => {
          setModalUpdateVisible(visible)
          setItemSelected(new Transaction({ transactionId: 0 }))
        }}
        setConfirmUpdate={(newValue) => {
          setModalUpdateVisible(false)
          handUpdateTransaction(newValue)
        }}
      />

      <ModalTransactionDelete
        modalVisible={modalDeleteVisible}
        setModalVisible={() => {
          setModalDeleteVisible(false)
          setItemSelected(new Transaction({ transactionId: 0 }))
        }}
        setConfirmDelete={() => {
          setModalDeleteVisible(false)
          handDeleteTransaction(itemSelected.transactionId)
        }}
      />
    </SafeAreaView>
  )
}
export default TransactionScreen