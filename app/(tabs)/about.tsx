import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { SubscriptionStatus } from '../../components/SubscriptionStatus';
import { isTablet } from '../../utils/deviceUtils';

export default function AboutScreen() {
  const { subscriptionStatus, isPremium, expireTrialForTesting, resetTrialForTesting } = useSubscription();
  const [testModeLoading, setTestModeLoading] = useState(false);
  const isTabletDevice = useMemo(() => isTablet(), []);

  // Calculate trial days remaining
  const getTrialDaysRemaining = () => {
    if (!subscriptionStatus?.isTrial || !subscriptionStatus?.trialEndDate) {
      return null;
    }
    
    const trialEndDate = new Date(subscriptionStatus.trialEndDate);
    const now = new Date();
    const diffTime = trialEndDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const trialDaysRemaining = getTrialDaysRemaining();

  const handleExpireTrial = async () => {
    Alert.alert(
      'Expire Trial?',
      'This will immediately expire your free trial. This is for App Store review testing only.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Expire Trial',
          style: 'destructive',
          onPress: async () => {
            setTestModeLoading(true);
            try {
              await expireTrialForTesting();
              Alert.alert('Success', 'Trial has been expired. The app will now show the expired trial state.');
            } catch (error) {
              Alert.alert('Error', 'Failed to expire trial');
            } finally {
              setTestModeLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleResetTrial = async () => {
    Alert.alert(
      'Reset Trial?',
      'This will give you a fresh 7-day trial. This is for App Store review testing only.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Trial',
          onPress: async () => {
            setTestModeLoading(true);
            try {
              await resetTrialForTesting();
              Alert.alert('Success', 'Trial has been reset to 7 days.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset trial');
            } finally {
              setTestModeLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{isTabletDevice ? 'About CanIEat' : '🍓 About CanIEat'}</Text>
          <Text style={styles.subtitle}>Pregnancy Food Safety Guide</Text>
        </View>

        <View style={styles.content}>
        {/* Premium Status Section */}
        {isPremium && (
          <View style={styles.premiumSection}>
            <Text style={styles.premiumTitle}>{isTabletDevice ? 'Premium User' : '⭐ Premium User'}</Text>
            <Text style={styles.premiumText}>
              Thank you for supporting CanIEat! You have full access to all premium features.
              {isTabletDevice ? '\n\nEnjoy unlimited detailed food analysis and personalized recommendations!' : '\n\n🎉 Enjoy unlimited detailed food analysis and personalized recommendations!'}
            </Text>
          </View>
        )}
        
        {/* Trial Status Section */}
        {!isPremium && trialDaysRemaining !== null && (
          <View style={styles.trialSection}>
            <Text style={styles.trialTitle}>{isTabletDevice ? 'Trial Status' : '⏰ Trial Status'}</Text>
            {trialDaysRemaining > 0 ? (
              <Text style={styles.trialText}>
                You have {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} left in your free trial!
                {'\n\n'}Enjoy full access to premium features during your trial period.
                {isTabletDevice ? '\n\nTip: Use this time to experience the full power of CanIEat\'s AI analysis!' : '\n\n💡 Use this time to experience the full power of CanIEat\'s AI analysis!'}
              </Text>
            ) : (
              <Text style={styles.trialExpiredText}>
                Your free trial has expired.{'\n\n'}
                Upgrade to Premium to continue using detailed food analysis and personalized recommendations.
                {isTabletDevice ? '\n\nPricing: $4.99/month or $49.99/year' : '\n\n💰 Premium: $4.99/month or $49.99/year'}
              </Text>
            )}
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isTabletDevice ? 'What is CanIEat?' : '📋 What is CanIEat?'}</Text>
          <Text style={styles.sectionText}>
            CanIEat is an AI-powered food safety guide designed specifically for pregnant women. 
            Our app provides instant, reliable guidance on food safety during pregnancy based on 
            official UK government medical guidelines.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isTabletDevice ? 'Key Features' : '🎯 Key Features'}</Text>
          <Text style={styles.sectionText}>
            • Instant food safety checks{'\n'}
            • UK government medical guidelines{'\n'}
            • AI-powered analysis{'\n'}
            • User-friendly interface{'\n'}
            • Comprehensive information
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isTabletDevice ? 'Official Sources' : '📚 Official Sources'}</Text>
          <Text style={styles.sectionText}>
            All recommendations are based on official UK government medical advice from:
            {'\n\n'}• NHS Pregnancy Guidelines{'\n'}
            • Food Standards Agency{'\n'}
            • Royal College of Obstetricians and Gynaecologists
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isTabletDevice ? 'Medical Disclaimer' : '⚠️ Medical Disclaimer'}</Text>
          <Text style={styles.sectionText}>
            This app provides general guidance only and is not a substitute for professional medical advice. 
            Always consult your healthcare provider, midwife, or doctor for personalized medical advice during pregnancy.
          </Text>
        </View>

        {/* TEST MODE SECTION - For App Store Review Only */}
        <View style={styles.testSection}>
          <Text style={styles.testTitle}>{isTabletDevice ? 'App Store Review Test Mode' : '🧪 App Store Review Test Mode'}</Text>
          <Text style={styles.testDescription}>
            This section is for App Store reviewers to test the trial expiration flow.
          </Text>
          
          <View style={styles.testButtons}>
            <TouchableOpacity 
              style={[styles.testButton, styles.expireButton]}
              onPress={handleExpireTrial}
              disabled={testModeLoading}
            >
              <Text style={styles.testButtonText}>
                {testModeLoading ? (isTabletDevice ? 'Loading...' : '⏳ Loading...') : (isTabletDevice ? 'Expire Trial Now' : '⏰ Expire Trial Now')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.testButton, styles.resetButton]}
              onPress={handleResetTrial}
              disabled={testModeLoading}
            >
              <Text style={styles.testButtonText}>
                {testModeLoading ? (isTabletDevice ? 'Loading...' : '⏳ Loading...') : (isTabletDevice ? 'Reset Trial (7 days)' : '🔄 Reset Trial (7 days)')}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.testNote}>
            Note: After expiring the trial, you can test the subscription purchase flow. 
            In sandbox mode, test purchases won't charge your account.
          </Text>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
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
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a4c93',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
    flexShrink: 1,
  },
  trialSection: {
    backgroundColor: '#fff3cd',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  trialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10,
  },
  trialText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#856404',
  },
  trialExpiredText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#721c24',
  },
  premiumSection: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 10,
  },
  premiumText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#27ae60',
  },
  testSection: {
    backgroundColor: '#f0f4ff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4a90e2',
    borderStyle: 'dashed',
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 10,
    textAlign: 'center',
  },
  testDescription: {
    fontSize: 14,
    color: '#5a6c7d',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  testButtons: {
    gap: 10,
    marginBottom: 15,
  },
  testButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expireButton: {
    backgroundColor: '#e74c3c',
  },
  resetButton: {
    backgroundColor: '#27ae60',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testNote: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    lineHeight: 18,
    textAlign: 'center',
  },
});