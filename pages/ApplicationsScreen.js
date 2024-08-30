import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode'; // Fixed import for jwt-decode

const ApplicationsScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const email = decodedToken.email;

                const response = await fetch(`https://sirdarya777.pythonanywhere.com/api/?user=${email}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const result = await response.json();
                setData(result.reverse());
            } else {
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false); // Stop refreshing animation
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigation]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userData');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Logout Failed', 'Please try again.');
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (data.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>Sizda Murojatlar yo'q</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#007BFF']}
                />
            }
        >
            {data.map((item) => {
                const isReviewed = item.korish;
                const cardStyle = isReviewed ? styles.cardReviewed : styles.cardNotReviewed;
                const statusText = isReviewed ? 'Ko\'rildi' : 'Ko\'rilmadi';
                const statusColor = isReviewed ? '#4CAF50' : '#F44336';

                return (
                    <View key={item.id} style={[styles.card, cardStyle]}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Murojat №:{item.id}</Text>
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardText}>Ism: {item.fish}</Text>
                            <Text style={styles.cardText}>Passport ID: {item.idpassport}</Text>
                            <Text style={styles.cardText}>Manzil: {item.Yashashmanzili}</Text>
                            <Text style={styles.cardText}>MFY Nomi: {item.mfynomi}</Text>
                            <Text style={styles.cardText}>Ko'cha Nomi: {item.kochanomi}</Text>
                            <Text style={styles.cardText}>Telefon Raqami: {item.telefonraqami}</Text>
                            <Text style={styles.cardText}>Rasm/Video: {item.rasmvavidio}</Text>
                            <Text style={styles.cardText}>Ariza Turi: {item.ariza_mazmuni}</Text>
                            <Text style={[styles.cardText, { color: statusColor }]}>Holat: {statusText}</Text>
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F7F7F7',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    noDataText: {
        fontSize: 18,
        color: '#888888',
        textAlign: 'center',
        marginTop: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 10,
        margin: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
        borderColor: '#DDDDDD',
        borderWidth: 1,
    },
    cardReviewed: {
        borderLeftWidth: 5,
        borderLeftColor: '#4CAF50',
        backgroundColor: '#E8F5E9',
    },
    cardNotReviewed: {
        borderLeftWidth: 5,
        borderLeftColor: '#F44336',
        backgroundColor: '#FFEBEE',
    },
    cardHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
        paddingBottom: 10,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
    cardBody: {
        paddingTop: 10,
    },
    cardText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555555',
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
});

export default ApplicationsScreen;
