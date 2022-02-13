import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, Button} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {CommonActions} from '@react-navigation/native';

const Signup = ({navigation}) => {
  React.useEffect(() => {
    configureGoogleSign();
  }, []);

  function configureGoogleSign() {
    GoogleSignin.configure({
      webClientId:
        '166979664947-11fqqur79sk1e70q1p1cets2h829jckk.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }

  async function onGoogleButtonPress() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{marginTop: 50, fontSize: 25, fontWeight: 'bold'}}>
        Welcome
      </Text>
      <Text style={{marginTop: 20, fontSize: 18}}>Login to chat</Text>
      <Button
        title="Google Sign-In"
        onPress={() =>
          onGoogleButtonPress().then(res =>
            AsyncStorage.setItem('token', JSON.stringify(res)).then(res1 =>
              firestore()
                .collection('Users')
                .add({
                  displayName: res.user.displayName,
                  email: res.user.email,
                  uid: res.user.uid,
                })
                .then(() => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{name: 'Home'}],
                    }),
                  );
                }),
            ),
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Signup;
