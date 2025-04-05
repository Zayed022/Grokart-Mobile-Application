import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const AddressDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { address, location } = route.params || {};

  const [houseNo, setHouseNo] = useState("");
  const [blockNo, setBlockNo] = useState("");
  const [landmark, setLandmark] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("Home");
  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");

  const handlePayment = () => {
    navigation.navigate("Payment",{address,location});
  };

  const isFormComplete = () => {
    return (
      houseNo.trim() !== "" &&
      blockNo.trim() !== "" &&
      receiverName.trim() !== "" &&
      phone.trim().length === 10
    );
  };

  return (
    <View style={styles.container}>
      {/* Saved Location */}
      <View style={styles.savedLocationCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.locationText}>{address || "No Address Found"}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="House No. & Floor*"
        value={houseNo}
        onChangeText={setHouseNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Building & Block No.*"
        value={blockNo}
        onChangeText={setBlockNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Landmark & Area Name (Optional)"
        value={landmark}
        onChangeText={setLandmark}
      />

      {/* Address Label Selection */}
      <Text style={styles.labelTitle}>Add Address Label</Text>
      <View style={styles.labelContainer}>
        {["Home", "Work", "Other"].map((label) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.labelButton,
              selectedLabel === label && styles.selectedLabel,
            ]}
            onPress={() => setSelectedLabel(label)}
          >
            <Text
              style={[
                styles.labelText,
                selectedLabel === label && { color: "white" },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Receiver Details */}
      <Text style={styles.labelTitle}>Receiver Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={receiverName}
        onChangeText={setReceiverName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        maxLength={10}
      />

      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          !isFormComplete() && styles.disabledButton,
        ]}
        onPress={handlePayment}
        disabled={!isFormComplete()}
      >
        <Text style={styles.saveButtonText}>Save & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    margin: 15,
  },
  savedLocationCard: {
    backgroundColor: "#6C41EC",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  locationText: {
    color: "white",
    fontWeight: "bold",
  },
  subText: {
    color: "white",
    fontSize: 12,
  },
  changeText: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  labelTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 10,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#6C41EC",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedLabel: {
    backgroundColor: "#6C41EC",
  },
  labelText: {
    color: "#6C41EC",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#FF4D6D",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AddressDetails;
