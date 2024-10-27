// SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { query, where, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage  } from './firebase';

const SettingsScreen = () => {
  const [avatar, setAvatar] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Get the current authenticated user's email
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    } else {
      Alert.alert('User not logged in', 'Please log in to upload an avatar.');
    }
  }, []);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // Create a query to find documents with the specified email
        const q = query(collection(db, "avatars"), where("email", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(q);
  
        // Check if the query returned any results
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setAvatar(doc.data().avatar);
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document: ", error);
      }
    };
  
    fetchAvatar();
  }, [avatar]);

  // Function to upload the image to Firebase Storage
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profile_pics/${new Date().getTime()}.jpg`);

    // Upload the image
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef); // Get the download URL
    return url; // Return the download URL
  };

  // Function to pick an image from the device's gallery
  const pickImage = async () => {
    // Request permission to access the gallery
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      const url = await uploadImage(result.assets[0].uri); // Upload the selected image
      setImageUrl(url); // Set the image URL
      if (!avatar) {
        await addDoc(collection(db, "avatars"), {
          userEmail,
          imageUrl
        });
      } else {
        await setDoc(newDocRef, { email: userEmail, avatarUrl: imageUrl });
      }
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Pressable onPress={pickImage}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarPlaceholder}>Upload Avatar</Text>
          )}
        </View>
      </Pressable>
      <Pressable style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Change Avatar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  avatarPlaceholder: {
    color: '#666',
    fontSize: 18,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
