import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../src/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700', color: colors.textPrimary },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderGray,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.greenPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="saude"
        options={{
          title: 'Saúde',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart-pulse" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="preventivo"
        options={{
          title: 'Preventivo',
          headerTitle: 'Calendário Preventivo',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-check" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="ia"
        options={{
          title: 'IA',
          headerTitle: 'PetCare AI',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="robot-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          headerTitle: 'Perfil do Pet',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="paw-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
