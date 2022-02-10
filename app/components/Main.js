import React, { useState, useLayoutEffect, useCallback } from "react";
import { FlatList, View, Text, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator, Alert, TouchableHighlight } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Entypo, FontAwesome, Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
import * as Animatable from 'react-native-animatable';
import { signOutAsync } from "expo-google-sign-in";
import { Image } from "react-native-elements";
import { ListItem, Avatar, Icon, Tooltip } from 'react-native-elements';

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
    time: '2021-08-09',
    currentStatus: true
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
    time: '2021-08-09',
    currentStatus: false
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    time: '2021-08-09',
    currentStatus: true
  },
  {
    id: "58694a0f-3da1-471f-2-145571e29d72",
    title: "Fourth Item",
    time: '2021-08-09',
    currentStatus: true
  },
  {
    id: "58694a0f-3da1-471f-4-145571e29d72",
    title: "Fifth Item",
    time: '2021-08-09',
    currentStatus: true
  },
  {
    id: "58694a0f-3da1-471f-777-145571e29d72",
    title: "Sixth Item",
    time: '2021-08-09',
    currentStatus: false
  },
  {
    id: "58694a0f-3da1-471f-457-145571e29d72",
    title: "Seventh Item",
    time: '2021-08-09',
    currentStatus: true
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Eighth Item",
    time: '2021-08-09',
    currentStatus: true
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Ninth Item",
    time: '2021-08-09',
    currentStatus: false
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Tenth Item",
    time: '2021-08-09',
    currentStatus: true
  },
];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Text style={[styles.title, textColor]}>{item.title}</Text>
    <Text>{item.time}</Text>
  </TouchableOpacity>
);

const credentials = {
  clientId: '336956340236-hau0llikkvrptvrrjf5j4816iqkhdeb5.apps.googleusercontent.com',
  appId: '1:336956340236:android:712bebc8f4f5c3a8699629',
  apiKey: 'AIzaSyBUyBHWe9Uqp8qt7kwvbHKY7qARZJTqRUY',
  databaseURL: 'https://elite-service-92d53-default-rtdb.europe-west1.firebasedatabase.app/',
  storageBucket: 'elite-service-92d53.appspot.com',
  messagingSenderId: '336956340236',
  projectId: 'elite-service-92d53',
  appName: 'project-336956340236'
};

export default function Main({ navigation, route }) {
  console.log('params in main ', route)
  const { tel } = route.params;
  const { accessToken, user, type } = route.params;
  const [selectedId, setSelectedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [phone, setUser] = useState(tel)
  const [loading, setLoading] = useState(false)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false) }, 1000)
  }, []);

  // useEffect(() => {
    
  //   if()
  // }, [input])

  async function signOut() {
    try {
      setLoading(true)
      console.log(accessToken)
      await Google.logOutAsync(accessToken, credentials);
      setLoading(false)
      console.log('exiting')
      navigation.navigate('intro')
    } catch (error) {
      setLoading(false)
      Alert.alert('Something else went wrong... ', error.toString());
    }
  }

  const submitButton = () => {
    Alert.alert(
      "Выход из учётной записи",
      "Вы действительно хотите выйти?",
      [
        {
          text: "Отмена",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => signOut() }
      ]
    );
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "  " + user.name, //Set Header Title
      headerStyle: {
        backgroundColor: '#fff',
      },

      headerTintColor: 'black', //Set Header text color
      headerTitleStyle: {
        fontWeight: 10, //Set Header text style
      },
      headerRight: () => (
        <TouchableOpacity onPress={submitButton}>
          <MaterialCommunityIcons name="exit-to-app" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <View>
          <Image
            source={{ uri: user.photoUrl }}
            style={{ width: 40, height: 40, borderRadius: 50 }}
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
      ),
    });
  }, [navigation]);
  /*======================= */
  const toolTip = (isVisible) => {
    return (
      <Tooltip
        animated
        backgroundColor= "#228896"
        popover={isVisible ? 
        <Text>Ожидает Вас в мастерской!</Text>
        :
        <Text>Ещё не готово</Text>
      }
      >
          <Icon
            raised={isVisible}
            animated={true}
            name='lightbulb'
            type='lightBulbIcon'
            color={!isVisible ? 'black' : 'green'}
          />
      </Tooltip>
    )
  }
  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => {
    const { currentStatus } = item
    const selectedItem = () => {
      console.log(item)
      setSelectedId(item.id);
      return navigation.navigate('Details', { params: { title: item.title, time: item.time, current: item.currentStatus, user: user.name } });
    }

    return (
      <ListItem bottomDivider onPress={selectedItem}>
        <Avatar Component={item => toolTip(currentStatus)} />
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
          <ListItem.Subtitle>{item.time}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    )
  }
  const icon = (status) => {
    return (
      <Icon
        Component={() => toolTip(status)}
        raised={status}
        name='lightbulb'
        type='lightBulbIcon'
        color={!status ? 'black' : 'green'}
      />
    )
  }
  return (
    <>
      <View>
        {loading &&
          <Animatable.View animation="fadeInDown" duration={1500} style={{ top: 55, bottom: 0 }}>
            <ActivityIndicator size="large" color="black" />
          </Animatable.View>
        }
      </View>
      {/* <SafeAreaView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </SafeAreaView> */}

      <FlatList
        keyExtractor={keyExtractor}
        data={DATA}
        extraData={selectedId}
        renderItem={renderItem}
      />
      {/* <View>
        {
          DATA.map((l, i) => (
            <ListItem key={i} bottomDivider onPress={item => selectedItem(item)}>
              <ListItem.Content style={{ alignItems: 'center' }} >
                <ListItem.Title>{l.title}</ListItem.Title>
                <ListItem.Subtitle>{l.time}</ListItem.Subtitle>
              </ListItem.Content>
              <Avatar Component={icon} />
            </ListItem>
          ))
        }
      </View> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#228896',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});