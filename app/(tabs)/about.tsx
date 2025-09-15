import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>🍓 About CanIEat</Text>
        <Text style={styles.subtitle}>Pregnancy Food Safety Guide</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 What is CanIEat?</Text>
          <Text style={styles.sectionText}>
            CanIEat is an AI-powered food safety guide designed specifically for pregnant women. 
            Our app provides instant, reliable guidance on food safety during pregnancy based on 
            official UK government medical guidelines.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ Our Sources</Text>
          <Text style={styles.sectionText}>
            All recommendations are based on official NHS medical guidelines, including:
          </Text>
          <View style={styles.sourceList}>
            <Text style={styles.sourceItem}>• NHS Foods to Avoid in Pregnancy</Text>
            <Text style={styles.sourceItem}>• NHS Vitamins and Nutrition Guidelines</Text>
            <Text style={styles.sourceItem}>• NHS Keeping Well During Pregnancy</Text>
            <Text style={styles.sourceItem}>• NHS Pregnancy Health Guidelines</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 Official Sources</Text>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => openLink('https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/')}
          >
            <Text style={styles.linkText}>NHS - Foods to Avoid in Pregnancy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => openLink('https://www.nhs.uk/pregnancy/keeping-well/vitamins-supplements-and-nutrition/')}
          >
            <Text style={styles.linkText}>NHS - Vitamins and Nutrition in Pregnancy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => openLink('https://www.nhs.uk/pregnancy/keeping-well/')}
          >
            <Text style={styles.linkText}>NHS - Keeping Well During Pregnancy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Important Disclaimer</Text>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              This app provides general guidance only and is not a substitute for professional medical advice. 
              Always consult your healthcare provider, midwife, or doctor for personalized medical advice during pregnancy.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 How It Works</Text>
          <Text style={styles.sectionText}>
            Our AI analyzes your food queries using advanced language models trained on medical literature. 
            The system provides recommendations based on current UK medical guidelines for pregnancy nutrition, 
            helping you make informed decisions about food safety.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 App Information</Text>
          <Text style={styles.sectionText}>
            <Text style={styles.bold}>Version:</Text> 1.0.0{'\n'}
            <Text style={styles.bold}>Platform:</Text> iOS & Android{'\n'}
            <Text style={styles.bold}>Last Updated:</Text> {new Date().toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for expecting mothers
          </Text>
          <Text style={styles.footerSubtext}>
            Always prioritize your health and consult healthcare professionals
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
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
    padding: 20,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#34495e',
  },
  sourceList: {
    marginTop: 10,
  },
  sourceItem: {
    fontSize: 14,
    lineHeight: 20,
    color: '#34495e',
    marginBottom: 5,
  },
  linkButton: {
    backgroundColor: '#f0ebf7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#8e7cc3',
  },
  linkText: {
    color: '#6a4c93',
    fontSize: 14,
    fontWeight: '500',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});
