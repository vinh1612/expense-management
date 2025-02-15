import { View, Modal, TouchableOpacity, FlatList, Text, Image } from "react-native";
import ButtonComponent from "../../../../components/Button";
import React from "react";
import { TRANSACTION_SOURCE } from "../../../../constants/Status";
import MoMoIcon from "../../../../assets/svgIcons/MoMoIcon";
import { BASE64_IMAGES } from "../../../../storages/Base64Images";
import { ACTION_CONTENT, PAYMENT_METHOD, PLACEHOLDER_TITLE } from "../../../../constants/String";

interface ModalTransactionSourceProps {
    sourceDefault: number
    modalVisible: boolean;
    setModalVisible: (visible: boolean, source?: number) => void;
}
const ModalTransactionSource = ({ sourceDefault, modalVisible, setModalVisible }: ModalTransactionSourceProps) => {

    const [idSelected, setIdSelected] = React.useState<number>()

    React.useEffect(() => {
        if (modalVisible) {
            setIdSelected(sourceDefault)
        }
    }, [modalVisible])

    const transactionSource = [
        { id: TRANSACTION_SOURCE.CASH, image: <Image className="w-[60] h-[60]" source={{ uri: `data:image/png;base64,${BASE64_IMAGES.salary}` }} />, title: PAYMENT_METHOD.CASH },
        { id: TRANSACTION_SOURCE.BANK, image: <Image className="w-[60] h-[60]" source={{ uri: `data:image/png;base64,${BASE64_IMAGES.logo_atm}` }} />, title: PAYMENT_METHOD.BANK },
        { id: TRANSACTION_SOURCE.MOMO, image: <MoMoIcon size={60} />, title: PAYMENT_METHOD.MOMO },
    ]

    return (
        <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
        >
            <View className='justify-center h-full px-4 bg-black/60'>
                <View className='bg-gray-900 border border-gray-700 rounded-lg'>
                    <Text className='py-2 text-xl font-bold text-center text-white'>{PLACEHOLDER_TITLE.MONEY_SOURCE}</Text>
                    <View className="px-2 py-8 bg-gray-800">
                        <FlatList
                            data={transactionSource}
                            showsVerticalScrollIndicator={false}
                            numColumns={3}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        className='w-1/3 h-32 p-1'
                                        onPress={() => {
                                            setIdSelected(item.id)
                                        }}
                                        key={item.id}
                                    >
                                        <View className={`p-1 space-y-2 items-center justify-center w-full h-full rounded-xl ${idSelected === item.id ? 'border-2 border-pink-300 bg-pink-100' : 'bg-gray-900'}`} >
                                            {item.image}
                                            <Text className={`text-center ${idSelected === item.id ? 'text-pink-500' : 'text-white'}`}>{item.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
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
                            title={ACTION_CONTENT.CHOOSE}
                            classNameText="uppercase"
                            className="bg-[#0071BB]"
                            onPress={() => setModalVisible(false, idSelected)}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default ModalTransactionSource;