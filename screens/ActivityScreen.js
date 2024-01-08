import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import axios from "axios";
import {decode} from 'base-64'
import User from "../components/User";

global.atob = decode

const jwt_decode = require("jwt-decode").jwtDecode;

const ActivityScreen = () => {
  const { userId, setUserId } = useContext(UserType)
  const [selectButton, setSelectButton] = useState("people");
  const [content, setContent] = useState("People Content");
  const [users, setUsers] = useState([]);
  const handleButtonClick = (buttonName) => {
    setSelectButton(buttonName);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodeToken = jwt_decode(token);
      const userId = decodeToken.userId;
      setUserId(userId);

      axios
        .get(`http://10.0.2.2:3000/user/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error", error);
        });
    };
    fetchUsers()
  }, []);
  console.log("users", users)

  return (
    <ScrollView style={{ marginTop: 50 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Activity</Text>
      {/* </View> */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => handleButtonClick("people")}
          style={[
            {
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: "#fff",
              borderColor: "#D0D0D0",
              borderRadius: 6,
              borderWidth: 0.7,
            },
            selectButton === "people" ? { backgroundColor: "#000" } : null,
          ]}
        >
          <Text
            style={[
              {
                textAlign: "center",
                fontWeight: "bold",
              },
              selectButton === "people" ? { color: "#fff" } : { color: "#000" },
            ]}
          >
            People
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleButtonClick("all")}
          style={[
            {
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: "#fff",
              borderColor: "#D0D0D0",
              borderRadius: 6,
              borderWidth: 0.7,
            },
            selectButton === "all" ? { backgroundColor: "#000" } : null,
          ]}
        >
          <Text
            style={[
              {
                textAlign: "center",
                fontWeight: "bold",
              },
              selectButton === "all" ? { color: "#fff" } : { color: "#000" },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleButtonClick("requests")}
          style={[
            {
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: "#fff",
              borderColor: "#D0D0D0",
              borderRadius: 6,
              borderWidth: 0.7,
            },
            selectButton === "requests" ? { backgroundColor: "#000" } : null,
          ]}
        >
          <Text
            style={[
              {
                textAlign: "center",
                fontWeight: "bold",
              },
              selectButton === "requests"
                ? { color: "#fff" }
                : { color: "#000" },
            ]}
          >
            Requests
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        {selectButton === "people" && (
          <View style={{marginTop:20}}>
            {users?.map((item,index) => (
              <User key={index} item={item}/>
            ))}
          </View>
        )}
      </View>
    </View>
    </ScrollView>
  );
};

export default ActivityScreen;
