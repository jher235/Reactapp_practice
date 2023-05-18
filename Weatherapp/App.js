import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Button, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

export default function App() {
  const [day, setDay] = useState([]);
 // const [temp,setTemp] = useState([]);
  //const [description,setDescription] = useState([]);
  const [ok, setOk] = useState(true);
  const [city, setCity] = useState("Loading...")
  
  const API_KEY = "8d4ead1a92be687d39e16ff080a804f1";

  const icons = {
    "Clouds":"cloudy",
    "Clear": "day-sunny",
    "Rain":"rain",
    "Snow":"snow",
    "Thunderstorm":"lighting",
  }


  const handleButtonClick = ()=>{
    setOk(true);
    getWeather()

  }

  const getWeather= async()=>{
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
  
    
    // const location = await Location.getCurrentPositionAsync({accuracy:5});
   const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
   const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    setCity(location[0].city)
 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast/?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    
    
    // setDay(json.list[0]);
    console.log(json.list[0]);


    // setTemp(
    //   json.list.filter(main=>{
    //     if(dt_txt.includes("00:00:00"))
    //     return main;
    //   })
    // )

    // setDescription(
    //   json.list.filter(weather => {
    //     if(dt_txt.includes("00:00:00"))
    //     return weather;
    //   })
    // )
    setDay(
      json.list.filter(list =>{
        if(list.dt_txt.includes("12:00:00"))
        return list;
     }
     )
     )
      
    // setDay(
    //   json.list.filter((weather) => {
    //   if (weather.dt_txt.includes("00:00:00")) {
    //   return weather;
    //   }
    //   })
    //   );
     
  };

useEffect(() => {
    getWeather();
  },[]);
  
  return (
    <View style={mystyle.container}>
      
      {ok === true ? (
        <>
      <View style={mystyle.city}>
      <Text style={mystyle.cityname}>{city}</Text>
      </View>

      <ScrollView showsHorizontalScrollIndicator={false} 
      pagingEnabled 
      horizontal 
      contentContainerStyle={mystyle.weather}>
    

     {day.length === 0?<View style = {mystyle.day}>
    <ActivityIndicator color = "darkblue" style={{marginTop:10}} size="large"/>
     </View> 
     :
     (day.map((today, index)=>
     <View key={index} style = {mystyle.day}>
      <View style={{flexDirection:"row", 
      alignItems:"center", 
      justifyContent:"space-between",
      width: "100%",
      }}>
      <Text style={mystyle.temp}>{parseFloat(today.main.temp).toFixed(1)}</Text>
      <Fontisto name={icons[today.weather[0].main]} size={50} color="black" />
      </View>
     <Text style={mystyle.description}>{today.weather[0].main}</Text>
      <Text style={mystyle.tinytext}>{today.weather[0].description}</Text>
      {/* <Text>{day.main.temp}</Text>
      <Text>{day.weather[0].main}</Text> */}
      </View> 
      )
      )
     
    }
      </ScrollView>
  </> 
  )   
  : 
  <View style={mystyle.city}>
    <Text style = {mystyle.ok_false}>We can't help you, have a nice day.</Text>
    <Text style = {mystyle.ok_false2}>I hope it's a good day.</Text>
    <TouchableOpacity style = {mystyle.button} onPress={()=> handleButtonClick()}>
      <Text style={mystyle.buttontext}>Restart</Text>
      </TouchableOpacity>
  </View>

  }

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
   //alignItems: "center",
   alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp:{
      fontSize:128,
      marginTop:30,
      fontWeight: "600",
  },
  description:{
    
    fontSize:60,
    marginTop:-10
  },
  weather:{
    //backgroundColor:"gray",
  },
  tinytext:{
    fontSize:25,
    color:"gray"
  },
  ok_false:{
    flex:1,
    alignItems:"center",
    color:"gray",
    fontSize:40,
    fontWeight:700,
    marginTop:100
  },
  ok_false2:{
    flex:2,
    alignItems:"center",
    color:"darkblue",
    fontSize:20,
    fontWeight:700,

  },
button:{
  color:"gray",
  backgroundColor:"darkblue",
  padding: 20,
  borderRadius: 25,
  marginTop: -20,

},
buttontext:{
  color:"gold",
  fontSize: 16,
  fontWeight: 'bold',

}

})
