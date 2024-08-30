import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';

const SignupForm = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://sirdaryoapi.pythonanywhere.com/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            setLoading(false);
            if (response.ok) {
                ToastAndroid.show('Ro‘yxatdan o‘tish muvaffaqiyatli!', ToastAndroid.SHORT);
                navigation.navigate('Login'); // Kirish ekraniga o‘tish
            } else {
                ToastAndroid.show(data.message || 'Ro‘yxatdan o‘tish muvaffaqiyatsiz', ToastAndroid.SHORT);
            }
        } catch (error) {
            setLoading(false);
            ToastAndroid.show('Xatolik yuz berdi', ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hisob yaratish</Text>
            <TextInput
                style={styles.input}
                placeholder="Foydalanuvchi nomi"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Parol"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Ro‘yxatdan o‘tish</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.switchButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.switchButtonText}>Hisobingiz bormi? Kirish</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
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
        elevation: 1, // Android uchun soyani qo'shish
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

export default SignupForm;
