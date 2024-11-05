import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";

function CustomExpenseTabBar({ state, descriptors, navigation }: Readonly<BottomTabBarProps>) {

  const paddingSize = Platform.OS === 'ios' ? 'px-3 pt-3 pb-6' : 'pb-2 pt-3'

  return (
    <View
      className={`flex-row items-center justify-center bg-gray-900 ${paddingSize} border border-t-slate-300`}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const sizeIcon = index === 2 ? 45 : 25

        const iconBar = [
          require('../assets/icons/wallet.png'),
          require('../assets/icons/transaction.png'),
          require('../assets/icons/plus-blue.png'),
          require('../assets/icons/report-pie.png'),
          require('../assets/icons/setting.png'),
        ]

        const textContent = ['Ví tiền', 'Giao dịch', '', 'Thống kê', 'Cài đặt']

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            className='items-center justify-center flex-1 gap-1'
          >
            <Image
              source={iconBar[index]}
              resizeMode='contain'
              style={{ width: sizeIcon, height: sizeIcon }}
            />
            {index !== 2 && (
              <Text
                className={`${isFocused ? 'font-bold' : ''} text-center`}
                style={{ color: isFocused ? '#0071BB' : '#979797' }}
              >
                {textContent[index]}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export default CustomExpenseTabBar;