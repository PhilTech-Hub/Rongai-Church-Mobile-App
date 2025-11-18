import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Modal,
    Platform,
    SafeAreaView,
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
  type: "sent" | "received" | "failed";
  confirmationMessage: string;
}

const transactionsData: Transaction[] = [
  {
    id: "1",
    timestamp: "2025-10-10 08:45 AM",
    title: "Church Donation",
    description: "Offering for community outreach",
    amount: 500,
    sender: "Philemon Odera",
    receiver: "Rongai Church",
    type: "sent",
    confirmationMessage: "MPESA Confirmed: QJD72T3I5. You sent Ksh 500 to Rongai Church.",
  },
  {
    id: "2",
    timestamp: "2025-10-09 04:15 PM",
    title: "Youth Event Payment",
    description: "Ticket for youth conference",
    amount: 1200,
    sender: "Philemon Odera",
    receiver: "Rongai Youth Committee",
    type: "sent",
    confirmationMessage: "MPESA Confirmed: MFP76P8N0. You sent Ksh 1200 to Rongai Youth Committee.",
  },
  {
    id: "3",
    timestamp: "2025-10-08 10:00 AM",
    title: "Book Purchase",
    description: "Payment for 'Faith and Purpose' book",
    amount: 750,
    sender: "Philemon Odera",
    receiver: "Rongai Church Library",
    type: "received",
    confirmationMessage: "MPESA Confirmed: WGE82D4O1. You received Ksh 750 from Rongai Church Library.",
  },
  {
    id: "4",
    timestamp: "2025-10-06 11:22 AM",
    title: "Donation Refund",
    description: "Failed refund due to timeout",
    amount: 300,
    sender: "Philemon Odera",
    receiver: "Rongai Church",
    type: "failed",
    confirmationMessage: "Transaction failed. Refund not processed due to timeout.",
  },
];

const PAGE_SIZE = 2; // for pagination

export default function TransactionsScreen() {
  const [filterText, setFilterText] = useState("");
  const [filteredData, setFilteredData] = useState<Transaction[]>(transactionsData);
  const [displayedData, setDisplayedData] = useState<Transaction[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "amount" | "receiver">("date");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [insights, setInsights] = useState<string[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const slideAnim = useState(new Animated.Value(-Dimensions.get("window").width))[0];

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadMore = () => {
    const nextIndex = displayedData.length;
    const nextBatch = filteredData.slice(nextIndex, nextIndex + PAGE_SIZE);
    setDisplayedData([...displayedData, ...nextBatch]);
  };

  // Apply filters and sorting
  const applyFilters = () => {
    let result = [...transactionsData];

    if (filterText) {
      const lower = filterText.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.description.toLowerCase().includes(lower) ||
          t.receiver.toLowerCase().includes(lower) ||
          t.sender.toLowerCase().includes(lower)
      );
    }

    if (startDate && endDate) {
      result = result.filter((t) => {
        const txDate = new Date(t.timestamp);
        return txDate >= startDate && txDate <= endDate;
      });
    }

    switch (sortBy) {
      case "amount":
        result.sort((a, b) => b.amount - a.amount);
        break;
      case "receiver":
        result.sort((a, b) => a.receiver.localeCompare(b.receiver));
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    setFilteredData(result);
    setDisplayedData(result.slice(0, PAGE_SIZE));
  };

  const handleDateChange = (
    event: any,
    selectedDate: Date | undefined,
    type: "start" | "end"
  ) => {
    if (Platform.OS === "android") {
      type === "start" ? setShowStartPicker(false) : setShowEndPicker(false);
    }
    if (selectedDate) {
      type === "start" ? setStartDate(selectedDate) : setEndDate(selectedDate);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filterText, startDate, endDate, sortBy]);

  // Insights
  useEffect(() => {
    const sent = transactionsData.filter((t) => t.type === "sent");
    const received = transactionsData.filter((t) => t.type === "received");
    const totalSent = sent.reduce((sum, t) => sum + t.amount, 0);
    const totalReceived = received.reduce((sum, t) => sum + t.amount, 0);
    const topReceiver = sent.reduce((acc, t) => {
      acc[t.receiver] = (acc[t.receiver] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequentReceiver =
      Object.keys(topReceiver).sort(
        (a, b) => topReceiver[b] - topReceiver[a]
      )[0] || "No receiver";

    setInsights([
      `You’ve made ${sent.length} payments this week.`,
      `Total sent: Ksh ${totalSent.toLocaleString()}`,
      `Total received: Ksh ${totalReceived.toLocaleString()}`,
      `Top receiver: ${mostFrequentReceiver}`,
    ]);
  }, []);

  const toggleInsights = () => {
    if (showInsights) {
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get("window").width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowInsights(false));
    } else {
      setShowInsights(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const getColor = (type: Transaction["type"]) => {
    switch (type) {
      case "sent":
        return "#28a745";
      case "received":
        return "#007bff";
      case "failed":
        return "#dc3545";
      default:
        return "#000";
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedTransaction(item);
        setModalVisible(true);
      }}
    >
      <View style={[styles.card, { borderLeftColor: getColor(item.type) }]}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={[styles.amount, { color: getColor(item.type) }]}>
            Ksh {item.amount}
          </Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.meta}>From: {item.sender}</Text>
        <Text style={styles.meta}>To: {item.receiver}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Transactions</Text>
        <TouchableOpacity onPress={toggleInsights}>
          <Ionicons name="bulb-outline" size={26} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          value={filterText}
          onChangeText={setFilterText}
        />

        <View style={styles.sortRow}>
          {["date", "amount", "receiver"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.sortButton,
                sortBy === option && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy(option as any)}
            >
              <Text
                style={[
                  styles.sortText,
                  sortBy === option && styles.sortTextActive,
                ]}
              >
                {option.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.datePickers}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Ionicons name="calendar-outline" size={18} color="#555" />
            <Text style={styles.dateText}>
              {startDate ? startDate.toDateString() : "Start Date"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Ionicons name="calendar-outline" size={18} color="#555" />
            <Text style={styles.dateText}>
              {endDate ? endDate.toDateString() : "End Date"}
            </Text>
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(e, d) => handleDateChange(e, d, "start")}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(e, d) => handleDateChange(e, d, "end")}
          />
        )}
      </View>

      {/* Paginated Transaction List */}
      <FlatList
        data={displayedData}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Slide-in AI Insights */}
      {showInsights && (
        <Animated.View
          style={[
            styles.insightsPanel,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <Text style={styles.aiTitle}>💡 AI Insights</Text>
          {insights.map((insight, i) => (
            <Text key={i} style={styles.aiText}>
              • {insight}
            </Text>
          ))}
        </Animated.View>
      )}

      {/* Modal for Transaction Details */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {selectedTransaction && (
              <>
                <Text style={styles.modalTitle}>{selectedTransaction.title}</Text>
                <Text>{selectedTransaction.description}</Text>
                <Text style={styles.modalLine}>
                  Amount: Ksh {selectedTransaction.amount}
                </Text>
                <Text>Sender: {selectedTransaction.sender}</Text>
                <Text>Receiver: {selectedTransaction.receiver}</Text>
                <Text>Date: {selectedTransaction.timestamp}</Text>
                <Text style={styles.confirmation}>
                  {selectedTransaction.confirmationMessage}
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 4,
  },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#333" },
  filtersContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "white",
    marginBottom: 8,
  },
  sortRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 8 },
  sortButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sortButtonActive: { backgroundColor: "#007bff22", borderColor: "#007bff" },
  sortText: { color: "#333" },
  sortTextActive: { color: "#007bff", fontWeight: "600" },
  datePickers: { flexDirection: "row", justifyContent: "space-between" },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dateText: { marginLeft: 6, color: "#333" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 6,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  title: { fontWeight: "bold", fontSize: 16, color: "#222" },
  amount: { fontWeight: "600" },
  description: { color: "#555", marginBottom: 4 },
  meta: { fontSize: 13, color: "#777" },
  timestamp: { fontSize: 12, color: "#999", marginTop: 6, textAlign: "right" },
  aiTitle: { fontSize: 16, fontWeight: "bold", color: "#0056b3", marginBottom: 10 },
  aiText: { color: "#333", fontSize: 14, marginBottom: 4 },
  insightsPanel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: Dimensions.get("window").width * 0.85,
    backgroundColor: "#e8f0ff",
    padding: 20,
    borderRightWidth: 1,
    borderRightColor: "#007bff",
    elevation: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    width: "85%",
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalLine: { marginVertical: 4 },
  confirmation: {
    backgroundColor: "#f1f8e9",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    color: "#2e7d32",
  },
  closeButton: {
    backgroundColor: "#007bff",
    padding: 10,
    marginTop: 14,
    alignItems: "center",
    borderRadius: 8,
  },
});
