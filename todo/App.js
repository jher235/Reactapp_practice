import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TouchableHighlight, 
  TouchableWithoutFeedback,
  Pressable,
  TextInput, 
  ScrollView,
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  Platform
} from 'react-native';
import {theme} from './colors.js'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesome,AntDesign,FontAwesome5} from '@expo/vector-icons';
 


const STORAGE_KEY = "@todos"
const WORKING_KEY = "@working"
const DONE_KEY = "@done"

export default function App() {
  const [working,setWorking]= useState(true);
  const [text, setText] = useState("")
  const [todos, setTodos] = useState({})
  const [loading,setLoading] = useState(true);
  const [done,setdone] = useState({});
  const [modalVisible,setModalVisible] = useState(false);
  const [retext,setRetext] = useState("");
  const [mdfid,setMdfid] = useState("");
  useEffect(()=>{
    loadTodo();
    loadWork();
    loadDone();
   } ,[])
  

  const work = async()=> {
    await setWorking(true);
     await saveWork(true);}
  const travel = async()=>{
    await setWorking(false); 
   await saveWork(false);}
  const onChangeText = (event) =>{
    setText(event)
  }
  const saveTodo=async(toSave)=>{
    try{
    const s = JSON.stringify(toSave); //js오브젝트를 스트링으로 변환
    await AsyncStorage.setItem(STORAGE_KEY, s )
  }catch(e){
    console.log('an error occurred:'+e.message)
  }
  }
  const loadTodo = async()=>{
    try{
    const l = await AsyncStorage.getItem(STORAGE_KEY);
    setLoading(false);
    if(l){
     setTodos(JSON.parse(l));//json.parse는 스트링을 js오브젝트로 변환
    }
   }catch(e){
    console.log('an error occurred:'+e.message)
   }
  }
 const saveWork=async(toSave)=>{
    const w = JSON.stringify(toSave);
    await AsyncStorage.setItem(WORKING_KEY,w)
  }
  const loadWork = async()=>{
    const w= await AsyncStorage.getItem(WORKING_KEY)
    setWorking(JSON.parse(w))
  }

  const saveDone=async(toSave)=>{
    try {
      await AsyncStorage.setItem(DONE_KEY,JSON.stringify(toSave));
    }catch(e){
      console.log(e);
    }}
  const loadDone=async()=>{
    try{
    const d = await AsyncStorage.getItem(DONE_KEY);
    if(d){
      setdone(JSON.parse(d))
    }
    }catch(e){
      console.log(e);
    }}

  const addtodo = async()=>{
    if (text === "")
      return;
   //const  newToDos = Object.assign(todos,{[Date.now()]:{text, work:working}},)
   const newToDos = {
    ...todos, [Date.now()]:{text,working}
   }
   setTodos(newToDos); 
   saveTodo(newToDos);
   setText("");
  }
  console.log(83,todos);
  console.log(84,"done", done);

  const deleteTodo=async(id)=>{
    if(Platform.OS==="web"){
      const ok=confirm("Do you want to delete this To DO?")
      if(ok){
          const newToDos = {...todos};
          delete newToDos[id]
          setTodos(newToDos);
          await saveTodo(newToDos); 
    }
    else
    return
  }else{
    Alert.alert(
          "Delete To do",
          "Are you sure?",[
        {text:"Cancel"},
        {text:"Ok", 
        onPress:async()=>{
        const newToDos = {...todos}
        delete newToDos[id]
        setTodos(newToDos);
        await saveTodo(newToDos);
        }
      }])
        return
    }
    
  }
  const doneTodo=async(id)=>{
    const newToDos = {...todos}
    const newDone = {...done, [Date.now()]:{text:todos[id].text, working:working}}
    delete newToDos[id]
    setTodos(newToDos)
    await saveTodo(newToDos)
    setdone(newDone)
    await saveDone(newDone)
  }
  const deleteDone=async(id)=>{
    Alert.alert(
      "Delete Done",
      "Are you sure?",[
      {text:"Cancel"},
      {text:"Ok",
       onPress:async()=>{
    const newDone={...done};
    delete newDone[id];
    setdone(newDone);
    await saveDone(newDone);
      }}]
    )
    return
  }
  const onChangeretext=(event)=>{
    setRetext(event)
  }
  const modify=async()=>{
    setModalVisible(true)
    const newToDos={...todos}
    if(retext!==""){
    newToDos[mdfid].text = retext;
    setRetext();
    setModalVisible(false);
    await saveTodo(newToDos)
    }
    else
    Alert.alert("Please write contents","Nothing in there")
  }

  const openModal=(id)=>{
    setMdfid(id);
    setRetext(todos[id].text)
    setModalVisible(true);
  }

 
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.2} onPress={work}>
        <Text style={{...styles.btnText,color:working?"white":theme.grey}}>Work</Text>
        </TouchableOpacity>
      {/* <TouchableOpacity>
        <Text style={styles.btnText}>Travel</Text>
     </TouchableOpacity> */}
     <TouchableOpacity onPress={travel} >
     <Text style={{...styles.btnText,color:working?theme.grey:"white" }}>Travel</Text>
     </TouchableOpacity> 
     </View>
     <View><TextInput 
     style={styles.input }
    value = {text}
    onSubmitEditing={addtodo}
    placeholder={working ?'Add a to do':'Here we go'}
    keyboardType='default'
    returnKeyType='done'
    onChangeText={onChangeText}
    //multiline
     placeholderTextColor="gray"
     autoCapitalize='sentences'
    /></View>
    <ScrollView>
        {loading?
        <ActivityIndicator size={'large'} color={"white"}/>: 
        Object.keys(done).map((thing) => 
        (done[thing].working===working?
        <View style={styles.todo} key={thing}>
        <Text style={styles.doneText}>{done[thing].text}</Text>
        <TouchableOpacity onPress={()=>deleteDone(thing)}><AntDesign name="delete" size={30} color="white" /></TouchableOpacity>
        </View>
        : null)
        )}
        {loading?
        <ActivityIndicator size={'large'} color={"white"}/>: 
        Object.keys(todos).map((thing) => 
        (todos[thing].working===working?
        <View style={styles.todo} key={thing}>
        <Text style={styles.todoText}>{todos[thing].text}</Text>
        <View style={{flexDirection:"row", alignItems:"flex-end"}}>
        <TouchableOpacity onPress={()=>openModal(thing)}><FontAwesome5 name="pencil-alt" size={25} color="white"/></TouchableOpacity>
        <TouchableOpacity onPress={()=>deleteTodo(thing)} ><AntDesign name="delete" size={30} color="white"/></TouchableOpacity>
        <TouchableOpacity onPress={()=>doneTodo(thing)} ><FontAwesome name="check" size={40} color="rgb(255,255,255)"/></TouchableOpacity>
        </View>
        </View>
        : null)
        )}
    </ScrollView>
  

    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          //Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
         <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput style={styles.mdf} 
              onChangeText={onChangeretext}
              onSubmitEditing={modify}
              value={retext}
              /> 
           <View style={{flexDirection:"row",}}> 
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={modify}>
              <Text style={styles.textStyle}>modify</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            </View>
          </View>
        </View>
      </Modal>  
    </View>

      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header:{
    justifyContent: "space-between", 
    flexDirection:"row",
    marginTop:100,
  },
  btnText:{
    
    fontWeight:'600',
    fontSize:44,
  },
  input:{
    backgroundColor:"white",
    paddingVertical:13,
    paddingHorizontal:20,
    borderRadius:30,
    marginTop:20,
    fontSize:15,
  },
  todo:{
    //alignItems:"flex-start",
    paddingLeft:10,
    backgroundColor:theme.grey,
    marginTop:10,
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:15,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",

  },
  todoText:{
    color:"white",
    fontWeight:"500",
    fontSize:20,
  },
  doneText:{
    textDecorationLine:"line-through",
    color:"white",
    fontWeight:"500",
    fontSize:20,
  },
  mdf:{
    fontSize:20,
    backgroundColor:"gray",
    paddingVertical:10,
    paddingHorizontal:50,
    borderRadius:30,
    marginTop:0,
    marginBottom:10,
  
  },




  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
   
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: theme.todoBg,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },


});



