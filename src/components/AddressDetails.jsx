import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const AddressDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { address = "", location } = route.params || {};

  const [selectedType, setSelectedType] = useState("Home");
  const [addressDetails, setAddressDetails] = useState({
    houseNumber: "",
    floor: "",
    buildingName: "",
    landmark: "",
    recipientName: "",
    recipientPhoneNumber: "",
  });

  const scrollRef = useRef();

  const handleChange = (key, value) => {
    setAddressDetails((prev) => ({ ...prev, [key]: value }));
  };

  const isValidPhone = (num) => /^\d{10}$/.test(num);

  const isComplete = () => {
    return (
      addressDetails.houseNumber &&
      addressDetails.floor &&
      addressDetails.recipientName &&
      isValidPhone(addressDetails.recipientPhoneNumber)
    );
  };

  const handleSubmit = () => {
    if (!isComplete()) {
      Alert.alert("Error", "Please complete all required fields correctly.");
      return;
    }
    navigation.navigate("Payment", {
      address,
      location,
      addressType: selectedType,
      addressDetails: {
        ...addressDetails,
        city: "Bhiwandi",
        state: "Maharashtra",
        pincode: "421302",
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Add Address</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Address Details</Text>

        

        {/* Address Card */}
        <View style={styles.addressCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.addressText}>{address}</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Info box */}
        <View style={styles.infoBox}>
          <Icon name="information-circle" size={18} color="#FFC107" />
          <Text style={styles.infoText}>
            A detailed address helps our delivery partners reach your doorstep easily.
          </Text>
        </View>

        {/* Address Type */}
        <View style={styles.addressTypeWrapper}>
          {[
            { label: "Home", icon: "home-outline" },
            { label: "Work", icon: "briefcase-outline" },
            { label: "Other", icon: "location-outline" },
          ].map(({ label, icon }) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.typeButton,
                selectedType === label && styles.typeButtonSelected,
              ]}
              onPress={() => setSelectedType(label)}
            >
              <Icon
                name={icon}
                size={18}
                color={selectedType === label ? "#fff" : "#444"}
                style={{ marginBottom: 4 }}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === label && styles.typeButtonTextSelected,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Fields */}
        {[
          { key: "houseNumber", placeholder: "House No. *" },
          { key: "floor", placeholder: "Floor *" },
          { key: "buildingName", placeholder: "Building & Block No." },
          { key: "landmark", placeholder: "Landmark & Area Name (Optional)" },
          { key: "recipientName", placeholder: "Recipient Name *" },
          {
            key: "recipientPhoneNumber",
            placeholder: "Recipient Phone Number *",
            keyboardType: "phone-pad",
            maxLength: 10,
          },
        ].map(({ key, placeholder, ...props }) => (
          <TextInput
            key={key}
            placeholder={placeholder}
            placeholderTextColor="#aaa"
            style={[
              styles.input,
              key === "recipientPhoneNumber" &&
                addressDetails[key] &&
                !isValidPhone(addressDetails[key]) && {
                  borderColor: "#FF4D6D",
                },
            ]}
            value={addressDetails[key]}
            onChangeText={(text) => handleChange(key, text)}
            {...props}
          />
        ))}

        {/* Save & Continue */}
        <TouchableOpacity
          style={[styles.saveButton, !isComplete() && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!isComplete()}
        >
          <Text style={styles.saveButtonText}>Save & Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navbarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
    
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#856404",
    flex: 1,
  },
  addressCard: {
    backgroundColor: "#6C41EC",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  addressText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  changeText: {
    color: "#FFD700",
    fontWeight: "600",
  },
  addressTypeWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  typeButtonSelected: {
    backgroundColor: "#FF4D6D",
    borderColor: "#FF4D6D",
  },
  typeButtonText: {
    color: "#444",
    fontWeight: "600",
    fontSize: 13,
  },
  typeButtonTextSelected: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 14,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#FF4D6D",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});

export default AddressDetails;
