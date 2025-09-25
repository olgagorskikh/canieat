import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { PremiumGate } from '../../components/PremiumGate';
import { useSubscription } from '../../contexts/SubscriptionContext';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const { isPremium } = useSubscription();

  const handleSearch = () => {
    if (!searchText.trim()) {
      Alert.alert('Please enter a food item to search');
      return;
    }

    // Simple mock response for testing
    setResult(`Mock result for: ${searchText}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>🍓 CanIEat</Text>
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
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}

      {/* Premium Feature: Detailed Analysis */}
      {result && (
        <PremiumGate featureName="Detailed Analysis">
          <View style={styles.premiumFeature}>
            <Text style={styles.premiumFeatureTitle}>🔍 Detailed Analysis</Text>
            <Text style={styles.premiumFeatureText}>
              Get a comprehensive breakdown of nutritional benefits, potential risks, 
              and personalized recommendations for {searchText}.
            </Text>
            <View style={styles.premiumFeatureContent}>
              <Text style={styles.premiumFeatureContentText}>
                • Nutritional breakdown and benefits{'\n'}
                • Potential risks and precautions{'\n'}
                • Serving size recommendations{'\n'}
                • Alternative food suggestions{'\n'}
                • Preparation tips for safety
              </Text>
            </View>
          </View>
        </PremiumGate>
      )}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ This app provides general guidance only. Always consult your healthcare provider or midwife for personalized medical advice.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
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
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#8e7cc3',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#000000',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: '#f0ebf7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#8e7cc3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonText: {
    color: '#6a4c93',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  disclaimer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    marginTop: 20,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#856404',
    textAlign: 'center',
  },
  premiumFeature: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumFeatureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  premiumFeatureText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 15,
  },
  premiumFeatureContent: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6a4c93',
  },
  premiumFeatureContentText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 22,
  },
});