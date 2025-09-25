import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SubscriptionStatus } from '../../components/SubscriptionStatus';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>🍓 About CanIEat</Text>
        <Text style={styles.subtitle}>Pregnancy Food Safety Guide</Text>
      </View>

      <View style={styles.content}>
        <SubscriptionStatus />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 What is CanIEat?</Text>
          <Text style={styles.sectionText}>
            CanIEat is an AI-powered food safety guide designed specifically for pregnant women. 
            Our app provides instant, reliable guidance on food safety during pregnancy based on 
            official UK government medical guidelines.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Key Features</Text>
          <Text style={styles.sectionText}>
            • Instant food safety checks{'\n'}
            • UK government medical guidelines{'\n'}
            • AI-powered analysis{'\n'}
            • User-friendly interface{'\n'}
            • Comprehensive information
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Official Sources</Text>
          <Text style={styles.sectionText}>
            All recommendations are based on official UK government medical advice from:
            {'\n\n'}• NHS Pregnancy Guidelines{'\n'}
            • Food Standards Agency{'\n'}
            • Royal College of Obstetricians and Gynaecologists
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Medical Disclaimer</Text>
          <Text style={styles.sectionText}>
            This app provides general guidance only and is not a substitute for professional medical advice. 
            Always consult your healthcare provider, midwife, or doctor for personalized medical advice during pregnancy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👩‍💻 Developer</Text>
          <Text style={styles.sectionText}>
            Developed by Olga Gorskikh{'\n'}
            Made with ❤️ for expecting mothers
          </Text>
        </View>
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
  },
});