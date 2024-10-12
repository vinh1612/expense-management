import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../scenes/Splash';
import { Animated } from 'react-native';
import HomeScreen from '../scenes/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppScreenEnum from './enums/AppScreenEnum';
import ExpenseNavigator from './navigators/ExpenseNavigator';
import WarehouseNavigator from './navigators/WarehouseNavigator';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const [isShowSplashScreen, setIsShowSplashScreen] = React.useState(true)

  const fadeAnim = React.useRef(new Animated.Value(1)).current

  React.useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsShowSplashScreen(false);
      });
    }, 3000);
  }, [fadeAnim]);

  if (isShowSplashScreen) {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <SplashScreen />
      </Animated.View>
    );
  }

  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={AppScreenEnum.HOME_NAVIGATOR} component={HomeScreen} />
          <Stack.Screen name={AppScreenEnum.EXPENSE_NAVIGATOR} component={ExpenseNavigator} />
          <Stack.Screen name={AppScreenEnum.WAREHOUSE_NAVIGATOR} component={WarehouseNavigator} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation