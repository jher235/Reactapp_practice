import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';

export default function App() {
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const [city, setCity] = useState("Loading...")
  
  useEffect(() => {
    ask();
  },[])

  const ask= async()=>{
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    // const location = await Location.getCurrentPositionAsync({accuracy:5});
   const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
   const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    setCity(location[0].city)
  }
  return (
    <View style={mystyle.container}>
      <View style={mystyle.city}>
      <Text style={mystyle.cityname}>{city}</Text>
      </View>

      <ScrollView showsHorizontalScrollIndicator={false} 
      pagingEnabled 
      horizontal 
      contentContainerStyle={mystyle.weather}>
        <View style={mystyle.day}>
          <Text style={mystyle.temp}>27</Text>
          <Text style={mystyle.description}>sunny</Text>
        </View>
        <View style={mystyle.day}>
          <Text style={mystyle.temp}>27</Text>
          <Text style={mystyle.description}>sunny</Text>
        </View>
        <View style={mystyle.day}>
          <Text style={mystyle.temp}>27</Text>
          <Text style={mystyle.description}>sunny</Text>
        </View>
        <View style={mystyle.day}>
          <Text style={mystyle.temp}>27</Text>
          <Text style={mystyle.description}>sunny</Text>
        </View>
      </ScrollView>
      

    <StatusBar style="black"/>
  </View> 
 
  );
}

const screen_width = Dimensions.get('window').width;
// const {width:screen_width}=Dimensions.get('window');


const mystyle = StyleSheet.create({
  container:{
    flex:1, 
    backgroundColor:"gold",
  },
  city:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",

  },
  cityname:{
  color:"darkblue",
  fontSize:58,
  fontWeight:700,
  },
  day:{
    width: screen_width,
    fontSize:50,
    alignItems:"center",
  },
  temp:{
      fontSize:128,
      marginTop:30,
  },
  description:{
    fontSize:60,
    marginTop:-10
  },
  weather:{
    //backgroundColor:"gray",
  }

})


// const testStyle = {
//   first:{
//     backgroundColor: "white",
//     fontSize:50,
//     color:"blue",
    
//   },


// }
