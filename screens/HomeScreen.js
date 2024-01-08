import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { decode } from "base-64";
import { UserType } from "../UserContext";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
global.atob = decode;
const jwt_decode = require("jwt-decode").jwtDecode;

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodeToken = jwt_decode(token);
      const userId = decodeToken.userId;
      setUserId(userId);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:3000/get-posts");
      setPosts(response.data);
    } catch (error) {
      console.log("error fetching posts", error);
    }
  };

  console.log("posts: ", posts);

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://10.0.2.2:3000/posts/${postId}/${userId}/like`
      );
      const updatePost = response.data;

      const updatePosts = posts?.map((post) =>
        post?._id === updatePost._id ? updatePost : post
      );
      setPosts(updatePosts);
    } catch (error) {
      console.log("error liking the post", error);
    }
  };
  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `http://10.0.2.2:3000/posts/${postId}/${userId}/unlike`
      );
      const updatePost = response.data;
      const updatePosts = posts.map((post) =>
        post._id === updatePost._id ? updatePost : post
      );
      console.log("updated: ",updatePosts)
      setPosts(updatePosts)
    } catch (error) {
      console.error("Error unliking post: ",error)
    }
  };
  return (
    <ScrollView style={{ marginTop: 30, flex: 1, backgroundColor: "#fff" }}>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image
          style={{ width: 60, height: 40, resizeMode: "contain" }}
          source={{
            uri: "https://logos-world.net/wp-content/uploads/2023/07/Threads-Logo.jpg",
          }}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        {posts?.map((post) => (
          <View
            style={{
              padding: 15,
              borderColor: "#D0D0D0",
              borderTopWidth: 1,
              flexDirection: "row",
              gap: 10,
              marginVertical: 10,
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
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}
              >
                {post?.user?.name}
              </Text>
              <Text>{post?.content}</Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 15,
                }}
              >
                {post?.likes?.includes(userId) ? (
                  <AntDesign
                    onPress={() => handleDislike(post?._id)}
                    name="heart"
                    size={18}
                    color="red"
                  />
                ) : (
                  <AntDesign
                    onPress={() => handleLike(post?._id)}
                    name="hearto"
                    size={18}
                    color="black"
                  />
                )}

                <FontAwesome name="comment-o" size={18} color="black" />
                <Ionicons name="share-social-outline" size={18} color="black" />
              </View>

              <Text style={{ marginTop: 7, color: "gray" }}>
                {post?.likes?.length} likes ∙ {post?.replies?.length} reply
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
