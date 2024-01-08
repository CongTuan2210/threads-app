import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation()
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:3000/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);
      } catch (error) {
        console.error("Error fetching profile: ", error);
      }
    };
    fetchProfile();
  }, []);

  const logout = () => {
    clearAuthToken();
  }
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken")
    console.log("Cleared auth token")
    navigation.replace("Login")
  }
  return (
    <SafeAreaView style={{ marginTop: 30, padding: 15 }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: "#D0D0D0",
            }}
          >
            <Text>Threads.net</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: 15,
          }}
        >
          <View>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                resizeMode: "contain",
              }}
              source={{
                uri: "https://st.quantrimang.com/photos/image/072015/22/avatar.jpg",
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>BTech.</Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Movie Buff | Musical Nerd
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Love Yourself
            </Text>
          </View>
        </View>

        <Text style={{ color: "gray", fontSize: 15, marginTop: 10 }}>
          {user?.followers?.length} followers
        </Text>

        <View style={{flexDirection:'row',alignItems:'center',gap:10,marginTop:20}}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text>Edit profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => logout()}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
