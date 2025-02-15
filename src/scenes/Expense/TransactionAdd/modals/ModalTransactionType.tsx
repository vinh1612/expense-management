import { View, Modal, SafeAreaView } from 'react-native'
import React from 'react'
import IncomeComponent from './components/IncomeComponent';
import ExpenditureComponent from './components/ExpenditureComponent';
import ButtonComponent from '../../../../components/Button';
import AppScreenEnum from '../../../../navigation/enums/AppScreenEnum';
import { TransactionCategory } from '../../../../models/Transaction';
import { showToast } from '../../../../utils/ToastUtils';
import TabView from '../../../../components/TabViewCustom';
import { ACTION_CONTENT, TEXT_STRING, TOAST_MESSAGE } from '../../../../constants/String';
import { CATEGORY_TYPE } from '../../../../constants/Status';
import { BASE64_IMAGES } from '../../../../storages/Base64Images';

interface ModalTransactionTypeProps {
    modalVisible: boolean;
    selectedTransactionCategory: TransactionCategory
    setModalVisible: (visible: boolean, itemSelected?: TransactionCategory) => void;
    onAddPress: ({ isIncome }: { isIncome: boolean }) => void;
}

const ModalTransactionType = ({ modalVisible, selectedTransactionCategory, setModalVisible, onAddPress }: ModalTransactionTypeProps) => {

    const [dataSelected, setDataSelected] = React.useState<TransactionCategory>(new TransactionCategory({ categoryId: 0 }))

    React.useEffect(() => {
        if (!modalVisible) { return }
        setDataSelected(selectedTransactionCategory)
    }, [modalVisible])

    const tabs = [
        {
            key: AppScreenEnum.EXPENDITURE_SCREEN,
            title: TEXT_STRING.EXPENSE,
            component: (
                <ExpenditureComponent
                    dataDefault={dataSelected}
                    onItemPress={setDataSelected}
                    onAddPress={() => onAddPress({ isIncome: false })}
                />
            )
        },
        {
            key: AppScreenEnum.INCOME_SCREEN,
            title: TEXT_STRING.INCOME,
            component: (
                <IncomeComponent
                    dataDefault={dataSelected}
                    onItemPress={setDataSelected}
                    onAddPress={() => onAddPress({ isIncome: true })}
                />
            )
        },
    ];

    return (
        <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
        >
            <View className='justify-center flex-1 p-4 bg-black/60'>
                <SafeAreaView>
                    <View className='flex h-full py-2 space-y-2 bg-gray-900 border border-gray-700 rounded-lg'>

                        <TabView tabs={tabs} initialIndex={dataSelected.isIncome ? 1 : 0} />

                        <View className='flex flex-row justify-center space-x-4'>
                            <ButtonComponent
                                title={ACTION_CONTENT.CANCEL}
                                className='bg-red-500'
                                classNameText='uppercase'
                                onPress={() => setModalVisible(false)}
                            />
                            <ButtonComponent
                                title={ACTION_CONTENT.CHOOSE}
                                classNameText="uppercase"
                                className='bg-[#0071BB]'
                                onPress={() => {
                                    if (dataSelected.categoryId === 0) {
                                        showToast(TOAST_MESSAGE.WARNING.CATEGORY)
                                    } else {
                                        setModalVisible(false, dataSelected)
                                    }
                                }}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    )
}
export default ModalTransactionType