import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const dispatch = useDispatch();

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator} 
        // Adicionamos a opção de headerRight para criar o botão de Logout
        options={({ navigation }) => ({ 
          title: 'Catálogo de Produtos',
          headerBackVisible: false,
          headerRight: () => (
            <TouchableOpacity 
              style={{ 
                marginRight: 15, // Desgruda da borda direita
                backgroundColor: '#D9534F', 
                paddingHorizontal: 15, 
                paddingVertical: 8, 
                borderRadius: 6 
              }}
              onPress={() => {
                dispatch(logout());
                navigation.replace('Login');
              }} 
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Sair</Text>
            </TouchableOpacity>
          ),
        })}
      />
      
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ title: 'Detalhes do Produto' }} 
      />
    </Stack.Navigator>
  );
}