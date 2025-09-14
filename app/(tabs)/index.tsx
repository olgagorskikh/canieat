import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Keyboard, ScrollView } from 'react-native';
import { checkFoodSafety, FoodSafetyResponse } from '../../services/openaiService';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [result, setResult] = useState<FoodSafetyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert('Please enter a food item to search');
      return;
    }

    // Hide the keyboard when search is triggered
    Keyboard.dismiss();

    setLoading(true);
    try {
      const response = await checkFoodSafety(searchText.trim());
      setResult(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to check food safety. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = () => {
    if (!result) return '#666';
    return result.canEat ? '#4CAF50' : '#F44336';
  };

  const getResultIcon = () => {
    if (!result) return '';
    return result.canEat ? '✅' : '❌';
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
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultContainer}>
          <View style={[styles.resultHeader, { backgroundColor: getResultColor() }]}>
            <Text style={styles.resultIcon}>{getResultIcon()}</Text>
            <Text style={styles.resultTitle}>
              {result.canEat ? 'SAFE TO EAT' : 'NOT RECOMMENDED'}
            </Text>
          </View>
          
          <View style={styles.resultContent}>
            <Text style={styles.resultReason}>{result.reason}</Text>
            
            {result.additionalInfo && (
              <View style={styles.additionalInfo}>
                <Text style={styles.additionalInfoTitle}>Additional Information:</Text>
                <Text style={styles.additionalInfoText}>{result.additionalInfo}</Text>
              </View>
            )}
          </View>
        </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  resultIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContent: {
    padding: 20,
  },
  resultReason: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
    marginBottom: 15,
  },
  additionalInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  additionalInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  additionalInfoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#34495e',
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
});
