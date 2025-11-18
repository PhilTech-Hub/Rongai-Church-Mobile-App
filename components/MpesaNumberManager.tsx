import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { usePaymentProfile } from '../contexts/PaymentProfileContext';

interface MpesaNumberManagerProps {
  visible: boolean;
  onClose: () => void;
  onSelectNumber?: (phoneNumber: string) => void;
}

export default function MpesaNumberManager({ 
  visible, 
  onClose, 
  onSelectNumber 
}: MpesaNumberManagerProps) {
  const { 
    paymentProfile, 
    addMpesaNumber, 
    removeMpesaNumber, 
    setDefaultMpesaNumber,
    isLoading 
  } = usePaymentProfile();
  
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddMpesaNumber = async () => {
    if (!newPhoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    try {
      await addMpesaNumber(newPhoneNumber);
      setNewPhoneNumber('');
      setShowAddForm(false);
    } catch {
      Alert.alert('Error', 'Failed to add M-Pesa number. Please try again.');
    }
  };

  const handleRemoveMpesaNumber = (mpesaNumber: any) => {
    Alert.alert(
      'Remove M-Pesa Number',
      `Are you sure you want to remove ${mpesaNumber.phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeMpesaNumber(mpesaNumber.id)
        }
      ]
    );
  };

  const handleSetDefault = (mpesaNumber: any) => {
    if (mpesaNumber.isVerified) {
      setDefaultMpesaNumber(mpesaNumber.id);
    } else {
      Alert.alert('Verification Required', 'Please verify this number before setting it as default.');
    }
  };

  const renderMpesaNumber = ({ item }: { item: any }) => (
    <View style={[
      styles.mpesaNumberCard,
      !item.isVerified && styles.unverifiedCard
    ]}>
      <View style={styles.numberInfo}>
        <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
        <View style={styles.statusContainer}>
          {item.isVerified ? (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          ) : (
            <View style={styles.pendingBadge}>
              <Ionicons name="time-outline" size={16} color="#f59e0b" />
              <Text style={styles.pendingText}>Verifying...</Text>
            </View>
          )}
          {item.isDefault && item.isVerified && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.actions}>
        {!item.isDefault && item.isVerified && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSetDefault(item)}
          >
            <Ionicons name="star-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
        {onSelectNumber && item.isVerified && (
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => {
              onSelectNumber(item.phoneNumber);
              onClose();
            }}
          >
            <Text style={styles.selectText}>Use</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleRemoveMpesaNumber(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {onSelectNumber ? 'Select M-Pesa Number' : 'Your M-Pesa Numbers'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Add your M-Pesa numbers to make payments quickly
          </Text>

          {!showAddForm ? (
            <>
              <FlatList
                data={paymentProfile?.mpesaNumbers || []}
                renderItem={renderMpesaNumber}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Ionicons name="phone-portrait-outline" size={48} color="#9ca3af" />
                    <Text style={styles.emptyText}>No M-Pesa numbers added</Text>
                    <Text style={styles.emptySubtext}>
                      Add your M-Pesa number to make instant payments
                    </Text>
                  </View>
                }
              />

              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddForm(true)}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add M-Pesa Number</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>Add M-Pesa Number</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="07XX XXX XXX"
                value={newPhoneNumber}
                onChangeText={setNewPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
              />
              <Text style={styles.helpText}>
                Enter your M-Pesa number. We&apos;ll send a verification code.
              </Text>
              
              <View style={styles.formActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddForm(false);
                    setNewPhoneNumber('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleAddMpesaNumber}
                  disabled={isLoading}
                >
                  <Text style={styles.saveButtonText}>
                    {isLoading ? 'Adding...' : 'Add & Verify'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  mpesaNumberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  unverifiedCard: {
    backgroundColor: '#fffbeb',
    borderColor: '#fef3c7',
    borderWidth: 1,
  },
  numberInfo: {
    flex: 1,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pendingText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  defaultBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    color: '#92400e',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  selectButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addForm: {
    padding: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1f2937',
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 16,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});