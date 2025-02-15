import { Modal, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MENU_TITLE } from '../../../../constants/String';

interface ModalTransactionOptionProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    actionChosen: (action: string) => void;
}

const ModalTransactionOption = ({ modalVisible, setModalVisible, actionChosen }: ModalTransactionOptionProps) => {

    return (
        <>
            <Modal
                animationType="fade"
                transparent
                visible={modalVisible}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={() => { setModalVisible(false) }}
                >
                    <View className='justify-center h-full px-8 bg-black/60'>
                        <View className='p-2 bg-gray-900 border border-gray-700 rounded-lg'>
                            <TouchableOpacity onPress={() => {
                                actionChosen('edit')
                            }}>
                                <Text className='p-2 text-xl text-white'>{MENU_TITLE.TRANSACTION_UPDATE}</Text>
                            </TouchableOpacity>
                            <View className='w-full bg-gray-700 h-[1px]' />
                            <TouchableOpacity onPress={() => {
                                actionChosen('delete')
                            }}>
                                <Text className='p-2 text-xl text-white'>{MENU_TITLE.TRANSACTION_DELETE}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    )
}

export default ModalTransactionOption