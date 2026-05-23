import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/HomeScreen';
import { CollarScreen } from '../screens/CollarScreen';
import { FeederScreen } from '../screens/FeederScreen';
import { EnvironmentScreen } from '../screens/EnvironmentScreen';
import { PreventiveScreen } from '../screens/PreventiveScreen';
import { PetProfileScreen } from '../screens/PetProfileScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Preventive: undefined;
};

export type TabParamList = {
  Home: undefined;
  Collar: undefined;
  Feeder: undefined;
  Environment: undefined;
  PetProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0F172A' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#60A5FA',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'PetCare Hub',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Collar"
        component={CollarScreen}
        options={{
          headerTitle: 'Coleira Smart',
          tabBarLabel: 'Coleira',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tag-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Feeder"
        component={FeederScreen}
        options={{
          headerTitle: 'Comedouro Inteligente',
          tabBarLabel: 'Comedouro',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bowl-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Environment"
        component={EnvironmentScreen}
        options={{
          headerTitle: 'Ambiente',
          tabBarLabel: 'Ambiente',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-thermometer-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PetProfile"
        component={PetProfileScreen}
        options={{
          headerTitle: 'Perfil do Pet',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="paw-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0F172A' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Preventive"
          component={PreventiveScreen}
          options={{ title: 'Calendário Preventivo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}