import React from 'react';
import { Text, TouchableOpacity, View, useColorScheme } from 'react-native';

interface YearViewProps {
    date: Date;
    onSelectYear?: (year: number) => void;
    backgroundColor?: string;
    textColor?: string;
}

const YearView: React.FC<YearViewProps> = ({ date, onSelectYear, backgroundColor, textColor }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const currentYear = Math.floor(date.getFullYear() / 10) * 10;
    const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

    return (
        <View className="flex flex-row flex-wrap">
            {years.map(year => {
                const isSelected = date.getFullYear() === year;
                const textColorStyle = {
                    color: isSelected ? 'white' : isDarkMode ? textColor : 'black',
                };
                return (
                    <TouchableOpacity
                        key={year}
                        onPress={() => onSelectYear?.(year)}
                        className="w-1/3 p-2"
                    >
                        <View
                            className="items-center justify-center p-2 rounded-lg"
                            style={isSelected ? { backgroundColor } : undefined}
                        >
                            <Text
                                className="text-base"
                                style={textColorStyle}
                            >
                                {year}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default YearView;