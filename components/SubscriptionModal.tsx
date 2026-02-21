import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { useSubscription } from '../contexts/SubscriptionContext';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SubscriptionModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isVisible, onClose }) => {
  const { products, purchaseSubscription, loading, error, isPremium } = useSubscription();

  const handlePurchase = async (productId: string) => {
    if (isPremium) {
      onClose();
      return;
    }
    const success = await purchaseSubscription(productId);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={30} color="#6a4c93" />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.modalTitle}>Unlock Premium Features</Text>
            <Text style={styles.modalSubtitle}>
              Get unlimited access to detailed food analysis, personalized recommendations, and more!
            </Text>

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6a4c93" />
                <Text style={styles.loadingText}>Loading plans...</Text>
              </View>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            {!loading && products.length === 0 && (
              <Text style={styles.noProductsText}>No subscription products available. Please try again later.</Text>
            )}

            {!loading && products.length > 0 && products.map((product) => (
              <TouchableOpacity
                key={product.productId}
                style={styles.productCard}
                onPress={() => handlePurchase(product.productId)}
                disabled={loading || isPremium}
              >
                <View style={styles.productHeader}>
                  <Text style={styles.productTitle}>{product.title}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                </View>
                <Text style={styles.productDescription}>{product.description}</Text>
                {product.productId === 'com.grsdev.canieat.subscription.annual' && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>BEST VALUE</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            <Text style={styles.trialInfo}>
              Enjoy a 7-day free trial with any subscription! Cancel anytime.
            </Text>

            <TouchableOpacity
              style={styles.restoreButton}
              onPress={() => useSubscription().restorePurchases()}
              disabled={loading}
            >
              <Text style={styles.restoreButtonText}>Restore Purchases</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimerText}>
              Subscriptions are managed through your App Store/Google Play account.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flex: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 25,
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  noProductsText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingVertical: 20,
  },
  productCard: {
    width: '100%',
    backgroundColor: '#f0ebf7',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#6a4c93',
    position: 'relative',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a4c93',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6a4c93',
  },
  productDescription: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  trialInfo: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  restoreButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
  },
  restoreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 10,
  },
});
