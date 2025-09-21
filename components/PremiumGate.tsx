import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SubscriptionModal } from './SubscriptionModal';
import Ionicons from '@expo/vector-icons/Ionicons';

interface PremiumGateProps {
  children: React.ReactNode;
  featureName?: string;
  showUpgradeButton?: boolean;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({
  children,
  featureName = 'this feature',
  showUpgradeButton = true,
}) => {
  const { isPremium, isTrial, trialDaysRemaining } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // If user is premium, show the content
  if (isPremium) {
    return <>{children}</>;
  }

  // If user is on trial, show content with trial indicator
  if (isTrial && trialDaysRemaining > 0) {
    return (
      <View style={styles.container}>
        {children}
        <View style={styles.trialBanner}>
          <Text style={styles.trialText}>
            🎉 Free trial: {trialDaysRemaining} days remaining
          </Text>
        </View>
      </View>
    );
  }

  // Show premium gate
  return (
    <View style={styles.container}>
      <View style={styles.gateContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={48} color="#6a4c93" />
        </View>
        
        <Text style={styles.title}>Premium Feature</Text>
        <Text style={styles.description}>
          {featureName} is available with CanIEat Premium. 
          Upgrade now to unlock unlimited access to all features.
        </Text>
        
        {showUpgradeButton && (
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => setShowSubscriptionModal(true)}
          >
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Premium includes:</Text>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark" size={16} color="#4CAF50" />
            <Text style={styles.benefitText}>Unlimited queries</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark" size={16} color="#4CAF50" />
            <Text style={styles.benefitText}>Advanced analysis</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark" size={16} color="#4CAF50" />
            <Text style={styles.benefitText}>7-day free trial</Text>
          </View>
        </View>
      </View>

      <SubscriptionModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSuccess={() => setShowSubscriptionModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0ebf7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  upgradeButton: {
    backgroundColor: '#6a4c93',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#6a4c93',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  benefitsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#34495e',
    marginLeft: 8,
  },
  trialBanner: {
    backgroundColor: '#e8f5e8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#c8e6c9',
  },
  trialText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
