import React from "react"
import { Modal, ScrollView, Text, View } from "react-native"
import ButtonComponent from "../../../../components/Button";
import { ACTION_CONTENT, MENU_TITLE } from "../../../../constants/String";
import TransactionListSection from "../components/TransactionListSection";
import { Transaction, TransactionByMonth } from "../../../../models";
import { TransactionCache } from "../../../../storages/Storages";
import { groupDataByTime } from "../../../../utils/DataUtils";

interface Props {
    isShowModalDetail: boolean;
    dataTime: { day: number, month: number, year: number }
    setIsShowModalDetail: (visible: boolean) => void;
    onLongPressTransaction: (item: Transaction) => void;
}

const ModalTransactionDetail = ({
    isShowModalDetail, dataTime,
    setIsShowModalDetail, onLongPressTransaction
}: Props) => {

    const [transactionsSection, setTransactionsSection] = React.useState<TransactionByMonth[]>([])

    React.useEffect(() => {
        if (!isShowModalDetail) { return }
        const groupedData = groupDataByTime({
            data: TransactionCache.getInstance.getTransactionCache(),
            day: dataTime.day,
            month: dataTime.month,
            year: dataTime.year
        });
        setTransactionsSection(groupedData);
    }, [isShowModalDetail, dataTime])

    const handleCloseModal = () => {
        setIsShowModalDetail(false)
    }

    return (
        <Modal
            animationType="fade"
            transparent
            visible={isShowModalDetail}
        >
            <View className='justify-center h-full px-4 bg-black/60'>
                <View className='p-2 bg-gray-900 border border-gray-700 rounded-lg'>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className='flex p-4 space-y-7'>
                            <Text className='text-xl font-bold text-center text-white'>{MENU_TITLE.TRANSACTION_DETAIL}</Text>
                            <View>
                                <TransactionListSection
                                    dataSections={transactionsSection}
                                    onLongPress={onLongPressTransaction}
                                />
                            </View>
                            <View className='flex flex-row justify-end space-x-4'>
                                <ButtonComponent title={ACTION_CONTENT.CLOSE} classNameText='uppercase' className='bg-red-500' onPress={handleCloseModal} />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

export default ModalTransactionDetail