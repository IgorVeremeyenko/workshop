import React, { useState, useContext } from "react";
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

import * as Google from 'expo-google-app-auth';
import { SocialIcon } from 'react-native-elements';
import { TouchableHighlight } from "react-native-gesture-handler";
import { GoogleSocialButton } from "react-native-social-buttons";

import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Login({ navigation }) {
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

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
        await AsyncStorage.setItem("generalElite", JSON.stringify(session));
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
              Добро пожаловать!
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
                    .min(10, 'Минимум 10 цифр, начинается на 0')
                    .max(10, "Не боле 10 цифр")
                    .matches(phoneRegExp, 'Неправильный номер')
                    .required('Это поле обязательное'),
                  password: yup
                    .string()
                    .matches(
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                      "Пароль должен содержать от 8 символов, как минимум одна заглавная буква, одна цифра и один спец.символ"
                    )
                    .required('Это поле обязательное')
                })}
              >
                {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => (
                  <View style={styles.formContainer}>
                    <TextInput
                      value={values.tel}
                      style={styles.input}
                      onChangeText={handleChange('tel')}
                      onBlur={() => setFieldTouched('tel')}
                      placeholder="Ваш номер телефона"
                    />
                    {touched.tel && errors.tel &&
                      <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.tel}</Text>
                    }
                    <TextInput
                      value={values.password}
                      style={styles.input}
                      onChangeText={handleChange('password')}
                      placeholder="Пароль"
                      onBlur={() => setFieldTouched('password')}
                      secureTextEntry={true}
                    />
                    {touched.password && errors.password &&
                      <Text style={{ fontSize: 12, color: '#FF0D10' }}>{errors.password}</Text>
                    }
                    <Button
                      color="#228896"
                      title='Войти'
                      disabled={!isValid}
                      onPress={handleSubmit}

                    />
                    <View style={styles.success}>
                      <Text style={{ color: '#636363' }}>Или</Text>
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
                      title='Войти с помощью Google'
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
                      {success && <Text style={{ color: 'green' }}>Успех!</Text>}
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

