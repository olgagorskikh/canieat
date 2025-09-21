import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SubscriptionModal } from './SubscriptionModal';
import Ionicons from '@expo/vector-icons/Ionicons';

export const SubscriptionStatus: React.FC = () => {
  const { isPremium, isTrial, trialDaysRemaining, subscriptionStatus } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  if (isPremium) {
    return (
      <View style={styles.premiumContainer}>
        <View style={styles.premiumHeader}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.premiumTitle}>CanIEat Premium</Text>
        </View>
        <Text style={styles.premiumText}>
          You have unlimited access to all premium features!
        </Text>
        {subscriptionStatus.expirationDate && (
          <Text style={styles.expirationText}>
            Next billing: {new Date(subscriptionStatus.expirationDate).toLocaleDateString()}
          </Text>
        )}
      </View>
    );
  }

  if (isTrial && trialDaysRemaining > 0) {
    return (
      <View style={styles.trialContainer}>
        <View style={styles.trialHeader}>
          <Ionicons name="time" size={20} color="#4CAF50" />
          <Text style={styles.trialTitle}>Free Trial Active</Text>
        </View>
        <Text style={styles.trialText}>
          {trialDaysRemaining} days remaining in your free trial
        </Text>
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => setShowSubscriptionModal(true)}
        >
          <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.freeContainer}>
      <View style={styles.freeHeader}>
        <Ionicons name="lock-closed" size={20} color="#6a4c93" />
        <Text style={styles.freeTitle}>Free Version</Text>
      </View>
      <Text style={styles.freeText}>
        Upgrade to Premium for unlimited access to all features
      </Text>
      <TouchableOpacity
        style={styles.upgradeButton}
        onPress={() => setShowSubscriptionModal(true)}
      >
        <Text style={styles.upgradeButtonText}>Start Free Trial</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  premiumContainer: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 8,
  },
  premiumText: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 4,
  },
  expirationText: {
    fontSize: 12,
    color: '#4caf50',
    fontStyle: 'italic',
  },
  trialContainer: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  trialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginLeft: 8,
  },
  trialText: {
    fontSize: 14,
    color: '#E65100',
    marginBottom: 12,
  },
  freeContainer: {
    backgroundColor: '#f3e5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#6a4c93',
  },
  freeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  freeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a4c93',
    marginLeft: 8,
  },
  freeText: {
    fontSize: 14,
    color: '#6a4c93',
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: '#6a4c93',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
