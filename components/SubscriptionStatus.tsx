import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSubscription } from '../contexts/SubscriptionContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export const SubscriptionStatus: React.FC = () => {
  const { isPremium, subscriptionStatus, loading, error } = useSubscription();

  if (loading) {
    return (
      <View style={styles.statusContainer}>
        <ActivityIndicator size="small" color="#6a4c93" />
        <Text style={styles.statusText}>Loading subscription status...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.statusContainer, styles.errorContainer]}>
        <Ionicons name="warning" size={20} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const statusText = isPremium ? 'Premium User' : 'Free Version';
  const statusIcon = isPremium ? 'star' : 'person';
  const statusColor = isPremium ? '#27ae60' : '#f39c12';

  return (
    <View style={[styles.statusContainer, { borderColor: statusColor }]}>
      <Ionicons name={statusIcon} size={20} color={statusColor} style={styles.statusIcon} />
      <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
      {isPremium && subscriptionStatus?.expirationDate && (
        <Text style={styles.expirationText}>
          Expires: {new Date(subscriptionStatus.expirationDate).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    borderColor: '#e74c3c',
  },
  statusIcon: {
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    marginLeft: 10,
  },
  expirationText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 'auto',
  },
});
