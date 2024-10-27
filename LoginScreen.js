import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("The user has successfully logged in")
    } catch(error) {
        const errorMessage = error.message;
        console.log(errorMessage);
        Alert.alert("Login Error", "Please check the credentials");
    };
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('./assets/logo.png')}
        style={styles.logo}
      />

      <Text style={styles.header}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>


      <View style={styles.signupLinkContainer}>
        <Text>Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',  
    backgroundColor: '#a1eda4'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    width:'80%',
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: 'blue',
    fontWeight: 'bold',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
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

export default LoginScreen;
