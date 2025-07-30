import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';

const CustomerCare: React.FC = () => {
  const phoneNumber = '+917498881947';
  const email = 'zayedans022@gmail.com';

  const links = {
    privacy: 'https://www.grokartapp.com/policy',
    refund: 'https://www.grokartapp.com/cancellation',
    terms: 'https://www.grokartapp.com/terms-conditions',
  };

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to open the link.');
    }
  };

  const handleCall = () => Linking.openURL(`tel:${phoneNumber}`);
  const handleEmail = () => Linking.openURL(`mailto:${email}`);
  const handleFeedback = () => Alert.alert('Feedback', 'Redirecting to Feedback form...');
  const handleFAQs = () => Alert.alert('FAQs', 'Coming soon...');
  const handleChatSupport = () => Alert.alert('Live Chat', 'Feature coming soon...');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🤝 Customer Support</Text>
      <Text style={styles.subheading}>We’re always here to assist you!</Text>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>

        <TouchableOpacity style={styles.card} onPress={handleCall}>
          <Text style={styles.cardText}>📞 Call Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.secondary]} onPress={handleEmail}>
          <Text style={styles.cardText}>✉️ Email Support</Text>
        </TouchableOpacity>
      </View>

      {/* Help & Feedback */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Feedback</Text>

        <TouchableOpacity style={styles.linkRow} onPress={handleFAQs}>
          <Text style={styles.linkText}>❓ FAQs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkRow} onPress={handleChatSupport}>
          <Text style={styles.linkText}>💬 Live Chat Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkRow} onPress={handleFeedback}>
          <Text style={styles.linkText}>📝 Give Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* Legal & Policies */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal & Policies</Text>

        <TouchableOpacity style={styles.linkRow} onPress={() => openLink(links.privacy)}>
          <Text style={styles.linkText}>🔒 Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkRow} onPress={() => openLink(links.refund)}>
          <Text style={styles.linkText}>↩️ Cancellation & Refund Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkRow} onPress={() => openLink(links.terms)}>
          <Text style={styles.linkText}>📄 Terms & Conditions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },
  subheading: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  card: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  secondary: {
    backgroundColor: '#EF4444',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkRow: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 0.6,
    borderBottomColor: '#E5E7EB',
  },
  linkText: {
    fontSize: 15,
    color: '#1D4ED8',
    fontWeight: '500',
  },
});

export default CustomerCare;
