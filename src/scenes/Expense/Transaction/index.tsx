import {
  View, Text, SafeAreaView, Image,
  SectionList, FlatList, Pressable,
  ImageSourcePropType, TouchableOpacity
} from 'react-native'
import React from 'react'
import { formatDate } from '../../../utils/TimeUtil'
import { formatMoney } from '../../../utils/NumberUtils';
import useArray from '../../../hooks/useArray';
import { Transaction, TransactionByMonth } from '../../../types/Transaction';
import { TransactionCache } from '../../../storages/Storages';
import EmptyList from '../../../components/EmptyList';
import { useIsFocused } from '@react-navigation/native';
import CalendarComponent from '../../../components/CalendarComponent';
import DoubleArrowIcon from '../../../assets/svgIcons/DoubleArrowIcon';
import ModalTransactionOption from './components/ModalTransactionOption';
import { getTransactionSourceText } from '../../../utils/StringUtils';
import ModalTransactionUpdate from './components/ModalTransactionUpdate';
import ModalTransactionDelete from './components/ModalTransactionDelete';
import { showToast } from '../../../utils/ToastUtils';
import { groupDataByTime } from '../../../utils/DataUtils';

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

  const handDeleteTransaction = (transaction_id: number) => {
    showToast('Xóa giao dịch thành công')
    TransactionCache.getInstance.removeTransactionWith(transaction_id)
    getDataTransaction()
    setItemSelected(new Transaction({ transaction_id: 0 }))
  }

  const handUpdateTransaction = (newTransaction: Transaction) => {
    showToast('Chỉnh sửa giao dịch thành công')
    TransactionCache.getInstance.updateTransactionWith(newTransaction)
    getDataTransaction()
    setItemSelected(new Transaction({ transaction_id: 0 }))
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
              ListEmptyComponent={<EmptyList message='Chưa có dữ liệu giao dịch' />}
              keyExtractor={(item) => item.transaction_id.toString()}
              renderItem={({ item }) => {
                const isIncome = item.transaction_type.is_income ? '+' : '-'
                const colorMoney = item.transaction_type.is_income ? 'text-green-600' : 'text-red-600'
                return (
                  <TouchableOpacity
                    className='flex flex-row items-center justify-between pb-3 space-x-2'
                    onLongPress={() => {
                      setItemSelected(item)
                      setModalVisible(true)
                    }}
                  >
                    <Image
                      source={typeof item.transaction_type.category_source === 'string'
                        ? { uri: item.transaction_type.category_source }
                        : item.transaction_type.category_source as ImageSourcePropType
                      }
                      className='flex-none w-12 h-12 bg-white rounded-full'
                    />
                    <View className='flex flex-row items-center justify-between flex-1 space-x-4'>
                      <View className='flex-1'>
                        <Text className='text-white'>{item.transaction_type.category_name}</Text>
                        <Text className='text-white'>{item.transaction_note}</Text>
                      </View>
                      <View className='items-end flex-none'>
                        <Text className={`text-white ${colorMoney} font-bold`}>{isIncome + formatMoney(item.transaction_amount)} đ</Text>
                        <Text className='text-white'>{getTransactionSourceText(item.source)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }}
              renderSectionHeader={({ section: { date_time } }) => {
                const { formattedDate, dayOfWeek } = formatDate(date_time)
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
          setItemSelected(new Transaction({ transaction_id: 0 }))
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
          setItemSelected(new Transaction({ transaction_id: 0 }))
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
          setItemSelected(new Transaction({ transaction_id: 0 }))
        }}
        setConfirmDelete={() => {
          setModalDeleteVisible(false)
          handDeleteTransaction(itemSelected.transaction_id)
        }}
      />
    </SafeAreaView>
  )
}
export default TransactionScreen