import { Modal, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ButtonComponent from '../../../../components/Button';
import { ACTION_CONTENT, MENU_TITLE, TOAST_MESSAGE } from '../../../../constants/String';

interface ModalTransactionDeleteProps {
    modalVisible: boolean;
    setModalVisible: () => void;
    setConfirmDelete: () => void;
}

const ModalTransactionDelete = ({ modalVisible, setModalVisible, setConfirmDelete }: ModalTransactionDeleteProps) => {
    return (
        <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPressOut={setModalVisible}
            >
                <View className='justify-center h-full px-4 bg-black/60'>
                    <View className='p-2 bg-gray-900 border border-gray-700 rounded-lg'>
                        <Text className='p-2 text-xl text-center text-white'>{MENU_TITLE.TRANSACTION_DELETE}</Text>

                        <View className='pb-4'>
                            <Text className='text-center text-white'>
                                {TOAST_MESSAGE.WARNING.DELETE_TRANSACTION_1}
                            </Text>
                            <Text className='text-center text-white'>
                                {TOAST_MESSAGE.WARNING.DELETE_TRANSACTION_2}
                            </Text>
                        </View>
                        <View className='flex flex-row justify-center space-x-4'>
                            <ButtonComponent title={ACTION_CONTENT.CANCEL} className='uppercase bg-red-500' onPress={setModalVisible} />
                            <ButtonComponent title={ACTION_CONTENT.CONFIRM} className='bg-[#0071BB] uppercase' onPress={setConfirmDelete} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

export default ModalTransactionDelete