import {
  View, Text, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, InputModeOptions,
  Image, TextStyle
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
import ModalTransactionSource from './components/ModalTransactionSource';
import { TRANSACTION_SOURCE } from '../../../constants/Constant';
import ArrowIcon from '../../../assets/svgIcons/ArrowIcon';

const TransactionAddScreen = ({ navigation }: any) => {

  const [transactionType, setTransactionType] = React.useState(new TransactionCategory({ category_id: 0 }));
  const [transactionSource, setTransactionSource] = React.useState(TRANSACTION_SOURCE.CASH);
  const [transactionAmount, setTransactionAmount] = React.useState(0);
  const [transactionTime, setTransactionTime] = React.useState(getTodayDate()); // For display input text
  const [transactionDate, setTransactionDate] = React.useState(new Date()); // For DateTimePicker selected value
  const [transactionNote, setTransactionNote] = React.useState('');

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [isShowModalType, setIsShowModalType] = React.useState(false);
  const [isShowModalSource, setIsShowModalSource] = React.useState(false);

  interface ViewInputLabel {
    contentLabel: string;
    onChangeText?: (text: string) => void;
    onPressButton?: () => void;
    value: string;
    inputMode?: InputModeOptions;
    maxLength?: number;
    style?: TextStyle;
    isRequired?: boolean;
    icon?: React.ReactNode
    readonly?: boolean;
    placeholder?: string;
  }

  function renderViewInputLabel({
    contentLabel,
    value,
    inputMode,
    maxLength,
    style,
    isRequired = true,
    placeholder,
    icon,
    readonly,
    onPressButton,
    onChangeText
  }: ViewInputLabel) {
    return (
      icon ? (
        <TouchableOpacity
          className='p-3 bg-gray-700 border border-gray-600 rounded-lg'
          onPress={onPressButton}
        >
          <Text className='text-white'>{contentLabel}{isRequired && <Text className='text-red-600'> *</Text>}</Text>
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
              placeholder={placeholder}
            />
            {icon}
          </View>
        </TouchableOpacity>
      ) : (
        <View className='p-3 bg-gray-700 border border-gray-600 rounded-lg'>
          <Text className='text-white'>{contentLabel}{isRequired && <Text className='text-red-600'> *</Text>}</Text>
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
            placeholder={placeholder}
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
      transaction_type: transactionType,
      transaction_amount: transactionAmount,
      source: transactionSource,
      created_at: transactionTime,
      transaction_note: transactionNote
    })
    showToast(`Thêm mới giao dịch ${transactionType.is_income ? 'thu' : 'chi'} thành công!`);
    TransactionCache.getInstance.pushTransaction(newTransaction)
    handleClearData()
    navigation.navigate(AppScreenEnum.TRANSACTION_BOOK_NAVIGATOR)
  }

  function checkValidate(): boolean {
    if (transactionAmount == 0) {
      showToast('Vui lòng nhập số tiền giao dịch');
      return false;
    }
    if (transactionType.category_id == 0) {
      showToast('Vui lòng chọn danh mục để phân loại');
      return false;
    }
    return true;
  }

  const handleClearData = () => {
    setTransactionType(new TransactionCategory({ category_id: 0 }));
    setTransactionSource(TRANSACTION_SOURCE.CASH)
    setTransactionAmount(0)
    setTransactionTime(getTodayDate)
    setTransactionDate(new Date())
    setTransactionNote('')
    navigation.navigate(AppScreenEnum.TRANSACTION_BOOK_NAVIGATOR)
  }

  const getTransactionSourceText = (transactionSource: number) => {
    switch (transactionSource) {
      case TRANSACTION_SOURCE.CASH:
        return 'Tiền Mặt'
      case TRANSACTION_SOURCE.BANK:
        return 'Tài Khoản Ngân Hàng'
      default:
        return 'Ví MoMo'
    }
  }

  return (
    <SafeAreaView className='bg-gray-900'>
      <View className='h-full'>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className='flex px-4 py-10 gap-y-7'>
            <Text className='text-xl font-bold text-center text-white'>Ghi chép giao dịch</Text>

            {renderViewInputLabel({
              contentLabel: 'Số tiền',
              onChangeText: (value) => setTransactionAmount(removeFormatMoney(value)),
              value: formatMoney(transactionAmount),
              inputMode: 'numeric',
              maxLength: 11
            })}

            {renderViewInputLabel({
              contentLabel: 'Danh mục',
              value: transactionType.category_name,
              onPressButton: () => setIsShowModalType(true),
              icon: <ArrowIcon direction='down' color='white' />,
              placeholder: 'Chọn danh mục'
            })}

            {renderViewInputLabel({
              contentLabel: 'Ngày giao dịch',
              value: transactionTime,
              onPressButton: () => setShowDatePicker(true),
              icon: <Image source={require('../../../assets/icons/calendars.png')} />
            })}

            {renderViewInputLabel({
              contentLabel: 'Nguồn tiền',
              value: getTransactionSourceText(transactionSource),
              onPressButton: () => setIsShowModalSource(true),
              icon: <ArrowIcon direction='down' color='white' />
            })}

            {renderViewInputLabel({
              contentLabel: 'Ghi chú',
              onChangeText: setTransactionNote,
              value: transactionNote,
              isRequired: false,
              style: { maxHeight: 100 },
              placeholder: 'Nhập mô tả giao dịch'
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
        modalVisible={isShowModalType}
        setModalVisible={(visible, itemSelected) => {
          setIsShowModalType(visible)
          if (itemSelected) {
            setTransactionType(itemSelected)
          }
        }}
      />

      <ModalTransactionSource
        sourceDefault={transactionSource}
        modalVisible={isShowModalSource}
        setModalVisible={(visible, sourceSelected) => {
          setIsShowModalSource(visible)
          if (sourceSelected !== undefined) {
            setTransactionSource(sourceSelected)
          }
        }}
      />

    </SafeAreaView>
  )
}

export default TransactionAddScreen