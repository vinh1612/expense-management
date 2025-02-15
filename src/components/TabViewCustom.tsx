import React from 'react';
import { View, Text, TouchableOpacity, Animated, Platform, LayoutChangeEvent } from 'react-native';
import PagerView from 'react-native-pager-view';

interface Tab {
    key: string;
    title: string;
    component: React.ReactNode;
}

interface TabViewProps {
    tabs: Tab[];
    initialIndex: number;
}

const TabView: React.FC<TabViewProps> = ({ tabs, initialIndex }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(initialIndex);
    const pagerRef = React.useRef<PagerView>(null);
    const underlineAnim = React.useRef(new Animated.Value(initialIndex)).current;
    const tabWidths = React.useRef<number[]>(new Array(tabs.length).fill(0));
    const [totalWidth, setTotalWidth] = React.useState(0);

    React.useEffect(() => {
        if (Platform.OS === "android") {
            setTimeout(() => {
                setSelectedIndex(initialIndex);
                pagerRef.current?.setPage(initialIndex);
            }, 150);
        } else {
            pagerRef.current?.setPage(initialIndex);
        }
    }, [initialIndex]);

    React.useEffect(() => {
        const targetX = tabWidths.current.slice(0, selectedIndex).reduce((a, b) => a + b, 0);
        Animated.timing(underlineAnim, {
            toValue: targetX,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [selectedIndex, totalWidth]);

    const handleTabPress = (index: number) => {
        setSelectedIndex(index);
        pagerRef.current?.setPage(index);
    };

    const translateX = underlineAnim.interpolate({
        inputRange: [0, tabs.length - 1],
        outputRange: [0, 100 * (tabs.length - 1)], // Move across the width
    });

    const handleTabLayout = (event: LayoutChangeEvent, index: number) => {
        const { width } = event.nativeEvent.layout;
        tabWidths.current[index] = width;
        setTotalWidth(tabWidths.current.reduce((a, b) => a + b, 0)); // Update total width
    };

    return (
        <View className="flex-1">
            {/* Tab Header */}
            <View className="relative flex-row pb-1">
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => handleTabPress(index)}
                        className="items-center flex-1 p-2"
                        onLayout={(event) => handleTabLayout(event, index)}
                    >
                        <Text className={`text-base text-white ${selectedIndex === index && 'text-[#0071BB] font-bold'}`}>
                            {tab.title}
                        </Text>
                    </TouchableOpacity>
                ))}
                <Animated.View
                    className="absolute bottom-0 h-1 bg-[#0071BB] rounded-full"
                    style={{
                        width: tabWidths.current[selectedIndex] ?? 0,
                        transform: [{ translateX: underlineAnim }],
                    }}
                />
            </View>

            {/* Tab Component */}
            <PagerView
                ref={pagerRef}
                className="flex-1"
                initialPage={initialIndex}
                onPageSelected={(e) => setSelectedIndex(e.nativeEvent.position)}
            >
                {tabs.map((tab) => (
                    <View key={tab.key} className="items-center justify-center flex-1">
                        {tab.component}
                    </View>
                ))}
            </PagerView>
        </View>
    );
};

export default TabView;
