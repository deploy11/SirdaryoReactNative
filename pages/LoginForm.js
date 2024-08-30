import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ToastAndroid, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode'; // to'g'ri import

const LoginForm = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Yuklanayotgan holat

    const handleLogin = async () => {
        setLoading(true); // So'rov boshlanishida yuklanayotgan holatni o'rnatish
        try {
            const response = await fetch('https://sirdaryoapi.pythonanywhere.com/api11/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const data = await response.json();
            
            if (response.ok && data.access) {
                const decodedToken = jwtDecode(data.access); // Tokenni dekodlash

                await AsyncStorage.setItem('token', data.access); 
                await AsyncStorage.setItem('user', decodedToken.email); 
                ToastAndroid.show('Muvaffaqiyatli kirish', ToastAndroid.SHORT);
                navigation.navigate('Applications'); // Applications ekraniga o‘tish
            } else {
                ToastAndroid.show('Muvaffaqiyatsiz kirish. Iltimos, maʼlumotlaringizni tekshiring.', ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show('Xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.', ToastAndroid.SHORT);
        } finally {
            setLoading(false); // So'rov tugagandan so'ng yuklanayotgan holatni o'rnatish
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Kirish</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Foydalanuvchi nomi"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Parol"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" /> // Yuklanayotgan holatda loader ko'rsatish
                    ) : (
                        <Text style={styles.buttonText}>Kirish</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.switchButton} onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.switchButtonText}>Hisobingiz yo'qmi? Ro'yxatdan o'ting</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        elevation: 3, // Android uchun soyani qo'shish
        shadowColor: '#000', // iOS uchun soyani qo'shish
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007BFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 3, // Android uchun soyani qo'shish
        shadowColor: '#000', // iOS uchun soyani qo'shish
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchButton: {
        marginTop: 10,
    },
    switchButtonText: {
        color: '#007BFF',
        fontSize: 16,
    },
});

export default LoginForm;
