import React, {
    useState,
    useEffect,
    useCallback
  } from 'react';
  import { Pressable, Text } from 'react-native';
  import { GiftedChat } from 'react-native-gifted-chat';
  import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    where,
    getDocs
  } from 'firebase/firestore';
  import { signOut } from 'firebase/auth';
  import { auth, db } from './firebase';
  import { useNavigation } from '@react-navigation/native';
  import { AntDesign } from '@expo/vector-icons';
  import colors from './colors';
  import { useRoute } from '@react-navigation/native';

  export default function ChatScreen() {

    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();
    const [avatar,setAvatar] = useState(null);
    const route = useRoute();
    const {receiver} = route.params;

  const onSignOut = () => {
      signOut(auth).catch(error => console.log('Error logging out: ', error));
    };

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
    
    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
              <Pressable style={{ marginRight: 10 }} onPress={onSignOut}>
                <AntDesign name="logout" size={24} color={colors.gray} style={{marginRight: 10}}/>
              </Pressable>
          )
        });
      }, [navigation]);

    useEffect(() => {
      const user = auth.currentUser.email;
      
      // Define two separate queries for received and sent messages
      const receivedQuery = query(
        collection(db, 'chats'),
        where('receiver', '==', user),
        orderBy('createdAt', 'desc')
      );
  
      const sentQuery = query(
        collection(db, 'chats'),
        where('user._id', '==', user),
        orderBy('createdAt', 'desc')
      );
  
      // Listen for real-time updates for both received and sent messages
      const unsubscribeReceived = onSnapshot(receivedQuery, (receivedSnapshot) => {
        const receivedMessages = receivedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate() // Convert Firestore timestamp to JS Date
        }));
        
        const unsubscribeSent = onSnapshot(sentQuery, (sentSnapshot) => {
          const sentMessages = sentSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate()
          }));
  
          const combinedMessages = [...receivedMessages, ...sentMessages].sort(
            (a, b) => b.createdAt - a.createdAt
          );
  
          setMessages(combinedMessages);
        });
  
        // Cleanup both listeners when component unmounts or dependencies change
        return () => {
          unsubscribeReceived();
          unsubscribeSent();
        };
      });
    }, []);
    
    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages)
        );
        const { _id, createdAt, text, user } = messages[0];    
        addDoc(collection(db, 'chats'), {
          _id,
          createdAt,
          text,
          user,
          receiver
        });
      }, []);

      return (
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={true}
          showUserAvatar={true}
          onSend={messages => onSend(messages)}
          messagesContainerStyle={{
            backgroundColor: '#fff'
          }}
          textInputStyle={{
            backgroundColor: '#fff',
            borderRadius: 20,
          }}
          user={{
            _id: auth?.currentUser?.email,
            avatar:avatar
          }}
        />
      );
}
