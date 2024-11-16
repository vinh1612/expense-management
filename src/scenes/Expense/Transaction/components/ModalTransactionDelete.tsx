import { Modal, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ButtonComponent from '../../../../components/ButtonComponent';

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
                        <Text className='p-2 text-xl text-center text-white'>Xóa giao dịch</Text>

                        <View className='pb-4'>
                            <Text className='text-center text-white'>
                                Mọi thông tin ghi chép về giao dịch này sẽ được xóa.
                            </Text>
                            <Text className='text-center text-white'>
                                Bạn có chắc chắn muốn xóa giao dịch này ?
                            </Text>
                        </View>
                        <View className='flex flex-row justify-center space-x-4'>
                            <ButtonComponent title='HỦY' className='bg-red-500' onPress={setModalVisible} />
                            <ButtonComponent title='XÁC NHẬN' className='bg-[#0071BB]' onPress={setConfirmDelete} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

export default ModalTransactionDelete