import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [phone, setPhone] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (text) => {
    setPhone(text);
  };

  const handleValidatePhone = async () => {
    if (!phone.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите номер телефона');
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      // Заменяем + на %2B для URL кодирования
      const encodedPhone = phone.replace(/\+/g, '%2B');
      const url = `http://192.168.2.82:8080/api/phone/validate?string=${encodedPhone}`;
      
      console.log('Отправляем запрос на:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      setResponse(data);
      console.log('Ответ от API:', data);
      
    } catch (error) {
      console.error('Ошибка при запросе:', error);
      setResponse(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Валидация номера телефона</Text>
      <TextInput
        style={styles.input}
        onChangeText={handlePhoneChange}
        value={phone}
        placeholder="Введите номер телефона (например: +1234567890)"
        keyboardType="phone-pad"
      />
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleValidatePhone}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Проверяем...' : 'Проверить номер'}
        </Text>
      </TouchableOpacity>
      
      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseLabel}>Ответ от API:</Text>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      )}
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    margin: 10,
    padding: 15,
    width: '90%',
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    width: '90%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  responseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '90%',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  responseText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
