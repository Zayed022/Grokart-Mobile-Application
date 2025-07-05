import React, { useState, useEffect, useRef } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("userAddressDetails");
        if (saved) {
          const parsed = JSON.parse(saved);
          setAddressDetails((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.log("Failed to load saved address", err);
      }
    })();
  }, []);

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

  const handleSubmit = async () => {
    if (!isComplete()) {
      Alert.alert("Error", "Please complete all required fields correctly.");
      return;
    }

    try {
      await AsyncStorage.setItem(
        "userAddressDetails",
        JSON.stringify(addressDetails)
      );
    } catch (err) {
      console.log("Failed to save address", err);
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

  const clearSavedAddress = async () => {
    try {
      await AsyncStorage.removeItem("userAddressDetails");
      setAddressDetails({
        houseNumber: "",
        floor: "",
        buildingName: "",
        landmark: "",
        recipientName: "",
        recipientPhoneNumber: "",
      });
    } catch (err) {
      console.log("Failed to clear address", err);
    }
  };

  const renderInput = (key, placeholder, icon, options = {}) => {
    const isPhone = key === "recipientPhoneNumber";
    const invalidPhone =
      isPhone && addressDetails[key] && !isValidPhone(addressDetails[key]);

    return (
      <View key={key} style={styles.inputWrapper}>
        <Icon name={icon} size={18} color="#aaa" style={styles.inputIcon} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          style={[
            styles.inputField,
            invalidPhone && { borderColor: "#FF4D6D" },
          ]}
          value={addressDetails[key]}
          onChangeText={(text) => handleChange(key, text)}
          {...options}
        />
        {isPhone && (
          <Text style={styles.helperText}>
            {addressDetails[key]?.length || 0}/10 digits
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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

        <View style={styles.addressCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.addressText}>{address}</Text>
          </View>
          <TouchableOpacity style={styles.changeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Icon name="information-circle" size={18} color="#FFC107" />
          <Text style={styles.infoText}>
            A detailed address helps our delivery partners reach your doorstep
            easily.
          </Text>
        </View>

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

        <TouchableOpacity onPress={clearSavedAddress}>
          <Text style={{ color: "red", textAlign: "right", marginBottom: 10 }}>
            Clear Saved Address
          </Text>
        </TouchableOpacity>

        {renderInput("houseNumber", "House No. *(NA if not known)", "home")}
        {renderInput("floor", "Floor *", "layers")}
        {renderInput("buildingName", "Building & Block No.", "business")}
        {renderInput("landmark", "Landmark & Area Name (Optional)", "navigate")}
        {renderInput("recipientName", "Recipient Name *", "person")}
        {renderInput("recipientPhoneNumber", "Recipient Phone Number *", "call", {
          keyboardType: "phone-pad",
          maxLength: 10,
        })}

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

export default AddressDetails;

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
    textAlign: "center",
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
  changeButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 13,
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 14,
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginRight: 8,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    paddingVertical: 12,
  },
  helperText: {
    position: "absolute",
    right: 10,
    bottom: -16,
    fontSize: 11,
    color: "#888",
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
