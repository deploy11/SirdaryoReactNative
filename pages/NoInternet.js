import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const NoInternet = () => {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://cdn.dribbble.com/users/172747/screenshots/3135908/peas-nointernet.gif' }}
                style={styles.image}
            />
            <Text style={styles.text}>Internetga ulaning</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        color: '#888888',
    },
});

export default NoInternet;
