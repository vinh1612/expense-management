import { Keyboard, Modal, SafeAreaView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import ButtonComponent from '../../../../components/Button';
import { ACTION_CONTENT, MENU_TITLE, PLACEHOLDER_TITLE, TEXT_STRING, TOAST_MESSAGE } from '../../../../constants/String';
import { showToast } from '../../../../utils/ToastUtils';

interface ModalAddTransactionOtherProps {
    modalVisible: boolean
    setModalVisible: (visible: boolean, categoryName?: string) => void;
}

const ModalAddTransactionOther = ({ modalVisible, setModalVisible }: ModalAddTransactionOtherProps) => {

    const [value, setValue] = React.useState('')

    React.useEffect(() => {
        if (!modalVisible) { return }
        setValue('')
    }, [modalVisible])

    return (
        <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View className='justify-center flex-1 p-4 bg-black/60'>
                    <SafeAreaView>
                        <View className='flex py-2 space-y-2 bg-gray-900 border border-gray-700 rounded-lg'>
                            <Text className='text-xl font-bold text-center text-white'>{MENU_TITLE.CATEGORY_OTHER}</Text>

                            <View className='p-3 bg-gray-700 border border-gray-600'>
                                <Text className='text-white'>
                                    {TEXT_STRING.CATEGORY} <Text className='text-red-600'>*</Text>
                                </Text>
                                <TextInput
                                    className='pt-1 pb-0 text-white'
                                    onChangeText={setValue}
                                    value={value}
                                    inputMode='text'
                                    enablesReturnKeyAutomatically
                                    placeholder={PLACEHOLDER_TITLE.CATEGORY_ENTER}
                                />
                            </View>
                            <View className='flex flex-row justify-center py-2 gap-x-4'>
                                <ButtonComponent
                                    title={ACTION_CONTENT.CANCEL}
                                    className='bg-red-500'
                                    classNameText='uppercase'
                                    onPress={() => setModalVisible(false)}
                                />
                                <ButtonComponent
                                    title={ACTION_CONTENT.CONFIRM}
                                    classNameText="uppercase"
                                    className="bg-[#0071BB]"
                                    onPress={() => {
                                        if (value.trim() === '') { showToast(TOAST_MESSAGE.WARNING.CATEGORY_NAME); return }
                                        setModalVisible(false, value)
                                    }}
                                />
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default ModalAddTransactionOther