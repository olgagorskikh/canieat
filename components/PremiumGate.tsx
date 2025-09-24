import React, { useState, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SubscriptionModal } from './SubscriptionModal';
import Ionicons from '@expo/vector-icons/Ionicons';

interface PremiumGateProps {
  children: ReactNode;
  featureName: string;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({ children, featureName }) => {
  const { isPremium } = useSubscription();
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.lockedContent}>
        <Ionicons name="lock-closed" size={30} color="#9b59b6" style={styles.lockIcon} />
        <Text style={styles.lockedText}>
          Unlock "{featureName}" and more with Premium!
        </Text>
        <TouchableOpacity style={styles.upgradeButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
      <SubscriptionModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  lockedContent: {
    alignItems: 'center',
  },
  lockIcon: {
    marginBottom: 10,
  },
  lockedText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '500',
  },
  upgradeButton: {
    backgroundColor: '#6a4c93',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
