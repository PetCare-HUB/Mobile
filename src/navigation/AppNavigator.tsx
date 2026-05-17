import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../screens/HomeScreen';
import { CollarScreen } from '../screens/CollarScreen';
import { FeederScreen } from '../screens/FeederScreen';
import { EnvironmentScreen } from '../screens/EnvironmentScreen';
import { PreventiveScreen } from '../screens/PreventiveScreen';
import { PetProfileScreen } from '../screens/PetProfileScreen';

export type RootStackParamList = {
  Home: undefined;
  Collar: undefined;
  Feeder: undefined;
  Environment: undefined;
  Preventive: undefined;
  PetProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#F8FAFC',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'PetCare Hub' }}
        />

        <Stack.Screen
          name="Collar"
          component={CollarScreen}
          options={{ title: 'Coleira Smart' }}
        />

        <Stack.Screen
          name="Feeder"
          component={FeederScreen}
          options={{ title: 'Comedouro' }}
        />

        <Stack.Screen
          name="Environment"
          component={EnvironmentScreen}
          options={{ title: 'Ambiente' }}
        />

        <Stack.Screen
          name="Preventive"
          component={PreventiveScreen}
          options={{ title: 'Calendário Preventivo' }}
        />

        <Stack.Screen
          name="PetProfile"
          component={PetProfileScreen}
          options={{ title: 'Perfil do Pet' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}