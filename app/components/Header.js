import { Button, ThemeProvider } from 'react-native-elements';
import { StyleSheet, Text, View } from 'react-native';

export default Header = ({ navigation }) => {
  async function loadData () {
    return fetch('https://database.gopr-service.com.ua/api/clientsdevice').then((data) => {
      console.log(data.json());
    })
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button title='Button' onPress={() => loadData()}/>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.navigate('Home')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
};