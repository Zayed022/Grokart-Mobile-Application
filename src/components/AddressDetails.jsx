import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const AddressDetails = () => {
  const [houseNo, setHouseNo] = useState("");
  const [blockNo, setBlockNo] = useState("");
  const [landmark, setLandmark] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("Home");
  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <View style={styles.container}>
      {/* Saved Location */}
      <View style={styles.savedLocationCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.locationText}>Shahid Bhagat Singh Road</Text>
          <Text style={styles.subText}>16, Cusrow Baug Colony, Apollo...</Text>
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
            style={[styles.labelButton, selectedLabel === label && styles.selectedLabel]}
            onPress={() => setSelectedLabel(label)}
          >
            <Text style={[styles.labelText, selectedLabel === label && { color: "white" }]}>{label}</Text>
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
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
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
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AddressDetails;
