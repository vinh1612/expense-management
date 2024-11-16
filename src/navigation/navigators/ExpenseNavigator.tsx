import AppScreenEnum from '../enums/AppScreenEnum';
import AppScreenParamList from '../types/AppScreenParamList';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  TransactionScreen,
  WalletScreen,
  TransactionAddScreen,
  ReportScreen,
  SettingScreen,
} from '../../scenes/Expense';
import CustomExpenseTabBar from '../../components/CustomExpenseTabBar';

const Tab = createBottomTabNavigator<AppScreenParamList>();

const ExpenseNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={CustomExpenseTabBar}
    >
      <Tab.Screen
        name={AppScreenEnum.WALLET_NAVIGATOR}
        component={WalletScreen}
      />
      <Tab.Screen
        name={AppScreenEnum.TRANSACTION_BOOK_NAVIGATOR}
        component={TransactionScreen}
      />
      <Tab.Screen
        name={AppScreenEnum.TRANSACTION_BOOK_ADD_NAVIGATOR}
        component={TransactionAddScreen}
      />
      <Tab.Screen
        name={AppScreenEnum.REPORT_NAVIGATOR}
        component={ReportScreen}
      />
      <Tab.Screen
        name={AppScreenEnum.SETTING_NAVIGATOR}
        component={SettingScreen}
      />
    </Tab.Navigator>
  );
};

export default ExpenseNavigator;
