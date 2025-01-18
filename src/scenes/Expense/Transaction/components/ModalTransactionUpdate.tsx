import { Image, Modal, ScrollView, Text, View } from 'react-native'
import React from 'react'
import { Transaction } from '../../../../types';
import { renderViewInputLabel } from '../../TransactionAdd';
import { formatMoney, removeFormatMoney } from '../../../../utils/NumberUtils';
import ArrowIcon from '../../../../assets/svgIcons/ArrowIcon';
import { getTransactionSourceText } from '../../../../utils/StringUtils';
import ButtonComponent from '../../../../components/ButtonComponent';
import { TransactionCategory } from '../../../../types/Transaction';
import ModalTransactionType from '../../TransactionAdd/components/ModalTransactionType';
import ModalTransactionSource from '../../TransactionAdd/components/ModalTransactionSource';
import { convertDateFormatToString, getTodayDate } from '../../../../utils/TimeUtil';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { showToast } from '../../../../utils/ToastUtils';

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
    const [transactionTime, setTransactionTime] = React.useState(getTodayDate());
    const [transactionDate, setTransactionDate] = React.useState(new Date());
    const [transactionNote, setTransactionNote] = React.useState('');
    const [transactionAmount, setTransactionAmount] = React.useState(0);
    const [transactionSource, setTransactionSource] = React.useState(0);
    const [transactionType, setTransactionType] = React.useState(new TransactionCategory({ category_id: 0 }));

    React.useEffect(() => {
        setIsShowModalUpdate(modalVisible)
        if (!modalVisible) { return }
        setTransactionAmount(itemSelected.transaction_amount)
        setTransactionType(itemSelected.transaction_type)
        setTransactionTime(itemSelected.created_at)
        setTransactionSource(itemSelected.source)
        setTransactionNote(itemSelected.transaction_note)
        const [day, month, year] = itemSelected.created_at.split('/').map(Number);
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
            showToast('Vui lòng nhập số tiền giao dịch');
            return false;
        }
        if (transactionType.category_id == 0) {
            showToast('Vui lòng chọn danh mục để phân loại');
            return false;
        }
        return true;
    }

    const handleUpdateTransaction = () => {
        if (!checkValidate()) { return }
        setConfirmUpdate({
            ...itemSelected,
            transaction_amount: transactionAmount,
            transaction_type: transactionType,
            created_at: transactionTime,
            source: transactionSource,
            transaction_note: transactionNote
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
                                <Text className='text-xl font-bold text-center text-white'>Chỉnh sửa giao dịch</Text>

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
                                    icon: <Image source={require('../../../../assets/icons/calendars.png')} />
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

                                <View className='flex flex-row justify-center space-x-4'>
                                    <ButtonComponent title='HỦY' className='bg-red-500' onPress={handleCloseModal} />
                                    <ButtonComponent title='CẬP NHẬT' className='bg-[#0071BB]' onPress={handleUpdateTransaction} />
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

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
        </>
    )
}

export default ModalTransactionUpdate