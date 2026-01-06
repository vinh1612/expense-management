import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import LoadingState from '../services/LoadingState';

export default function GlobalLoadingOverlay() {
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const unsubscribe = LoadingState.subscribe(setIsLoading);
        return unsubscribe;
    }, []);

    if (!isLoading) return null;

    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#fff" />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
});
