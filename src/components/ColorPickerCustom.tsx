import React from "react";
import { View, Text, PanResponder, TouchableOpacity, StyleSheet } from "react-native";
import { RGBAColorStyle } from "../models/CalendarStyle";
import CustomDropdown from "./CustomDropdown";
import { CALENDAR_STYLE } from "../constants/Status";

const styles = StyleSheet.create({
    thumbShadow: {
        elevation: 2, // Android shadow
        shadowOffset: { width: 0, height: 1 }, // iOS shadow
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
});

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
    const isDragging = React.useRef(false);
    const trackLayoutX = React.useRef(0);
    const trackRef = React.useRef<View>(null);

    const updatePosition = React.useCallback((pageX: number) => {
        if (!trackRef.current || trackWidth <= 20) return;
        trackRef.current.measure((x, y, width, height, pageXOffset) => {
            const effectiveTrackWidth = trackWidth - 20; // 20 là width của thumb
            const relativeX = pageX - pageXOffset; // Vị trí relative với track
            // Clamp position trong khoảng hợp lệ
            const newPosition = Math.max(0, Math.min(relativeX - 10, effectiveTrackWidth)); // 10 là nửa width thumb
            const newValue = Math.round(
                (min + (newPosition / effectiveTrackWidth) * (max - min)) / step
            ) * step;
            setThumbPosition(newPosition);
            onValueChange(newValue);
        });
    }, [trackWidth, min, max, step, onValueChange]);

    const panResponder = React.useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
            isDragging.current = true;
            updatePosition(evt.nativeEvent.pageX);
        },
        onPanResponderMove: (evt) => {
            if (isDragging.current) {
                updatePosition(evt.nativeEvent.pageX);
            }
        },
        onPanResponderRelease: () => {
            isDragging.current = false;
        },
        onPanResponderTerminate: () => {
            isDragging.current = false;
        },
    }), [updatePosition]);

    React.useEffect(() => {
        if (!isDragging.current && trackWidth > 0) {
            const effectiveTrackWidth = Math.abs(trackWidth - 20);
            const newPosition = ((value - min) / (max - min)) * effectiveTrackWidth;
            setThumbPosition(newPosition);
        }
    }, [trackWidth, value, min, max]);

    const trackStyle = React.useMemo(() => ({ width: trackWidth }), [trackWidth]);
    const trackColorStyle = React.useMemo(() => ({ backgroundColor: trackColor }), [trackColor]);
    const thumbStyle = React.useMemo(() => ({
        left: thumbPosition,
        backgroundColor: thumbColor,
        ...styles.thumbShadow,
    }), [thumbPosition, thumbColor]);

    return (
        <View
            className="flex-row items-center justify-between space-x-4"
            onLayout={(e) => {
                const { width } = e.nativeEvent.layout;
                /* 16: space-x-4 (1rem / 16px), 90: max content of title */
                const newTrackWidth = width - 16 - 90;
                setTrackWidth(newTrackWidth)
            }}
        >
            <Text className="text-base text-white" >{title}</Text>
            <View
                ref={trackRef}
                className='justify-center h-10'
                style={trackStyle}
                onLayout={(e) => {
                    trackLayoutX.current = e.nativeEvent.layout.x;
                }}
                {...panResponder.panHandlers}
            >
                <View className="w-full h-1 rounded-full" style={trackColorStyle} />
                <View
                    className="absolute w-5 h-5 rounded-full"
                    style={thumbStyle}
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

    const debouncedOnColorChange = React.useCallback(
        (red: number, green: number, blue: number, opacity: number, type: number) => {
            const timeoutId = setTimeout(() => {
                onColorChange(red, green, blue, opacity, type);
            }, 16); // ~60fps
            return () => clearTimeout(timeoutId);
        }, [onColorChange]);

    React.useEffect(() => {
        setRedState(initialColor.red ?? 0);
        setGreenState(initialColor.green ?? 0)
        setBlueState(initialColor.blue ?? 0)
        setOpacityState(initialColor.opacity ?? 0)
    }, [typeSelected, initialColor]);

    const handleRedChange = React.useCallback((red: number) => {
        setRedState(red);
        debouncedOnColorChange(red, greenState, blueState, opacityState, typeSelected);
    }, [greenState, blueState, opacityState, typeSelected, debouncedOnColorChange]);

    const handleGreenChange = React.useCallback((green: number) => {
        setGreenState(green);
        debouncedOnColorChange(redState, green, blueState, opacityState, typeSelected);
    }, [redState, blueState, opacityState, typeSelected, debouncedOnColorChange]);

    const handleBlueChange = React.useCallback((blue: number) => {
        setBlueState(blue);
        debouncedOnColorChange(redState, greenState, blue, opacityState, typeSelected);
    }, [redState, greenState, opacityState, typeSelected, debouncedOnColorChange]);

    const handleOpacityChange = React.useCallback((opacity: number) => {
        setOpacityState(opacity);
        debouncedOnColorChange(redState, greenState, blueState, opacity, typeSelected);
    }, [redState, greenState, blueState, typeSelected, debouncedOnColorChange]);

    const handleTypeSelect = React.useCallback((option: { id: number }) => {
        onChangeType(option.id);
    }, [onChangeType]);

    return (
        <View>
            <View className="flex flex-row justify-center">
                <View>
                    <CustomDropdown
                        options={options}
                        selectedId={typeSelected}
                        onSelect={handleTypeSelect}
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
                onValueChange={handleRedChange}
            />

            <CustomSlider
                min={0}
                max={255}
                step={1}
                value={greenState}
                thumbColor="white"
                trackColor="green"
                title="Xanh lá"
                onValueChange={handleGreenChange}
            />

            <CustomSlider
                min={0}
                max={255}
                step={1}
                value={blueState}
                thumbColor="white"
                trackColor="blue"
                title="Xanh dương"
                onValueChange={handleBlueChange}
            />
            <CustomSlider
                min={0}
                max={1}
                step={0.01}
                value={opacityState}
                title="Độ mờ"
                onValueChange={handleOpacityChange}
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
