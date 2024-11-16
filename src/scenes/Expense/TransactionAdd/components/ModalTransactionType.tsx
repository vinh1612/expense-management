import { View, Modal } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import IncomeComponent from './IncomeComponent';
import ExpenditureComponent from './ExpenditureComponent';
import ButtonComponent from '../../../../components/ButtonComponent';
import AppScreenEnum from '../../../../navigation/enums/AppScreenEnum';
import { TransactionCategory } from '../../../../types/Transaction';

const Tab = createMaterialTopTabNavigator();

interface ModalTransactionTypeProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean, itemSelected?: TransactionCategory) => void;
    selectedTransactionCategory?: TransactionCategory
}

const ModalTransactionType = ({ modalVisible, setModalVisible, selectedTransactionCategory }: ModalTransactionTypeProps) => {

    const [dataSelected, setDataSelected] = React.useState<TransactionCategory>(new TransactionCategory())

    React.useEffect(() => {
        if (selectedTransactionCategory) {
            setDataSelected(selectedTransactionCategory)
        }
    }, [selectedTransactionCategory])
    return (
        <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
        >
            <View className='justify-center p-4 bg-black/60'>
                <View className='flex h-full py-2 pt-0 bg-gray-900 border border-gray-700 rounded-lg gap-y-2'>
                    <Tab.Navigator
                        screenOptions={{
                            tabBarIndicatorStyle: {
                                backgroundColor: '#0071BB',
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                height: 3
                            },
                            tabBarLabelStyle: {
                                fontWeight: 700
                            },
                            tabBarStyle: {
                                backgroundColor: '#111827'

                            },
                            tabBarActiveTintColor: '#0071BB',
                            tabBarInactiveTintColor: 'white',
                            tabBarPressColor: 'rgba(0, 113, 187, .1)'
                        }}
                        initialRouteName={dataSelected.is_income ? AppScreenEnum.INCOME_SCREEN : AppScreenEnum.EXPENDITURE_SCREEN}
                    >
                        <Tab.Screen
                            options={{ tabBarLabel: 'Chi tiêu' }}
                            name={AppScreenEnum.EXPENDITURE_SCREEN}
                            children={() => <ExpenditureComponent dataDefault={dataSelected} onItemPress={setDataSelected} />}
                        />
                        <Tab.Screen
                            options={{ tabBarLabel: 'Thu nhập' }}
                            name={AppScreenEnum.INCOME_SCREEN}
                            children={() => <IncomeComponent dataDefault={dataSelected} onItemPress={setDataSelected} />}
                        />
                    </Tab.Navigator>

                    <View className='flex flex-row justify-center gap-x-4'>
                        <ButtonComponent title='HỦY' className='bg-red-500' onPress={() => setModalVisible(false)} />
                        <ButtonComponent title='CHỌN' style={{ backgroundColor: '#0071BB' }} onPress={() => setModalVisible(false, dataSelected)} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ModalTransactionType