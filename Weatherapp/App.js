import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';

export default function App() {
  return (
    <View style={styles.container
    }>
      <Text style={testStyle.first}>hi! jher!</Text>
   
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "gold",
    
  },
  text:{
    fontSize: 28,
    
  }

});
const testStyle = {
  first:{
    backgroundColor: "white",
    fontSize:50,
    color:"blue",
    
  },


}
