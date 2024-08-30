import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import ApplicationsScreen from './pages/ApplicationsScreen';
import NoInternet from './pages/NoInternet';
import MurojatAdd from './pages/MurojatAdd';
import { TouchableOpacity, View, ActivityIndicator, StyleSheet, Alert, ToastAndroid } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const Stack = createStackNavigator();

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [initialRoute, setInitialRoute] = useState('Login'); // Standart yo‘nalish

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    setIsAuthenticated(true);
                    ToastAndroid.show('Muvaffaqiyatli! Token mavjud', ToastAndroid.SHORT);
                    setInitialRoute('Applications'); // Applications ekraniga o‘tish
                } else {
                    setInitialRoute('Login'); // Login ekraniga o‘tish
                }
            } catch (error) {
                console.error('Autentifikatsiya xatosi:', error);
                setInitialRoute('Login'); // Login ekraniga o‘tish
            } finally {
                setIsLoading(false);
            }
        };

        const checkConnectivity = () => {
            NetInfo.fetch().then(state => {
                setIsConnected(state.isConnected);
            });
        };

        checkConnectivity();

        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        checkAuth();

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (!isConnected) {
        return <NoInternet />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
                <Stack.Screen
                    name="Applications"
                    component={ApplicationsScreen}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <View style={styles.headerRight}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('MurojatAdd')}
                                    style={styles.headerButton}
                                >
                                    <FontAwesome name="plus" size={30} color="#007BFF" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={async () => {
                                        try {
                                            await AsyncStorage.removeItem('token');
                                            await AsyncStorage.removeItem('userData');
                                            setIsAuthenticated(false);
                                            navigation.navigate('Login');
                                        } catch (error) {
                                            Alert.alert('Chiqish Xatosi', 'Chiqish amalga oshmadi.');
                                        }
                                    }}
                                    style={styles.headerButton}
                                >
                                    <FontAwesome name="sign-out" size={30} color="#FF3B30" />
                                </TouchableOpacity>
                            </View>
                        ),
                        headerTitle: 'Murojatlar',
                        headerTitleStyle: styles.headerTitle,
                        headerLeft: null, // Orqa tugmasini olib tashlash
                    })}
                />
                <Stack.Screen 
                    name="MurojatAdd" 
                    component={MurojatAdd} 
                    options={{ headerTitle: 'Qo‘shish' }} 
                />
                <Stack.Screen 
                    name="Login" 
                    component={LoginForm} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Signup" 
                    component={SignupForm} 
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    headerButton: {
        marginLeft: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default App;
