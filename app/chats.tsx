import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const individualChats = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
];

const groupChats = [
    { id: 'g1', name: 'Youth Bible Study' },
    { id: 'g2', name: 'Church Leaders' },
];

export default function ChatsScreen() {
    const router = useRouter();

    const renderItem = ({ item }: { item: { id: string; name: string } }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
                router.push({
                    pathname: '/chats/[id]',
                    params: { id: item.id, name: item.name },
                })
            }
        >
            <Text style={styles.chatName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Individual Chats</Text>
            <FlatList
                data={individualChats}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={styles.list}
            />

            <Text style={styles.sectionTitle}>Group Chats</Text>
            <FlatList
                data={groupChats}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
        color: '#333',
    },
    list: {
        marginBottom: 16,
    },
    chatItem: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f1f1f1',
        marginVertical: 6,
    },
    chatName: {
        fontSize: 16,
    },
});
