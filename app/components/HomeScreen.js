import React, { useState, useContext, useEffect } from "react";
import { initializeApp } from 'firebase/app';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
  ActivityIndicator
} from "react-native";
import { Formik } from "formik";
import * as Animatable from 'react-native-animatable';
import * as yup from 'yup';
import {
  getAuth,
  onAuthStateChanged,
  FacebookAuthProvider,
  signInWithCredential,
  browserLocalPersistence,
} from 'firebase/auth';
import * as Google from 'expo-google-app-auth';
import { SocialIcon } from 'react-native-elements';
import { TouchableHighlight } from "react-native-gesture-handler";
import { GoogleSocialButton } from "react-native-social-buttons";
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: "AIzaSyAQyKGOGj6-WZD1IENAX1LynOz_GbERNw4",
  authDomain: "workshop.gopr-service.com.ua",
  databaseURL: "https://elite-service-92d53-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "elite-service-92d53",
  storageBucket: "elite-service-92d53.appspot.com",
  messagingSenderId: "336956340236",
  appId: "1:336956340236:web:e62786b00809d449699629",
  measurementId: "G-QSF4E7NRMD"
};


export default function Login({ navigation, route }) {
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // isSignedIn = async () => {
  //   const isSignedIn = await GoogleSignin.isSignedIn();
  //   this.setState({ isLoginScreenPresented: !isSignedIn });
  // };
  initializeApp(firebaseConfig);
  const auth = getAuth();
  useEffect(() => {
    if(route.params != undefined){      
      console.log('route, ',route)
      setSuccess(false);
    }
    onAuthStateChanged(auth, user => {
      console.log('state auth', user)
      if (user != null) {
        console.log('We are authenticated now!');
        setTimeout(() => { navigation.navigate("Main", { user, accessToken, type });  }, 1000);
        setLoading(false)
      }
    })
  });
  const signInWithGoogleAsync = async () => {
    try {
      setLoading(true)
      const { type, user, accessToken } = await Google.logInAsync({
        iosClientId: `336956340236-gudtjandvehiehk9lfud8q7k0audjoio.apps.googleusercontent.com`,
        androidClientId: `336956340236-024g0jlisil8o9pvjns5ra53f7rmuug3.apps.googleusercontent.com`,
      });
      
      if (type === "success") {
        const session = { type, user, accessToken };
        setSuccess(true);
        auth.setPersistence(browserLocalPersistence).then(() => {console.log('setting persistanse')})
       
        await AsyncStorage.setItem("generalElite", JSON.stringify(session));
        console.log('user, ', user)
        setTimeout(() => { navigation.navigate("Main", { user, accessToken, type }); setLoading(false) }, 1000);
      }
    } catch (error) {
      setLoading(false)
      console.log("LoginScreen.js 19 | error with login", error);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={{ backgroundColor: '#fff' }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Animatable.Text style={styles.textHeader} animation="slideInUp" duration={1500}>
              ?????????? ????????????????????!
            </Animatable.Text>
            <View style={styles.footer}>
              <Formik
                initialValues={{
                  tel: '0500868023',
                  password: 'Qw79@dsg'
                }}
                onSubmit={values => { navigation.navigate('Main', values) }}
                validationSchema={yup.object().shape({
                  tel: yup
                    .string()
                    .min(10, '?????????????? 10 ????????, ???????????????????? ???? 0')
                    .max(10, "???? ???????? 10 ????????")
                    .matches(phoneRegExp, '???????????????????????? ??????????')
                    .required('?????? ???????? ????????????????????????'),
                  password: yup
                    .string()
                    .matches(
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                      "???????????? ???????????? ?????????????????? ???? 8 ????????????????, ?????? ?????????????? ???????? ?????????????????? ??????????, ???????? ?????????? ?? ???????? ????????.????????????"
                    )
                    .required('?????? ???????? ????????????????????????')
                })}
              >
                {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                  <View style={styles.formContainer}>
                    <TextInput
                      value={values.tel}
                      style={styles.input}
                      onChangeText={handleChange('tel')}
                      onBlur={() => setFieldTouched('tel')}
                      placeholder="?????? ?????????? ????????????????"
                    />
                    {touched.tel && errors.tel &&
                      <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.tel}</Text>
                    }
                    <TextInput
                      value={values.password}
                      style={styles.input}
                      onChangeText={handleChange('password')}
                      placeholder="????????????"
                      onBlur={() => setFieldTouched('password')}
                      secureTextEntry={true}
                    />
                    {touched.password && errors.password &&
                      <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.password}</Text>
                    }
                    <Button
                      color="#228896"
                      title='??????????'
                      disabled={!isValid}
                      onPress={handleSubmit}

                    />
                    <View style={styles.success}>
                      <Text style={{ color: '#636363' }}>??????</Text>
                      {loading &&
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                          <ActivityIndicator size="large" color="green" />
                        </View>
                      }
                      <GoogleSocialButton
                        buttonViewStyle={{ borderColor: '#228896', borderWidth: 1, }}
                        onPress={signInWithGoogleAsync}
                      />

                    </View>
                    {/* <SocialIcon
                      button
                      disabled={loading}
                      loading={loading}
                      title='?????????? ?? ?????????????? Google'
                      style={{ 
                        padding: 10, 
                        marginTop: 50, 
                        borderColor: '#228896', 
                        borderWidth: 1, 
                        borderRadius: 5
                      }}
                      onPress={signInWithGoogleAsync}
                      type='google'
                    /> */}
                    <View style={styles.success}>
                      {success && <Text style={{ color: 'green' }}>??????????!</Text>}
                    </View>
                  </View>
                )}
              </Formik>

            </View>
          </View>

        </SafeAreaView>
      </ScrollView>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 50,
    margin: 12,
    padding: 10,
    borderBottomWidth: 1,
    fontSize: 15

  },
  formContainer: {
    // padding: 50
    width: '100%',

  },
  success: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#228896",
    width: '100%'
  },
  textHeader: {
    color: '#fff',
    fontSize: 25,
    top: 30,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: 'stretch',
    marginTop: 85,
  },

});

