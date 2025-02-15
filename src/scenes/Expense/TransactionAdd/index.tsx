import {
  View, Text, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, InputModeOptions,
  Image, TextStyle,
} from 'react-native'
import React from 'react'
import { convertDateFormatToString, getTodayDate } from '../../../utils/TimeUtil';
import { TransactionCategory, Transaction } from '../../../models/Transaction';
import { TransactionCache } from '../../../storages/Storages';
import { formatMoney, removeFormatMoney } from '../../../utils/NumberUtils';
import AppScreenEnum from '../../../navigation/enums/AppScreenEnum';
import ButtonComponent from '../../../components/Button';
import { showToast } from '../../../utils/ToastUtils';
import { CATEGORY_TYPE, TRANSACTION_SOURCE } from '../../../constants/Status';
import ArrowIcon from '../../../assets/svgIcons/ArrowIcon';
import { getTransactionSourceText } from '../../../utils/StringUtils';
import CustomDateTimePicker from '../../../components/CustomDateTimePicker';
import { convertImageAsArrayBuffer } from '../../../utils/ImageUtils';
import { ACTION_CONTENT, TEXT_STRING, MENU_TITLE, PLACEHOLDER_TITLE, TOAST_MESSAGE } from '../../../constants/String';
import ModalTransactionType from './modals/ModalTransactionType';
import ModalTransactionSource from './modals/ModalTransactionSource';
import ModalAddTransactionOther from './modals/ModalAddTransactionOther';
import { BASE64_IMAGES } from '../../../storages/Base64Images';

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

export function renderViewInputLabel({
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

const TransactionAddScreen = ({ navigation }: any) => {

  const [transactionType, setTransactionType] = React.useState(new TransactionCategory({ categoryId: 0 }));
  const [transactionSource, setTransactionSource] = React.useState(TRANSACTION_SOURCE.CASH);
  const [transactionAmount, setTransactionAmount] = React.useState(0);
  const [transactionTime, setTransactionTime] = React.useState(getTodayDate()); // For display input text
  const [transactionDate, setTransactionDate] = React.useState(new Date()); // For DateTimePicker selected value
  const [transactionNote, setTransactionNote] = React.useState('');
  const [isIncomeTemp, setIsIncomeTemp] = React.useState(false);

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [isShowModalType, setIsShowModalType] = React.useState(false);
  const [isShowModalSource, setIsShowModalSource] = React.useState(false);
  const [isShowModalOther, setIsShowModalOther] = React.useState(false);

  const handleChooseTime = (dateTime: Date) => {
    setTransactionDate(dateTime)
    setTransactionTime(convertDateFormatToString({ date: dateTime, format: 'DD/MM/YYYY' }))
    setShowDatePicker(false)
  }

  const handleSaveTransaction = () => {
    if (!checkValidate()) { return }
    const newTransactionType = transactionType
    newTransactionType.categorySource = convertImageAsArrayBuffer(transactionType.categorySource as string)
    const newTransaction = new Transaction({
      transactionType: newTransactionType,
      transactionAmount: transactionAmount,
      source: transactionSource,
      createdAt: transactionTime,
      transactionNote: transactionNote
    })
    showToast(transactionType.isIncome ? TOAST_MESSAGE.SUCCESS.ADD_TRANSACTION_INCOME : TOAST_MESSAGE.SUCCESS.ADD_TRANSACTION_EXPENSE);
    TransactionCache.getInstance.pushTransaction(newTransaction)
    handleClearData()
    navigation.navigate(AppScreenEnum.TRANSACTION_BOOK_NAVIGATOR)
  }

  function checkValidate(): boolean {
    if (transactionAmount == 0) {
      showToast(TOAST_MESSAGE.WARNING.MONEY);
      return false;
    }
    if (transactionType.categoryId == 0) {
      showToast(TOAST_MESSAGE.WARNING.CATEGORY);
      return false;
    }
    return true;
  }

  const handleClearData = () => {
    setTransactionType(new TransactionCategory({ categoryId: 0 }));
    setTransactionSource(TRANSACTION_SOURCE.CASH)
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
          <View className='flex px-4 py-6 space-y-6'>
            <Text className='text-2xl font-bold text-center text-white capitalize'>{MENU_TITLE.TRANSACTION_ADD}</Text>

            {renderViewInputLabel({
              contentLabel: TEXT_STRING.AMOUNT,
              onChangeText: (value) => setTransactionAmount(removeFormatMoney(value)),
              value: formatMoney(transactionAmount),
              inputMode: 'numeric',
              maxLength: 11
            })}

            {renderViewInputLabel({
              contentLabel: TEXT_STRING.CATEGORY,
              value: transactionType.categoryName,
              onPressButton: () => setIsShowModalType(true),
              icon: <ArrowIcon direction='down' color='white' />,
              placeholder: PLACEHOLDER_TITLE.CATEGORY
            })}

            {renderViewInputLabel({
              contentLabel: TEXT_STRING.TRANSACTION_DATE,
              value: transactionTime,
              onPressButton: () => setShowDatePicker(true),
              icon: <Image source={require('../../../assets/icons/calendars.png')} />
            })}

            {renderViewInputLabel({
              contentLabel: TEXT_STRING.MONEY_SOURCE,
              value: getTransactionSourceText(transactionSource),
              onPressButton: () => setIsShowModalSource(true),
              icon: <ArrowIcon direction='down' color='white' />
            })}

            {renderViewInputLabel({
              contentLabel: TEXT_STRING.NOTE,
              onChangeText: setTransactionNote,
              value: transactionNote,
              isRequired: false,
              style: { maxHeight: 100 },
              placeholder: PLACEHOLDER_TITLE.NOTE
            })}

            <View className='flex flex-row justify-center gap-x-4'>
              <ButtonComponent title={ACTION_CONTENT.CANCEL} classNameText='uppercase' className='bg-red-500' onPress={handleClearData} />
              <ButtonComponent title={ACTION_CONTENT.SAVE} classNameText='uppercase' className='bg-[#0071BB]' onPress={handleSaveTransaction} />
            </View>
          </View>
        </ScrollView>
      </View>

      <CustomDateTimePicker
        initialDate={transactionDate}
        isShow={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleChooseTime}
      />

      <ModalTransactionType
        modalVisible={isShowModalType}
        selectedTransactionCategory={transactionType}
        onAddPress={({ isIncome }) => {
          setIsIncomeTemp(isIncome)
          setIsShowModalOther(true)
        }}
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

      <ModalAddTransactionOther
        modalVisible={isShowModalOther}
        setModalVisible={(visible, categoryName) => {
          setIsShowModalOther(visible)
          if (!categoryName) { return; }
          setTransactionType(new TransactionCategory({
            categoryId: isIncomeTemp ? CATEGORY_TYPE.INCOME.ADD_OTHER : CATEGORY_TYPE.EXPENSE.ADD_OTHER,
            categoryName: categoryName,
            isIncome: isIncomeTemp,
            categorySource: BASE64_IMAGES.other
          }))
          setIsShowModalType(false)
        }}
      />

    </SafeAreaView>
  )
}

export default TransactionAddScreen