import { StyleSheet, Text, View, useColorScheme, Switch } from "react-native";
import React from "react";
import { Colors } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";
import { useState } from "react";


const Settings = () => {

  const [enabled, setEnabled] = useState(false);

  const scheme = useColorScheme();
  const theme = Colors[scheme || "light"];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor: "red",
    },
    accountHeader: {
      top: 25,
      //backgroundColor: "yellow",
      height: 100,
    },
    accountText: {
      fontSize: 15,
      fontWeight: "bold",
      left: 18,
      color: '#444',
      opacity: 0.4,
    },
    label: {
      fontSize: 16,
      fontWeight: "400",
      left: 10,
      color: theme.text,
    },
    emailText: {
      fontSize: 14,
      fontWeight: "300",
      marginLeft: 'auto',
      right: 15,
      color: theme.text,
      opacity: 0.4,
    },
    profilebutton: {
      marginLeft: 'auto',
      right: 15,
      opacity: 0.4,
    },
    preferences: {
      marginTop: 70,
      paddingHorizontal: 20,
      //backgroundColor: 'blue',
      height: 75,
    },
    preferText: {
      fontSize: 15,
      fontWeight: "bold",
      left: -5,
      color: '#444',
      opacity: 0.4,
    },
    notifButton: {
      marginLeft: 'auto',
      right: -5,
    },
    labelNotif: {
      fontSize: 16,
      fontWeight: "400",
      left: 10,
      color: theme.text,
    },
    support: {
      //backgroundColor: 'green',
      marginTop: 50,
      height: 100,
    },
    supportText: {
      fontSize: 15,
      fontWeight: "bold",
      left: 15,
      color: '#444',
      opacity: 0.4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.accountHeader}>
        <Text style={styles.accountText}>ACCOUNT</Text>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 15 }}>
              <Ionicons name="person-circle-outline" size={22} color='black' />
              <Text style={styles.label}>Profile</Text>
              <Icon name="chevron-right" size={22} color={theme.text} style={styles.profilebutton} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15, marginLeft: 15 }}>
              <Ionicons name="mail-outline" size={22} color='black'/> 
              <Text style={styles.label}>Email</Text>
              <Text style={styles.emailText}>jljuanitas@usa.edu.ph</Text>
            </View>
          </View>
      </View>

      <View style={styles.preferences}>
        <Text style={styles.preferText}>PREFERENCES</Text>
        <View style={{marginTop: 20}}>
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -5 }}>
              <Ionicons name="notifications-outline" size={22} color='black' />
              <Text style={styles.labelNotif}>Notifications</Text>
      
              <Switch
                value={enabled}
                onValueChange={setEnabled}
                style={styles.notifButton}
              />
            </View>
        </View>
      </View>

      <View style={styles.support}>
        <Text style={styles.supportText}>SUPPORT</Text>
        <View style={{marginTop: 20}}>
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 15 }}>
              <Ionicons name="person-circle-outline" size={22} color='black' />
              <Text style={styles.label}>Help & Support</Text>
              <Icon name="chevron-right" size={22} color={theme.text} style={styles.profilebutton} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15, marginLeft: 15 }}>
              <Ionicons name="mail-outline" size={22} color='black'/> 
              <Text style={styles.label}>About</Text>
              <Icon name="chevron-right" size={22} color={theme.text} style={styles.profilebutton} />
            </View>
        </View>
      </View>
    </View>
  );
};

export default Settings;


