import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { PremiumGate } from '../../components/PremiumGate';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { checkFoodSafety } from '../../services/openaiService';
import { safeString, safeIncludes } from '../../utils/stringUtils';
import { isTablet, splitTextForRendering, simplifyTextForTablet } from '../../utils/deviceUtils';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const { isPremium, subscriptionStatus } = useSubscription();
  
  // Detect if device is a tablet for safer text rendering
  const isTabletDevice = useMemo(() => isTablet(), []);

  // Render result text safely for tablets by splitting into chunks
  const renderResultText = (text: string) => {
    const safeText = safeString(text, 1500, '');
    
    // Remove the first line (✅ SAFE TO EAT, ❌ NOT RECOMMENDED, etc.) 
    // since it's already shown in the banner
    const lines = safeText.split('\n');
    const firstLine = lines[0] || '';
    
    // Check if first line is a status indicator
    const isStatusLine = 
      firstLine.includes('✅') || firstLine.includes('❌') || 
      firstLine.includes('🔒') || firstLine.includes('🍓') ||
      firstLine.includes('SAFE TO EAT') || firstLine.includes('NOT RECOMMENDED') ||
      firstLine.includes('PREMIUM REQUIRED') || firstLine.includes('FREE ANALYSIS');
    
    // Remove first line if it's a status indicator
    const textWithoutStatus = isStatusLine ? lines.slice(1).join('\n').trim() : safeText;
    
    const displayText = isTabletDevice ? simplifyTextForTablet(textWithoutStatus) : textWithoutStatus;
    
    if (isTabletDevice) {
      // Split text into smaller chunks to prevent CoreText layout crashes on iPad
      const chunks = splitTextForRendering(displayText, 350);
      return chunks.map((chunk, index) => (
        <Text 
          key={index}
          style={styles.resultText}
          selectable={true}
        >
          {chunk}
        </Text>
      ));
    }
    
    // iPhone: render normally
    return (
      <Text 
        style={styles.resultText}
        selectable={true}
      >
        {displayText}
      </Text>
    );
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert('Please enter a food item to search');
      return;
    }

    // Clear previous results first
    setResult(null);

    try {
      // Check if user has access (premium or active trial)
      const hasAccess = isPremium || (subscriptionStatus?.isTrial && !subscriptionStatus?.isTrialExpired);

      if (hasAccess) {
        // User has premium or active trial - get real AI analysis
        try {
          // Safely handle the search text with enhanced validation
          const safeSearchText = String(searchText || '').trim().substring(0, 100);
          if (!safeSearchText || safeSearchText.length === 0) {
            throw new Error('Invalid search text');
          }

          const analysis = await checkFoodSafety(safeSearchText);
          
          // Safely format the result with enhanced length limits and null checks
          const safeReason = safeString(analysis?.reason, 500, 'No reason provided');
          const safeAdditionalInfo = safeString(analysis?.additionalInfo, 1000, 'No additional information');
          
          // Format result (trial status shown in yellow bar, not here)
          if (analysis?.canEat === true) {
            setResult(`✅ SAFE TO EAT\n\n${safeReason}\n\nAdditional Information:\n${safeAdditionalInfo}`);
          } else {
            setResult(`❌ NOT RECOMMENDED\n\n${safeReason}\n\nAdditional Information:\n${safeAdditionalInfo}`);
          }
        } catch (aiError) {
          console.error('Error getting food analysis:', aiError);
          const safeSearchText = safeString(searchText, 50, 'this food');
          setResult(`❌ Error\n\nUnable to analyze ${safeSearchText} at this time. Please try again later.`);
        }
      } else {
        // No access - show upgrade prompt
        const safeSearchText = safeString(searchText, 50, '');
        if (subscriptionStatus?.isTrialExpired) {
          setResult(`🔒 PREMIUM REQUIRED\n\nYour 7-day free trial has expired.\n\nFREE: Basic safety info\nPREMIUM: Detailed AI analysis with UK medical guidelines\n\nUpgrade to Premium for detailed ${safeSearchText} analysis.\n\nPricing: $4.99/month or $49.99/year`);
        } else {
          setResult(`🍓 FREE ANALYSIS for: ${safeSearchText}\n\n✅ Generally safe to eat during pregnancy\n\n🔍 PREMIUM FEATURES:\n• Detailed AI analysis\n• UK medical guidelines\n• Personalized recommendations\n• 7-day free trial available!\n\nUpgrade to Premium for comprehensive analysis.`);
        }
      }
    } catch (error) {
      console.error('Error in search handler:', error);
      setResult(`❌ Error\n\nSomething went wrong. Please try again.`);
    }
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
          <Text style={styles.title}>{isTabletDevice ? 'CanIEat' : '🍓 CanIEat'}</Text>
          <Text style={styles.subtitle}>Pregnancy Food Safety Guide</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="What food/dish would you like to check?"
            placeholderTextColor="#7f8c8d"
            value={searchText}
            onChangeText={setSearchText}
            multiline={false}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            maxLength={100}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

      {result && (
        <View style={styles.resultContainer}>
          {(safeIncludes(result, '✅ SAFE TO EAT') || safeIncludes(result, '[SAFE]')) ? (
            <View style={styles.safeBanner}>
              <Text style={styles.safeBannerText}>{isTabletDevice ? 'SAFE TO EAT' : '✅ SAFE TO EAT'}</Text>
            </View>
          ) : (safeIncludes(result, '🔒 PREMIUM REQUIRED') || safeIncludes(result, '🔒 Premium Required') || safeIncludes(result, '[PREMIUM]')) ? (
            <View style={styles.premiumBanner}>
              <Text style={styles.premiumBannerText}>{isTabletDevice ? 'PREMIUM REQUIRED' : '🔒 PREMIUM REQUIRED'}</Text>
            </View>
          ) : (safeIncludes(result, '❌ NOT RECOMMENDED') || safeIncludes(result, '[NOT RECOMMENDED]')) ? (
            <View style={styles.notRecommendedBanner}>
              <Text style={styles.notRecommendedBannerText}>{isTabletDevice ? 'NOT RECOMMENDED' : '❌ NOT RECOMMENDED'}</Text>
            </View>
          ) : null}
          <View style={styles.resultContent}>
            {renderResultText(result)}
          </View>
        </View>
      )}

      {/* Premium Feature: Detailed Analysis - Only show for users without access */}
      {result && !(isPremium || (subscriptionStatus?.isTrial && !subscriptionStatus?.isTrialExpired)) && (
        <PremiumGate featureName="Detailed Analysis">
          <View style={styles.premiumFeature}>
            <Text style={styles.premiumFeatureTitle}>🔍 PREMIUM: Detailed Analysis</Text>
            <Text style={styles.premiumFeatureText}>
              Get a comprehensive breakdown of nutritional benefits, potential risks, 
              and personalized recommendations for {searchText}.
            </Text>
            <View style={styles.premiumFeatureContent}>
              <Text style={styles.premiumFeatureContentText}>
                PREMIUM FEATURES:{'\n'}
                • Detailed AI analysis with UK medical guidelines{'\n'}
                • Nutritional breakdown and benefits{'\n'}
                • Potential risks and precautions{'\n'}
                • Serving size recommendations{'\n'}
                • Alternative food suggestions{'\n'}
                • Preparation tips for safety{'\n'}
                • 7-day free trial available!
              </Text>
            </View>
            <View style={styles.pricingInfo}>
              <Text style={styles.pricingText}>
                💰 Pricing: $4.99/month or $49.99/year
              </Text>
            </View>
          </View>
        </PremiumGate>
      )}

      {/* Trial Status Section */}
      {!isPremium && subscriptionStatus?.isTrial && (
        <View style={styles.trialSection}>
          <Text style={styles.trialTitle}>{isTabletDevice ? 'Trial Status' : '⏰ Trial Status'}</Text>
          {subscriptionStatus.trialEndDate ? (
            (() => {
              const trialEndDate = new Date(subscriptionStatus.trialEndDate);
              const now = new Date();
              const diffTime = trialEndDate.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const trialDaysRemaining = Math.max(0, diffDays);
              
              return trialDaysRemaining > 0 ? (
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
              );
            })()
          ) : (
            <Text style={styles.trialText}>
              You're currently on a free trial! Enjoy full access to premium features.
              {isTabletDevice ? '\n\nTip: Experience the full power of CanIEat\'s AI analysis!' : '\n\n💡 Experience the full power of CanIEat\'s AI analysis!'}
            </Text>
          )}
        </View>
      )}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            {isTabletDevice ? 'Warning: ' : '⚠️ '}This app provides general guidance only. Always consult your healthcare provider or midwife for personalized medical advice.
          </Text>
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
    paddingTop: 60,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 30,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchButton: {
    backgroundColor: '#6a4c93',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  safeBanner: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  safeBannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumBanner: {
    backgroundColor: '#6a4c93',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  premiumBannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notRecommendedBanner: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  notRecommendedBannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContent: {
    padding: 20,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
    flexShrink: 1,
  },
  premiumFeature: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  premiumFeatureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a4c93',
    marginBottom: 10,
  },
  premiumFeatureText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
    marginBottom: 15,
  },
  premiumFeatureContent: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  premiumFeatureContentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#7f8c8d',
  },
  disclaimer: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  pricingInfo: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#27ae60',
  },
  pricingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
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
});