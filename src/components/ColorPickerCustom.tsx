import React from "react";
import { View, Text, PanResponder, TouchableOpacity } from "react-native";
import { RGBAColorStyle } from "../types/CalendarStyle";
import CustomDropdown from "./CustomDropdown";
import { CALENDAR_STYLE } from "../constants/Constant";

const CustomSlider = ({
    min, max, step, value, title,
    trackColor = "gray", thumbColor = "white",
    onValueChange,
}: {
    min: number; max: number; step: number; value: number;
    trackColor?: string; thumbColor?: string; title: string;
    onValueChange: (value: number) => void;
}) => {

    const [trackWidth, setTrackWidth] = React.useState(0);
    const [thumbPosition, setThumbPosition] = React.useState(
        ((value - min) / (max - min)) * trackWidth
    );

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            const effectiveTrackWidth = Math.abs(trackWidth - 20);
            let newPosition = thumbPosition + gestureState.dx;
            newPosition = Math.max(0, Math.min(newPosition, effectiveTrackWidth));
            const newValue = Math.round(
                (min + (newPosition / effectiveTrackWidth) * (max - min)) / step
            ) * step;
            setThumbPosition(newPosition);
            onValueChange(newValue);
        },
    });

    React.useEffect(() => {
        const effectiveTrackWidth = Math.abs(trackWidth - 20);
        setThumbPosition(((value - min) / (max - min)) * effectiveTrackWidth)
    }, [trackWidth, value]);

    return (
        <View
            className="flex-row items-center justify-between space-x-4"
            onLayout={(e) => {
                const { width } = e.nativeEvent.layout;
                const newTrackWidth = width - 16 - 90; {/* 16: space-x-4 (1rem / 16px), 90: max content of title */ }
                setTrackWidth(newTrackWidth)
            }}
        >
            <Text className="text-base text-white" >{title}</Text>
            <View
                className='justify-center h-10'
                style={{ width: trackWidth }}
            >
                <View className="w-full h-1 rounded-full" style={{ backgroundColor: trackColor }} />
                <View
                    className="absolute w-5 h-5 rounded-full"
                    style={{ left: thumbPosition, backgroundColor: thumbColor }}
                    {...panResponder.panHandlers}
                />
            </View>
        </View>
    );
};

const ColorPickerCustom = ({
    initialColor, typeSelected,
    onColorChange, onClose, onConfirm, onChangeType
}: {
    initialColor: RGBAColorStyle;
    onColorChange: (red: number, green: number, blue: number, opacity: number, type: number) => void
    onClose: () => void;
    onConfirm: () => void;
    typeSelected: number;
    onChangeType: (type: number) => void;
}) => {

    const [redState, setRedState] = React.useState(0);
    const [greenState, setGreenState] = React.useState(0);
    const [blueState, setBlueState] = React.useState(0);
    const [opacityState, setOpacityState] = React.useState(0);

    const options = [
        { id: CALENDAR_STYLE.THEME, label: 'Màu chủ đề của lịch' },
        { id: CALENDAR_STYLE.TEXT, label: 'Màu chữ của lịch' },
        { id: CALENDAR_STYLE.CURRENT_DATE, label: 'Màu ngày hiện tại của lịch' },
    ];

    React.useEffect(() => {
        setRedState(initialColor.red ?? 0);
        setGreenState(initialColor.green ?? 0)
        setBlueState(initialColor.blue ?? 0)
        setOpacityState(initialColor.opacity ?? 0)
    }, [typeSelected]);

    return (
        <View>
            <View className="flex flex-row justify-center">
                <View>
                    <CustomDropdown
                        options={options}
                        selectedId={typeSelected}
                        onSelect={(option) => {
                            onChangeType(option.id)
                        }}
                    />
                </View>
            </View>
            <CustomSlider
                min={0}
                max={255}
                step={1}
                value={redState}
                thumbColor="white"
                trackColor="red"
                title="Đỏ"
                onValueChange={(red) => {
                    setRedState(red);
                    onColorChange(red, greenState, blueState, opacityState, typeSelected);
                }}
            />

            <CustomSlider
                min={0}
                max={255}
                step={1}
                value={greenState}
                thumbColor="white"
                trackColor="green"
                title="Xanh lá"
                onValueChange={(green) => {
                    setGreenState(green);
                    onColorChange(redState, green, blueState, opacityState, typeSelected);
                }}
            />

            <CustomSlider
                min={0}
                max={255}
                step={1}
                value={blueState}
                thumbColor="white"
                trackColor="blue"
                title="Xanh dương"
                onValueChange={(blue) => {
                    setBlueState(blue);
                    onColorChange(redState, greenState, blue, opacityState, typeSelected);
                }}
            />
            <CustomSlider
                min={0}
                max={1}
                step={0.01}
                value={opacityState}
                title="Độ mờ"
                onValueChange={(opacity) => {
                    setOpacityState(opacity);
                    onColorChange(redState, greenState, blueState, opacity, typeSelected);
                }}
            />
            <View className="flex-row justify-end mt-2">
                <TouchableOpacity
                    className="p-2 px-4 mr-4 bg-red-500 rounded-lg"
                    onPress={onClose}
                >
                    <Text className="text-white">Đóng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="p-2 px-4 bg-[#0071BB] rounded-lg"
                    onPress={onConfirm}
                >
                    <Text className="text-white">Đồng ý</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ColorPickerCustom;
