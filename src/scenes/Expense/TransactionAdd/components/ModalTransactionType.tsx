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
}

const ModalTransactionType = ({ modalVisible, setModalVisible }: ModalTransactionTypeProps) => {

    const dataSelected = React.useRef<TransactionCategory>()

    return (
        <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
        >
            <View className='justify-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.64)' }}>
                <View className='flex h-full py-2 pt-0 bg-white rounded-lg gap-y-2'>
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
                            tabBarActiveTintColor: '#0071BB',
                            tabBarInactiveTintColor: '#979797',
                            tabBarPressColor: 'rgba(0, 113, 187, .1)'
                        }}
                    >
                        <Tab.Screen
                            options={{ tabBarLabel: 'Chi tiêu' }}
                            name={AppScreenEnum.EXPENDITURE_SCREEN}
                            children={() => <ExpenditureComponent onItemPress={(item) => dataSelected.current = item} />}
                        />
                        <Tab.Screen
                            options={{ tabBarLabel: 'Thu nhập' }}
                            name={AppScreenEnum.INCOME_SCREEN}
                            children={() => <IncomeComponent onItemPress={(item) => dataSelected.current = item} />}
                        />
                    </Tab.Navigator>

                    <View className='flex flex-row justify-center gap-x-4'>
                        <ButtonComponent title='HỦY' className='bg-red-500' onPress={() => setModalVisible(false)} />
                        <ButtonComponent title='CHỌN' style={{ backgroundColor: '#0071BB' }} onPress={() => setModalVisible(false, dataSelected.current)} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ModalTransactionType