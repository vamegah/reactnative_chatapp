import React, { useState, useEffect, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  where,
  getDocs,
  or,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from './colors';
import { useRoute } from '@react-navigation/native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [receiver, setReceiever] = useState(null);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    setUser(auth.currentUser.email);
  }, []);

  useEffect(() => {
    if (route.params?.receiver) {
      setReceiever(route.params.receiver);
    }
  }, [route.params]);

  useFocusEffect(
    useCallback(() => {
      const fetchAvatar = async () => {
        try {
          const q = query(collection(db, "avatars"), where("email", "==", auth.currentUser.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              setAvatar(doc.data().avatar);
            });
          }
        } catch (error) {
          console.error("Error fetching avatar: ", error);
        }
      };
      fetchAvatar();
    }, [])
  );

  useEffect(() => {
    if (!receiver) return;

    const chatQuery = query(
      collection(db, 'chats'),
      or(
        where('user._id', '==', user),
        where('receiver', '==', receiver),
        where('user._id', '==', receiver),
        where('receiver', '==', user)
      ),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const combinedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      }));
      combinedMessages.sort((a, b) => b.createdAt - a.createdAt);
      setMessages(combinedMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [receiver, user]);

  const onSend = useCallback((messages = []) => {
    if (receiver) {
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
    }
  }, [receiver]);

  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable style={{ marginRight: 10 }} onPress={onSignOut}>
          <AntDesign name="logout" size={24} color={colors.gray} />
        </Pressable>
      ),
    });
  }, [navigation]);

  if (!receiver) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, color: '#333' }}>
          No one to chat with yet! {'\n'} Did you choose one?
        </Text>
      </View>
    );
  }

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={messages => onSend(messages)}
      messagesContainerStyle={{
        backgroundColor: '#fff',
      }}
      textInputStyle={{
        backgroundColor: '#fff',
        borderRadius: 20,
      }}
      user={{
        _id: auth?.currentUser?.email,
        avatar: avatar,
      }}
    />
  );
}
