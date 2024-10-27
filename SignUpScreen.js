import React, { useState } from 'react';
import { View, TextInput, Image, Pressable, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebase';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (email && password && confirmPassword && password !== confirmPassword) {
      alert("Please provide all required details for SignUp");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      }
      catch(error) {
        const errorMessage = error.message;
        if(errorMessage.indexOf("email-already-in-use") != -1) {
          alert("Email already in use.");
        } else {
          alert(errorMessage)
        }
        console.log(errorMessage);
      };
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('./assets/logo.png')} // Replace with your logo path
        style={styles.logo}
      />
      <Text style={styles.header}>Let's start Buddying</Text>

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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <View style={styles.loginLinkContainer}>
        <Text>Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Log In</Text>
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
    width:'80%'
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginLink: {
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

export default SignUpScreen;
