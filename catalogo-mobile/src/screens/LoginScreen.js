import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, registerUser } from '../store/slices/authSlice';

export default function LoginScreen({ navigation }) {
  const [isLoginMode, setIsLoginMode] = useState(true); // Controla a tela atual
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  // Busca os usuários cadastrados no Redux
  const registeredUsers = useSelector(state => state.auth.registeredUsers);

  const handleAuth = () => {
    if (!email.includes('@') || password.length < 6) {
      setErrorMessage('Insira um e-mail válido e uma senha com pelo menos 6 caracteres');
      return;
    }

    if (isLoginMode) {
      // TENTATIVA DE LOGIN
      const userExists = registeredUsers.find(u => u.email === email && u.password === password);
      
      if (userExists) {
        setErrorMessage('');
        dispatch(login({ email }));
        navigation.replace('MainTabs');
      } else {
        setErrorMessage('Conta não encontrada ou senha incorreta. Cadastre-se primeiro.');
      }
    } else {
      // TENTATIVA DE CADASTRO
      const alreadyExists = registeredUsers.find(u => u.email === email);
      
      if (alreadyExists) {
        setErrorMessage('Este e-mail já está em uso');
      } else {
        setErrorMessage('');
        dispatch(registerUser({ email, password }));
        Alert.alert('Sucesso!', 'Cadastro realizado. Agora você pode fazer o login.');
        setIsLoginMode(true); // Joga o usuário de volta para a tela de login
        setPassword(''); // Limpa a senha por segurança
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://via.placeholder.com/150?text=Logo+Gato' }}
        style={styles.logo}
      />
      
      <Text style={styles.title}>{isLoginMode ? 'Acesse sua Conta' : 'Crie sua Conta'}</Text>

      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isLoginMode ? 'Entrar' : 'Cadastrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.toggleButton} 
        onPress={() => {
          setIsLoginMode(!isLoginMode);
          setErrorMessage('');
        }}
      >
        <Text style={styles.toggleText}>
          {isLoginMode ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA', padding: 20 },
  logo: { width: 120, height: 120, marginBottom: 20, borderRadius: 60 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 30 },
  input: { width: '100%', height: 50, backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0', fontSize: 16 },
  button: { width: '100%', height: 50, backgroundColor: '#007BFF', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: '#D9534F', marginBottom: 15, fontWeight: '500', textAlign: 'center' },
  toggleButton: { marginTop: 20 },
  toggleText: { color: '#007BFF', fontSize: 16, fontWeight: '600' }
});