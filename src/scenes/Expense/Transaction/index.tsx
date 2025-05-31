import {
  View, SafeAreaView, FlatList,
  Pressable, Animated, Easing,
  Text
} from 'react-native'
import React from 'react'
import useArray from '../../../hooks/useArray';
import { Transaction, TransactionByMonth } from '../../../models/Transaction';
import { TransactionCache } from '../../../storages/Storages';
import { useIsFocused } from '@react-navigation/native';
import CalendarComponent from '../../../components/Calendar';
import DoubleArrowIcon from '../../../assets/svgIcons/DoubleArrowIcon';
import ModalTransactionOption from './modals/ModalTransactionOption';
import ModalTransactionUpdate from './modals/ModalTransactionUpdate';
import ModalTransactionDelete from './modals/ModalTransactionDelete';
import { showToast } from '../../../utils/ToastUtils';
import { groupDataByTime } from '../../../utils/DataUtils';
import { TOAST_MESSAGE } from '../../../constants/String';
import ModalTransactionDetail from './modals/ModalTransactionDetail';
import TransactionListSection from './components/TransactionListSection';

const TransactionScreen = () => {

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = React.useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = React.useState(false);
  const [modalDetailVisible, setModalDetailVisible] = React.useState(false);

  const [dataTimeLongPress, setDataTimeLongPress] = React.useState({
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  })

  const [isRotated, setIsRotated] = React.useState(true);
  const [itemSelected, setItemSelected] = React.useState<Transaction>(new Transaction());
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const isFocused = useIsFocused();

  const rotateAnim = React.useRef(new Animated.Value(isRotated ? 1 : 0)).current;

  const transactions = useArray<Transaction>(TransactionCache.getInstance.getTransactionCache())
  const transactionsSection = useArray<TransactionByMonth>(
    groupDataByTime({ data: TransactionCache.getInstance.getTransactionCache(), month: currentMonth, year: currentYear })
  )

  const getDataTransaction = React.useCallback(() => {
    transactions.set(TransactionCache.getInstance.getTransactionCache())
    transactionsSection.set(
      groupDataByTime({ data: TransactionCache.getInstance.getTransactionCache(), month: currentMonth, year: currentYear })
    )
  }, [currentMonth, currentYear, transactions, transactionsSection])

  React.useEffect(() => {
    if (isFocused && TransactionCache.getInstance.getTransactionCache().length !== transactions.array.length) {
      getDataTransaction()
    }
  }, [isFocused, transactions.array.length, getDataTransaction])

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isRotated ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true
    }).start();
  }, [isRotated, rotateAnim]);

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
    setModalDetailVisible(false)
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
                onMonthChoose={handleMonthChange}
                onLongPress={(day: number, month: number, year: number) => {
                  setDataTimeLongPress({ day, month, year });
                  setModalDetailVisible(true)
                }}
                isExpanded={isRotated}
              />

              <Pressable
                className='absolute bottom-[-16px] self-center bg-gray-700 px-8 pt-2 pb-1 rounded-full'
                onPress={() => setIsRotated(!isRotated)}
              >
                <Animated.View
                  style={{
                    transform: [{
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg']
                      })
                    }]
                  }}
                >
                  <DoubleArrowIcon direction="down" color='gray' size={18} />
                </Animated.View>
              </Pressable>
            </View>

            <View>
              <TransactionListSection
                dataSections={transactionsSection.array}
                onLongPress={(item: Transaction) => {
                  setItemSelected(item)
                  setModalVisible(true)
                }}
              />
            </View>

          </View>
        }
      />

      <ModalTransactionDetail
        isShowModalDetail={modalDetailVisible}
        dataTime={dataTimeLongPress}
        setIsShowModalDetail={setModalDetailVisible}
        onLongPressTransaction={(transaction: Transaction) => {
          setItemSelected(transaction)
          setModalVisible(true)
        }}
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