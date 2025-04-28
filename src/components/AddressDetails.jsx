import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const AddressDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { address, location } = route.params || {};

  const [addressDetails, setAddressDetails] = useState({
    houseNumber: "",
    floor: "",
    buildingName: "",
    landmark: "",
    recipientName: "",
    recipientPhoneNumber: "",
  });

  const handleChange = (name, value) => {
    setAddressDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormComplete = () => {
    return (
      addressDetails.houseNumber.trim() !== "" &&
      addressDetails.floor.trim() !== "" &&
      addressDetails.recipientName.trim() !== "" &&
      addressDetails.recipientPhoneNumber.trim().length === 10
    );
  };

  const handleSubmit = () => {
    navigation.navigate("Payment", {
      address,
      location,
      addressDetails: {
        ...addressDetails,
        city: "Bhiwandi",
        state: "Maharashtra",
        pincode: "421302",
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      {[
        { name: "houseNumber", placeholder: "House No. *" },
        { name: "floor", placeholder: "Floor *" },
        { name: "buildingName", placeholder: "Building & Block No." },
        { name: "landmark", placeholder: "Landmark & Area Name (Optional)" },
        { name: "recipientName", placeholder: "Recipient Name *" },
        { name: "recipientPhoneNumber", placeholder: "Recipient Phone Number *" },
      ].map((field) => (
        <TextInput
          key={field.name}
          style={styles.input}
          placeholder={field.placeholder}
          value={addressDetails[field.name]}
          onChangeText={(text) => handleChange(field.name, text)}
          keyboardType={
            field.name === "recipientPhoneNumber" ? "phone-pad" : "default"
          }
          maxLength={field.name === "recipientPhoneNumber" ? 10 : undefined}
        />
      ))}

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, !isFormComplete() && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!isFormComplete()}
      >
        <Text style={styles.saveButtonText}>Save & Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    flexGrow: 1,
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
  saveButton: {
    backgroundColor: "#FF4D6D",
    padding: 15,
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
