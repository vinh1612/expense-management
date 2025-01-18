import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Platform } from 'react-native';

interface CustomMonthYearPickerProps {
    showPicker: boolean;
    mode: 'month' | 'year';
    initialDate?: Date;
    onConfirm: (date: Date) => void;
    onClose: () => void;
    minYear?: number;
    maxYear?: number;
}

const CustomMonthYearPicker: React.FC<CustomMonthYearPickerProps> = ({
    mode,
    initialDate = new Date(),
    onConfirm,
    showPicker,
    onClose,
    minYear = new Date().getFullYear() - 10,
    maxYear = new Date().getFullYear() + 10,
}) => {

    const [selectedMonth, setSelectedMonth] = React.useState(initialDate.getMonth());
    const [selectedYear, setSelectedYear] = React.useState(initialDate.getFullYear());
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
    const months = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
    ];

    const monthFlatListRef = React.useRef<FlatList<string>>(null);
    const yearFlatListRef = React.useRef<FlatList<number>>(null);
    const ITEM_HEIGHT = 48;

    React.useEffect(() => {
        if (showPicker) {
            const scrollToPositions = () => {
                yearFlatListRef.current?.scrollToOffset({
                    offset: years.indexOf(selectedYear) * ITEM_HEIGHT,
                    animated: true
                });
                if (mode === 'month') {
                    monthFlatListRef.current?.scrollToOffset({
                        offset: selectedMonth * ITEM_HEIGHT,
                        animated: true
                    });
                }
            };

            Platform.OS === 'ios'
                ? requestAnimationFrame(() => setTimeout(scrollToPositions, 600))
                : scrollToPositions();
        }
    }, [showPicker]);

    const handleConfirm = () => {
        const selectedDate = new Date(selectedYear, selectedMonth, 1);
        onConfirm(selectedDate);
        onClose();
    };

    const renderItem = (item: React.ReactNode, index: number, selectedIndex: number) => {
        const isSelected = index === selectedIndex;
        return (
            <View className='items-center justify-center h-12'>
                <Text className={`text-lg ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                    {item}
                </Text>
            </View>
        );
    };

    const renderViewSelected = () => {
        return (
            <View
                className='absolute left-0 w-full h-12 border-t border-b top-12 border-t-white border-b-white'
            ></View>
        )
    }

    return (
        <Modal
            transparent
            visible={showPicker}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="justify-center flex-1 px-6 bg-black/50">
                <View className='p-5 space-y-4 bg-gray-700 border border-gray-600 rounded-lg'>
                    <Text className='text-2xl text-center text-white'>Chọn thời gian</Text>
                    <View className="flex-row justify-center px-4 space-x-4">
                        {mode === 'month' && (
                            <View className='relative flex-1'>
                                {renderViewSelected()}
                                <FlatList
                                    ref={monthFlatListRef}
                                    data={months}
                                    keyExtractor={(item) => item.toString()}
                                    renderItem={({ item, index }) =>
                                        renderItem(item, index, selectedMonth)
                                    }
                                    showsVerticalScrollIndicator={false}
                                    snapToInterval={ITEM_HEIGHT}
                                    getItemLayout={(_, index) => ({
                                        length: ITEM_HEIGHT,
                                        offset: ITEM_HEIGHT * index,
                                        index,
                                    })}
                                    onMomentumScrollEnd={(e) => {
                                        const offset = e.nativeEvent.contentOffset.y;
                                        const index = Math.round(offset / ITEM_HEIGHT);
                                        setSelectedMonth(index);
                                    }}
                                    style={{ height: ITEM_HEIGHT * 3 }}
                                    contentContainerStyle={{
                                        paddingVertical: ITEM_HEIGHT,
                                    }}
                                />
                            </View>
                        )}
                        <View className='relative flex-1'>
                            {renderViewSelected()}
                            <FlatList
                                ref={yearFlatListRef}
                                data={years}
                                keyExtractor={(item) => item.toString()}
                                renderItem={({ item, index }) =>
                                    renderItem(item, index, years.indexOf(selectedYear))
                                }
                                showsVerticalScrollIndicator={false}
                                snapToInterval={ITEM_HEIGHT}
                                getItemLayout={(_, index) => ({
                                    length: ITEM_HEIGHT,
                                    offset: ITEM_HEIGHT * index,
                                    index,
                                })}
                                onMomentumScrollEnd={(e) => {
                                    const offset = e.nativeEvent.contentOffset.y;
                                    const index = Math.round(offset / ITEM_HEIGHT);
                                    setSelectedYear(years[index]);
                                }}
                                style={{ height: ITEM_HEIGHT * 3 }}
                                contentContainerStyle={{
                                    paddingVertical: ITEM_HEIGHT,
                                }}
                            />
                        </View>
                    </View>
                    <View className='flex flex-row justify-center space-x-4'>
                        <TouchableOpacity
                            className="px-5 py-3 bg-red-500 rounded-lg"
                            onPress={() => {
                                setSelectedMonth(initialDate.getMonth())
                                setSelectedYear(initialDate.getFullYear())
                                onClose()
                            }}
                        >
                            <Text className="text-lg text-center text-white">Đóng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="py-3 px-5 bg-[#0071BB] rounded-lg"
                            onPress={handleConfirm}
                        >
                            <Text className="text-lg text-center text-white">Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        </Modal >
    );
};

export default CustomMonthYearPicker;
