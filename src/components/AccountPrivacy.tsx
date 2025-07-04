import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const AccountPrivacy = () => {
  const navigation = useNavigation();

  const openEmail = () => {
    Linking.openURL('mailto:grokart.co@gmail.com');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Account Privacy and Policy</Text>

        <Text style={styles.paragraph}>
          We i.e. <Text style={styles.bold}>Grokart Commerce Private Limited</Text>, are committed to protecting
          the privacy and security of your personal information. Your privacy is important to us and maintaining
          your trust is paramount.
        </Text>

        <Text style={styles.paragraph}>
          This privacy policy explains how we collect, use, process and disclose information about you. By using
          our website/ app/ platform and affiliated services, you consent to the terms of our privacy policy
          ("Privacy Policy") in addition to our ‘Terms of Use.’
        </Text>

        <Text style={styles.paragraph}>
          We encourage you to read this privacy policy to understand the collection, use, and disclosure of your
          information from time to time, to keep yourself updated with the changes and updates that we make to
          this policy. This privacy policy describes our privacy practices for all websites, products and services
          that are linked to it.
        </Text>

        <Text style={styles.paragraph}>
          However, this policy does not apply to those affiliates and partners that have their own privacy policy.
          In such situations, we recommend that you read the privacy policy on the applicable site.
        </Text>

        <Text style={styles.paragraph}>
          Should you have any clarifications regarding this privacy policy, please write to us at{' '}
          <Text style={styles.email} onPress={openEmail}>
            grokart.co@gmail.com
          </Text>
          .
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountPrivacy;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
    color: '#111827',
  },
  email: {
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
});
