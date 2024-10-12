import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Image, Text, TouchableOpacity, View } from "react-native";

function CustomExpenseTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
      <View
        style={{
          shadowColor: '#7F5DF0',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          elevation: 5,
          padding: 10
        }}
        className='absolute flex-row items-center justify-center bg-white rounded-full bottom-6 left-5 right-5'
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
  
          const sizeIcon = index === 2 ? 45 : 24
  
          const iconBar = [
            require('../assets/icons/transaction.png'),
            require('../assets/icons/wallet.png'),
            require('../assets/icons/plus-blue.png'),
            require('../assets/icons/report-pie.png'),
            require('../assets/icons/setting.png'),
          ]

          const textContent = ['Giao dịch', 'Ví tiền', '', 'Thống kê', 'Cài đặt']
  
          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              className='items-center justify-center flex-1 gap-2'
            >
              <Image
                source={iconBar[index]}
                resizeMode='contain'
                style={{width: sizeIcon, height: sizeIcon }}
              />
              {index !== 2 && (
                <Text
                  className='text-center'
                  style={{ color: isFocused ? '#0071BB' : '#979797' }}
                >
                  { textContent[index] }
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
}
export default CustomExpenseTabBar;