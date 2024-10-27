import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, Image, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

export const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const db = getFirestore();
  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
		 // Create a query to get all avatars except the current user
		 const q = query(
			collection(db, "avatars"),
			where("email", "!=", auth.currentUser.email) // Fetch records with email not equal to the current user's email
		  );
	  
		  // Execute the query
		  const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
			<View>
          <Pressable style={styles.userContainer}
            onPress={() =>
              navigation.navigate('ChatScreen', { receiver: item.email })
            }
          >
			<Image source={{ uri: item.avatar }} style={styles.avatar} />
			<Text style={styles.username}>{item.email}</Text>
          </Pressable>
		  </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
	userContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
	},
	title: {
	  fontSize: 24,
	  marginBottom: 20,
	  fontWeight: 'bold',
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10,
	  },
	  username: {
		fontSize: 18,
		color: 'blue',
	  },
	});
  