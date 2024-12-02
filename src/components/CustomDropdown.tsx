import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Dimensions } from 'react-native';
import ArrowIcon from '../assets/svgIcons/ArrowIcon';
import CheckIcon from '../assets/svgIcons/CheckIcon';

interface DropdownSelectProps {
    options: { id: number; label: string }[];
    selectedId: number | null;
    onSelect: (option: { id: number; label: string }) => void;
    placeholder?: string;
    labelShowSpec?: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
    options,
    selectedId,
    onSelect,
    placeholder = 'Chọn phương án',
    labelShowSpec,
}) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [dropdownPosition, setDropdownPosition] = React.useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);
    const dropdownButtonRef = React.useRef<View>(null);
    const selectedOption = options.find(option => option.id === selectedId);

    const handleSelect = (option: { id: number; label: string }) => {
        onSelect(option);
        setIsVisible(false);
    };

    const handleOpen = () => {
        if (dropdownButtonRef.current) {
            dropdownButtonRef.current.measure(
                (x, y, width, height, pageX, pageY) => {
                    setDropdownPosition({ x: pageX, y: pageY, width, height });
                    setIsVisible(true);
                }
            );
        }
    };

    return (
        <View className='w-full'>
            {/* Dropdown Button */}
            <TouchableOpacity
                ref={dropdownButtonRef}
                className={`flex flex-row items-center justify-between space-x-2 px-4 py-2 bg-gray-800 border border-gray-600 ${isVisible ? 'rounded-t-lg' : 'rounded-lg'}`}
                onPress={handleOpen}
            >
                <Text className='text-base text-white break-words whitespace-normal'>
                    {
                        labelShowSpec ? labelShowSpec : (selectedOption ? selectedOption.label : placeholder)
                    }
                </Text>
                <View>
                    <ArrowIcon direction={isVisible ? 'up' : 'down'} color='white' />
                </View>
            </TouchableOpacity>

            {/* Modal for Dropdown */}
            <Modal
                visible={isVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsVisible(false)}
            >
                <TouchableOpacity
                    className='justify-center flex-1'
                    activeOpacity={1}
                    onPress={() => setIsVisible(false)}
                >
                    <View
                        className='absolute w-full bg-gray-800 border border-gray-600 rounded-b-lg shadow-lg'
                        style={{
                            top: (dropdownPosition?.y ?? 0) + (dropdownPosition?.height ?? 0) + 8,
                            left: dropdownPosition?.x ?? 0,
                            width: dropdownPosition?.width ?? '100%',
                            maxHeight: Dimensions.get('screen').height * 0.4
                        }}
                    >
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className={`m-1 flex flex-row justify-between items-center space-x-2 px-4 py-2 rounded-md ${item.id === selectedId ? 'bg-gray-900' : ''}`}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text className={`text-base text-white break-words whitespace-normal ${item.id === selectedId && 'pr-2'}`}>{item.label}</Text>
                                    {item.id === selectedId && <View className=''><CheckIcon size={18} /></View>}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};
export default DropdownSelect;
