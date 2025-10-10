import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Transaction {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  amount: number;
  sender: string;
  receiver: string;
}

// Dummy data for now
const transactionsData: Transaction[] = [
  {
    id: "1",
    timestamp: "2025-10-10 08:45 AM",
    title: "Church Donation",
    description: "Offering for community outreach",
    amount: 500,
    sender: "Philemon Odera",
    receiver: "Rongai Church",
  },
  {
    id: "2",
    timestamp: "2025-10-09 04:15 PM",
    title: "Youth Event Payment",
    description: "Ticket for youth conference",
    amount: 1200,
    sender: "Philemon Odera",
    receiver: "Rongai Youth Committee",
  },
  {
    id: "3",
    timestamp: "2025-10-08 10:00 AM",
    title: "Book Purchase",
    description: "Payment for 'Faith and Purpose' book",
    amount: 750,
    sender: "Philemon Odera",
    receiver: "Rongai Church Library",
  },
  {
    id: "4",
    timestamp: "2025-10-10 08:45 AM",
    title: "Church Donation",
    description: "Offering for community outreach",
    amount: 500,
    sender: "Philemon Odera",
    receiver: "Rongai Church",
  },
  {
    id: "5",
    timestamp: "2025-10-09 04:15 PM",
    title: "Youth Event Payment",
    description: "Ticket for youth conference",
    amount: 1200,
    sender: "Philemon Odera",
    receiver: "Rongai Youth Committee",
  },
  {
    id: "6",
    timestamp: "2025-10-08 10:00 AM",
    title: "Book Purchase",
    description: "Payment for 'Faith and Purpose' book",
    amount: 750,
    sender: "Philemon Odera",
    receiver: "Rongai Church Library",
  },
];

export default function TransactionsScreen() {
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState(transactionsData);

  const handleFilter = (text: string) => {
    setFilter(text);
    const lower = text.toLowerCase();
    const filtered = transactionsData.filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower) ||
        t.receiver.toLowerCase().includes(lower) ||
        t.sender.toLowerCase().includes(lower) ||
        t.timestamp.toLowerCase().includes(lower) ||
        t.amount.toString().includes(lower)
    );
    setFilteredData(filtered);
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.amount}>Ksh {item.amount}</Text>
      </View>

      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.meta}>From: {item.sender}</Text>
      <Text style={styles.meta}>To: {item.receiver}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Filter by date, amount, receiver, or description..."
        value={filter}
        onChangeText={handleFilter}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions found.</Text>
        }
      />

      <TouchableOpacity style={styles.filterButton}>
        <Text style={styles.filterButtonText}>Filter Options ⚙️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "white",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  amount: {
    fontWeight: "600",
    color: "#0a84ff",
  },
  description: {
    color: "#555",
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: "#777",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
    textAlign: "right",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 40,
  },
  filterButton: {
    backgroundColor: "#0a84ff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: "90%",
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
