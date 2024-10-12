import AppScreenEnum from '../enums/AppScreenEnum';
import AppScreenParamList from '../types/AppScreenParamList';
import WarehouseScreen from '../../scenes/Warehouse';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator<AppScreenParamList>();

const WarehouseNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0071BB',
        tabBarInactiveTintColor: '#C5C6C9',
        headerShown: false
      }}>
      <Tab.Screen
        name={AppScreenEnum.WAREHOUSE_SCREEN}
        component={WarehouseScreen}
        options={{
          tabBarLabel: 'Kho hàng',
        }}
      />
    </Tab.Navigator>
  );
};

export default WarehouseNavigator;
