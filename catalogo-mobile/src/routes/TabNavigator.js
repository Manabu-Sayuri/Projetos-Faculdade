import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MaleProductsScreen from '../screens/MaleProductsScreen';
import FemaleProductsScreen from '../screens/FemaleProductsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({ 
        headerShown: false,
        tabBarActiveTintColor: route.name === 'Female' ? '#E83E8C' : '#007BFF',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: () => null, 
        tabBarLabelPosition: 'beside-icon', // 🚀 O segredo: muda o layout para alinhar no centro nativamente
        tabBarStyle: { 
          height: 60, 
        },
        tabBarItemStyle: {
          justifyContent: 'center', 
          alignItems: 'center',
        },
        tabBarLabelStyle: { 
          fontSize: 16, 
          fontWeight: 'bold',
          marginLeft: 0, // Remove o espaçamento fantasma que ficaria ao lado do ícone
        }
      })}
    >
      <Tab.Screen 
        name="Male" 
        component={MaleProductsScreen} 
        options={{ tabBarLabel: 'Masculino' }} 
      />
      <Tab.Screen 
        name="Female" 
        component={FemaleProductsScreen} 
        options={{ tabBarLabel: 'Feminino' }} 
      />
    </Tab.Navigator>
  );
}