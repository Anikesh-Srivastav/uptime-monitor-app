import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomNavBar from './BottomNavBar';
import DashboardScreen from '../screens/DashboardScreen';
import MonitorDetailScreen from '../screens/MonitorDetailScreen';
import EndpointDetailScreen from '../screens/EndpointDetailScreen';
import MonitorsScreen from '../screens/MonitorsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import LogsScreen from '../screens/LogsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SessionsScreen from '../screens/SessionsScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import { usePushNotifications } from '../hooks/usePushNotifications';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const STACK_OPTIONS = { headerShown: false, animation: 'slide_from_right' };

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={STACK_OPTIONS}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="MonitorDetail" component={MonitorDetailScreen} />
      <Stack.Screen name="EndpointDetail" component={EndpointDetailScreen} />
    </Stack.Navigator>
  );
}

function MonitorsStack() {
  return (
    <Stack.Navigator screenOptions={STACK_OPTIONS}>
      <Stack.Screen name="MonitorsHome" component={MonitorsScreen} />
      <Stack.Screen name="MonitorDetail" component={MonitorDetailScreen} />
      <Stack.Screen name="EndpointDetail" component={EndpointDetailScreen} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={STACK_OPTIONS}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
      <Stack.Screen name="Sessions" component={SessionsScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
}

// Initialises push notifications once the authenticated tree is mounted
function PushNotificationInit() {
  usePushNotifications();
  return null;
}

export default function AppNavigator() {
  return (
    <>
      <PushNotificationInit />
      <Tab.Navigator
        tabBar={(props) => <BottomNavBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Dashboard" component={DashboardStack} />
        <Tab.Screen name="Monitors" component={MonitorsStack} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} />
        <Tab.Screen name="Logs" component={LogsScreen} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </>
  );
}
