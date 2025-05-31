import React from 'react';
import { FlatList, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

interface MonthViewProps {
    date: Date;
    onSelectMonth?: (month: number) => void;
    backgroundColor?: string;
    textColor?: string;
}

const MonthView: React.FC<MonthViewProps> = ({ date, onSelectMonth, backgroundColor, textColor }) => {
    const isDarkMode = useColorScheme() === 'dark';

    const months = Array.from({ length: 12 }, (_, i) =>
        new Date(date.getFullYear(), i, 1).toLocaleString('default', { month: 'long' })
    );

    return (
        <FlatList
            data={months}
            numColumns={3}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => {
                const isSelected = date.getMonth() === index;
                const textColorStyle = { color: isSelected ? 'white' : isDarkMode ? textColor : 'black' };
                return (
                    <TouchableOpacity
                        onPress={() => {
                            onSelectMonth?.(index);
                        }}
                        className="flex-1 p-2"
                    >
                        <View
                            style={isSelected && [{ backgroundColor }, { borderRadius: 8 }]}
                            className="items-center justify-center p-2"
                        >
                            <Text
                                className="text-base"
                                style={textColorStyle}
                            >
                                {item}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
};

export default MonthView;
