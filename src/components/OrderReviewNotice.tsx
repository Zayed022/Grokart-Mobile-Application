import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const OrderReviewNotice = () => {
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate("CancellationPolicy" as never);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.warningText}>
        Review your order to avoid cancellation.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.noteText}>
          NOTE: Orders cannot be cancelled and are non-refundable once packed
          for delivery.
        </Text>

        <TouchableOpacity onPress={handleNavigate}>
          <Text style={styles.linkText}>Read Cancellation Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderReviewNotice;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 32,
  },
  warningText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400E",
    backgroundColor: "#FEF3C7",
    borderColor: "#FCD34D",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  infoBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  noteText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    marginBottom: 8,
  },
  linkText: {
    fontSize: 13,
    color: "#2563EB",
    textDecorationLine: "underline",
  },
});
