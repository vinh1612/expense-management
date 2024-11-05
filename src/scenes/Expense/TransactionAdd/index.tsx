import {
  View, Text, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, InputModeOptions,
  Image, TextStyle, ImageRequireSource
} from 'react-native'
import React from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getTodayDate } from '../../../utils/TimeUtil';
import { TransactionCategory, Transaction } from '../../../types/Transaction';
import { TransactionCache } from '../../../storages/Storages';
import { formatMoney, removeFormatMoney } from '../../../utils/NumberUtils';
import dayjs from 'dayjs';
import AppScreenEnum from '../../../navigation/enums/AppScreenEnum';
import ModalTransactionType from './components/ModalTransactionType';
import ButtonComponent from '../../../components/ButtonComponent';
import { showToast } from '../../../utils/ToastUtils';

const TransactionAddScreen = ({ navigation, route }: any) => {

  const [transactionType, setTransactionType] = React.useState(new TransactionCategory());
  const [transactionName, setTransactionName] = React.useState('');
  const [transactionAmount, setTransactionAmount] = React.useState(0);
  const [transactionTime, setTransactionTime] = React.useState(getTodayDate()); // For display input text
  const [transactionDate, setTransactionDate] = React.useState(new Date()); // For DateTimePicker selected value
  const [transactionNote, setTransactionNote] = React.useState('');

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  interface ViewInputLabel {
    contentLabel: string;
    onChangeText?: (text: string) => void;
    onPressButton?: () => void;
    value: string;
    inputMode?: InputModeOptions;
    maxLength?: number;
    style?: TextStyle;
    isRequired?: boolean;
    icon?: ImageRequireSource
    readonly?: boolean;
  }

  function renderViewInputLabel({
    contentLabel, onChangeText, value,
    inputMode, maxLength, style,
    isRequired = true, icon,
    readonly, onPressButton
  }: ViewInputLabel) {
    return (
      icon ? (
        <TouchableOpacity
          className='p-3 bg-gray-700 border border-gray-600 rounded-lg'
          onPress={onPressButton}
        >
          <Text className='text-white'>{contentLabel} {isRequired && <Text className='text-red-600'> *</Text>}</Text>
          <View className='flex flex-row items-center justify-between'>
            <TextInput
              className='pt-1 pb-0 text-white'
              multiline
              numberOfLines={1}
              onChangeText={onChangeText}
              value={value}
              inputMode={inputMode}
              maxLength={maxLength}
              style={style}
              readOnly
            />
            <Image source={icon} />
          </View>
        </TouchableOpacity>
      ) : (
        <View className='p-3 bg-gray-700 border border-gray-600 rounded-lg'>
          <Text className='text-white'>{contentLabel} {isRequired && <Text className='text-red-600'> *</Text>}</Text>
          <TextInput
            className='pt-1 pb-0 text-white'
            multiline
            numberOfLines={1}
            onChangeText={onChangeText}
            value={value}
            inputMode={inputMode}
            maxLength={maxLength}
            style={style}
            readOnly={readonly}
          />
        </View>
      )
    )
  }

  const handleChooseTime = (dateTime: Date) => {
    setTransactionDate(dateTime)
    setTransactionTime(dayjs(dateTime).format('DD/MM/YYYY'))
    setShowDatePicker(false)
  }

  const handleSaveTransaction = () => {
    if (!checkValidate()) { return }
    const newTransaction = new Transaction({
      transaction_name: transactionName,
      transaction_type: transactionType,
      transaction_amount: transactionAmount,
      source: 'Ví của tôi',
      created_at: transactionTime,
      transaction_note: transactionNote
    })
    TransactionCache.getInstance.pushTransaction(newTransaction)
    handleClearData()
    navigation.navigate(AppScreenEnum.TRANSACTION_BOOK_NAVIGATOR)
  }

  function checkValidate(): boolean {
    if (transactionType.category_id == 0) {
      showToast('Vui lòng chọn nhóm phân loại');
      return false;
    }
    if (transactionName.length == 0) {
      showToast('Vui lòng nhập tên giao dịch');
      return false;
    }
    if (transactionAmount == 0) {
      showToast('Vui lòng nhập số tiền giao dịch');
      return false;
    }
    return true;
  }

  const handleClearData = () => {
    setTransactionType(new TransactionCategory())
    setTransactionName('')
    setTransactionAmount(0)
    setTransactionTime(getTodayDate)
    setTransactionDate(new Date())
    setTransactionNote('')
    navigation.navigate(AppScreenEnum.TRANSACTION_BOOK_NAVIGATOR)
  }

  return (
    <SafeAreaView className='bg-gray-900'>
      <View className='h-full'>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className='flex px-4 py-10 gap-y-7'>
            <Text className='text-xl font-bold text-center text-white'>Giao dịch mới</Text>

            {renderViewInputLabel({
              contentLabel: 'Nhóm phân loại',
              value: transactionType.category_name,
              onPressButton: () => setModalVisible(true),
              icon: require('../../../assets/icons/arrow-down-white.png')
            })}

            {renderViewInputLabel({
              contentLabel: 'Tên giao dịch',
              onChangeText: setTransactionName,
              value: transactionName
            })}

            {renderViewInputLabel({
              contentLabel: 'Số tiền giao dịch',
              onChangeText: (value) => setTransactionAmount(removeFormatMoney(value)),
              value: formatMoney(transactionAmount),
              inputMode: 'numeric',
              maxLength: 11
            })}

            {renderViewInputLabel({
              contentLabel: 'Thời gian',
              value: transactionTime,
              isRequired: false,
              onPressButton: () => setShowDatePicker(true),
              icon: require('../../../assets/icons/calendars.png')
            })}

            {renderViewInputLabel({
              contentLabel: 'Ghi chú',
              onChangeText: setTransactionNote,
              value: transactionNote,
              isRequired: false,
              style: { maxHeight: 100 }
            })}

            <View className='flex flex-row justify-center gap-x-4'>
              <ButtonComponent title='HỦY' className='bg-red-500' onPress={handleClearData} />
              <ButtonComponent title='LƯU' style={{ backgroundColor: '#0071BB' }} onPress={handleSaveTransaction} />
            </View>
          </View>
        </ScrollView>
      </View>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleChooseTime}
        onCancel={() => setShowDatePicker(false)}
        date={transactionDate}
      />

      <ModalTransactionType
        modalVisible={modalVisible}
        setModalVisible={(visible, itemSelected) => {
          setModalVisible(visible)
          if (itemSelected) {
            setTransactionType(itemSelected)
          }
        }}
      />

    </SafeAreaView>
  )
}

export default TransactionAddScreen