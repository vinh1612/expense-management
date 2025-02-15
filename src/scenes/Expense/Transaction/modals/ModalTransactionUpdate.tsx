import { Image, Modal, ScrollView, Text, View } from 'react-native'
import React from 'react'
import { Transaction } from '../../../../models';
import { renderViewInputLabel } from '../../TransactionAdd';
import { formatMoney, removeFormatMoney } from '../../../../utils/NumberUtils';
import ArrowIcon from '../../../../assets/svgIcons/ArrowIcon';
import { getTransactionSourceText } from '../../../../utils/StringUtils';
import ButtonComponent from '../../../../components/Button';
import { TransactionCategory } from '../../../../models/Transaction';
import ModalTransactionType from '../../TransactionAdd/modals/ModalTransactionType';
import ModalTransactionSource from '../../TransactionAdd/modals/ModalTransactionSource';
import { convertDateFormatToString, getTodayDate } from '../../../../utils/TimeUtil';
import { showToast } from '../../../../utils/ToastUtils';
import CustomDateTimePicker from '../../../../components/CustomDateTimePicker';
import { ACTION_CONTENT, TEXT_STRING, PLACEHOLDER_TITLE, TOAST_MESSAGE, MODULE_TITLE, MENU_TITLE } from '../../../../constants/String';
import ModalAddTransactionOther from '../../TransactionAdd/modals/ModalAddTransactionOther';
import { CATEGORY_TYPE } from '../../../../constants/Status';
import { BASE64_IMAGES } from '../../../../storages/Base64Images';

interface ModalTransactionUpdateProps {
    modalVisible: boolean;
    itemSelected: Transaction;
    setModalVisible: (visible: boolean) => void;
    setConfirmUpdate: (transaction: Transaction) => void;
}

const ModalTransactionUpdate = ({ modalVisible, itemSelected, setModalVisible, setConfirmUpdate }: ModalTransactionUpdateProps) => {

    const [isShowModalUpdate, setIsShowModalUpdate] = React.useState(false);
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [isShowModalType, setIsShowModalType] = React.useState(false);
    const [isShowModalSource, setIsShowModalSource] = React.useState(false);
    const [isShowModalOther, setIsShowModalOther] = React.useState(false);
    const [isIncomeTemp, setIsIncomeTemp] = React.useState(false);

    const [transactionTime, setTransactionTime] = React.useState(getTodayDate());
    const [transactionDate, setTransactionDate] = React.useState(new Date());
    const [transactionNote, setTransactionNote] = React.useState('');
    const [transactionAmount, setTransactionAmount] = React.useState(0);
    const [transactionSource, setTransactionSource] = React.useState(0);
    const [transactionType, setTransactionType] = React.useState(new TransactionCategory({ categoryId: 0 }));

    React.useEffect(() => {
        setIsShowModalUpdate(modalVisible)
        if (!modalVisible) { return }
        setTransactionAmount(itemSelected.transactionAmount)
        setTransactionType(itemSelected.transactionType)
        setTransactionTime(itemSelected.createdAt)
        setTransactionSource(itemSelected.source)
        setTransactionNote(itemSelected.transactionNote)
        setIsIncomeTemp(itemSelected.transactionType.isIncome)
        const [day, month, year] = itemSelected.createdAt.split('/').map(Number);
        const parsedDate = new Date(year, month - 1, day);
        setTransactionDate(parsedDate)
    }, [modalVisible])

    const handleChooseTime = (dateTime: Date) => {
        setTransactionDate(dateTime)
        setTransactionTime(convertDateFormatToString({ date: dateTime, format: 'DD/MM/YYYY' }))
        setShowDatePicker(false)
    }

    const handleCloseModal = () => {
        setIsShowModalUpdate(false)
        setModalVisible(false)
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

    const handleUpdateTransaction = () => {
        if (!checkValidate()) { return }
        setConfirmUpdate({
            ...itemSelected,
            transactionAmount: transactionAmount,
            transactionType: transactionType,
            createdAt: transactionTime,
            source: transactionSource,
            transactionNote: transactionNote
        })
    }

    return (
        <>
            <Modal
                animationType="fade"
                transparent
                visible={isShowModalUpdate}
            >
                <View className='justify-center h-full px-4 bg-black/60'>
                    <View className='p-2 bg-gray-900 border border-gray-700 rounded-lg'>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className='flex p-4 space-y-7'>
                                <Text className='text-xl font-bold text-center text-white'>{MENU_TITLE.TRANSACTION_UPDATE}</Text>

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
                                    icon: <Image source={require('../../../../assets/icons/calendars.png')} />
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

                                <View className='flex flex-row justify-center space-x-4'>
                                    <ButtonComponent title={ACTION_CONTENT.CANCEL} classNameText='uppercase' className='bg-red-500' onPress={handleCloseModal} />
                                    <ButtonComponent title={ACTION_CONTENT.UPDATE} classNameText='uppercase' className='bg-[#0071BB]' onPress={handleUpdateTransaction} />
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <CustomDateTimePicker
                isShow={showDatePicker}
                initialDate={transactionDate}
                onClose={() => setShowDatePicker(false)}
                onConfirm={handleChooseTime}
            />

            <ModalTransactionType
                modalVisible={isShowModalType}
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
                selectedTransactionCategory={transactionType}
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
        </>
    )
}

export default ModalTransactionUpdate