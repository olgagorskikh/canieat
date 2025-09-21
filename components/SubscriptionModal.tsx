import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSubscription } from '../contexts/SubscriptionContext';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { products, purchaseSubscription, restorePurchases, isLoading } = useSubscription();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handlePurchase = async (productId: string) => {
    setSelectedProduct(productId);
    try {
      const success = await purchaseSubscription(productId);
      if (success) {
        Alert.alert(
          'Success!',
          'Your subscription has been activated. Enjoy unlimited access to CanIEat!',
          [
            {
              text: 'OK',
              onPress: () => {
                onSuccess?.();
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to purchase subscription. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during purchase. Please try again.');
    } finally {
      setSelectedProduct(null);
    }
  };

  const handleRestore = async () => {
    try {
      const success = await restorePurchases();
      if (success) {
        Alert.alert('Success!', 'Your purchases have been restored.');
        onSuccess?.();
        onClose();
      } else {
        Alert.alert('No Purchases', 'No previous purchases found to restore.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  };

  const getProductDisplayName = (productId: string) => {
    if (productId.includes('monthly')) return 'Monthly';
    if (productId.includes('annual')) return 'Annual';
    return 'Premium';
  };

  const getProductDescription = (productId: string) => {
    if (productId.includes('monthly')) return 'Perfect for trying out premium features';
    if (productId.includes('annual')) return 'Best value - Save 50% compared to monthly';
    return 'Unlock all premium features';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6a4c93" />
          </TouchableOpacity>
          <Text style={styles.title}>🍓 CanIEat Premium</Text>
          <Text style={styles.subtitle}>Unlock unlimited food safety guidance</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Premium Features:</Text>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Unlimited food safety queries</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Advanced nutrition analysis</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Personalized recommendations</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Priority customer support</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Ad-free experience</Text>
            </View>
          </View>

          <View style={styles.trialSection}>
            <View style={styles.trialBadge}>
              <Text style={styles.trialText}>7-Day Free Trial</Text>
            </View>
            <Text style={styles.trialDescription}>
              Start your free trial today. Cancel anytime during the trial period with no charges.
            </Text>
          </View>

          <View style={styles.productsSection}>
            {products.map((product) => (
              <TouchableOpacity
                key={product.productId}
                style={[
                  styles.productCard,
                  product.productId.includes('annual') && styles.recommendedCard,
                ]}
                onPress={() => handlePurchase(product.productId)}
                disabled={isLoading}
              >
                {product.productId.includes('annual') && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>BEST VALUE</Text>
                  </View>
                )}
                
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>
                    {getProductDisplayName(product.productId)}
                  </Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                </View>
                
                <Text style={styles.productDescription}>
                  {getProductDescription(product.productId)}
                </Text>
                
                {selectedProduct === product.productId && (
                  <ActivityIndicator size="small" color="#6a4c93" style={styles.loading} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerSection}>
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={isLoading}
            >
              <Text style={styles.restoreButtonText}>Restore Purchases</Text>
            </TouchableOpacity>
            
            <Text style={styles.disclaimerText}>
              Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period. 
              Your account will be charged for renewal within 24 hours prior to the end of the current period.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  benefitsSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 15,
    color: '#34495e',
    marginLeft: 10,
  },
  trialSection: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  trialBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  trialText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  trialDescription: {
    fontSize: 14,
    color: '#2e7d32',
    textAlign: 'center',
    lineHeight: 20,
  },
  productsSection: {
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendedCard: {
    borderColor: '#6a4c93',
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#6a4c93',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6a4c93',
  },
  productDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  loading: {
    marginTop: 10,
  },
  footerSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  restoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  restoreButtonText: {
    color: '#6a4c93',
    fontSize: 16,
    fontWeight: '500',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 16,
  },
});
