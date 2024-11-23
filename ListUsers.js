import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, Image, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

export const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const db = getFirestore();
  const auth = getAuth();
  const navigation = useNavigation();

useFocusEffect(
    React.useCallback(() => {
      const fetchUsers = async () => {
        try {
          // Create a query to get all avatars except the current user
          const q = query(
           collection(db, "avatars"),
           );
         
           // Execute the query
           const querySnapshot = await getDocs(q);
             const fetchedUsers = querySnapshot.docs.map(doc => ({
               id: doc.id,
               ...doc.data(),
             }));
             const currentUser = fetchedUsers.find((user) => user.email === auth.currentUser.email);
             const otherUsers = fetchedUsers.filter((user) => user.email !== auth.currentUser.email);
         
             // Set the sorted array with the current user first
             setUsers([currentUser, ...otherUsers]);        
           } catch (error) {
             console.error('Error fetching users:', error);
           }     
      };
      fetchUsers();
    }, [])
  );
	
  if (users){
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

  			<Image 
        source={{ 
        uri: item.avatar ? item.avatar : 'https://randomuser.me/api/portraits/lego/1.jpg' 
        }} 
        style={styles.avatar} 
        />
  			<Text style={styles.username}>{item.email}</Text>
            </Pressable>
  		  </View>
          )}
        />
      </View>
    );
  } else {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{fontSize: 20, color: '#333',}}>No buddies to load!</Text>
      </View>
    )
  }
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
  
