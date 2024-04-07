import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-files/firebaseSetup";
import ForgetPassword from "./ForgetPassword";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupHandler = () => {
    navigation.navigate("Signup");
  };

  const forgetPasswordHandler = () => {
    navigation.navigate('Forget Password'); 
  };

  const loginHandler = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Fields should not be empty");
        return;
      }
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCred);
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        Alert.alert("Invalid email address or password.");
      }
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={(changedText) => {
          setEmail(changedText);
        }}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Password"
        value={password}
        onChangeText={(changedText) => {
          setPassword(changedText);
        }}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button]} onPress={loginHandler}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={signupHandler}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.forgetButton} onPress={forgetPasswordHandler}>
        <Text style={styles.forgetButtonText}>Forget Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    marginRight: 40,
    marginLeft: 40,
  },
  button: {
    backgroundColor: '#795458',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#453F78',
    marginLeft: 40,
    marginRight: 35,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  forgetButton: {
    marginTop: 10,
  },
  forgetButtonText: {
    color: '#795458',
    fontSize: 16,
    marginTop: 20,
  },
});
