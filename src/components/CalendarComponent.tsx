import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'

const CalendarComponent = () => {

    const [currentDate, setCurrentDate] = React.useState(new Date());
    // Get current month, year, and days in month
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Last day of the current month

    const months = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
        "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
        "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    const weekDays = [
        "CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"
    ];

    // Get an array of all the days in the current month
    const daysArray = [...Array(daysInMonth).keys()].map((day) => day + 1);

    // Helper function to change month
    const changeMonth = (direction: number) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + direction);
            return newDate;
        });
    };

    return (
        <View className="p-4 border border-gray-300 rounded-lg">
            {/* Header for navigation */}
            <View className="flex-row items-center justify-between w-full">
                <TouchableOpacity onPress={() => changeMonth(-1)}>
                    <Text className="text-2xl font-bold">{'<'}</Text>
                </TouchableOpacity>
                <Text className="text-lg">{`${months[month]} ${year}`}</Text>
                <TouchableOpacity onPress={() => changeMonth(1)}>
                    <Text className="text-2xl font-bold">{'>'}</Text>
                </TouchableOpacity>
            </View>

            {/* Days of the week */}
            <View className="flex-row items-center justify-between my-4">
                {weekDays.map((day) => (
                    <Text key={day} className="w-12 font-bold text-center">{day}</Text>
                ))}
            </View>

            {/* Grid of days */}
            <View className="flex-row">
                <FlatList
                    data={daysArray}
                    numColumns={7}
                    keyExtractor={(item) => item.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity className="items-center w-12 p-2">
                            <Text className="text-base">{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    )
}

export default CalendarComponent