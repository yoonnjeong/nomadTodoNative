import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Fontisto, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./color";
import { useEffect, useState } from "react";

const STORAGE_KEY = "@toDos";
const CATAGORY_KEY = "@catagory";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadToDos();
    getCatagory();
  }, []);

  // const travel = () => {
  //   setWorking(false);
  //   // console.log(working);
  // };
  // const work = () => {
  //   setWorking(true);
  //   // console.log(working);
  // };
  const changeCatagory = () => {
    setWorking((prev) => !prev);
    saveCategory(!working);
  };

  const saveCategory = async (working) => {
    await AsyncStorage.setItem(CATAGORY_KEY, JSON.stringify(working));
  };

  const getCatagory = async () => {
    const prevCatagory = await AsyncStorage.getItem(CATAGORY_KEY);
    setWorking(JSON.parse(prevCatagory));
  };

  const loadToDos = async () => {
    const prevToDos = await AsyncStorage.getItem(STORAGE_KEY);
    // console.log(JSON.parse(s));
    setToDos(JSON.parse(prevToDos));
  };

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    //save to do
    // const newToDos = Object.assign({}, toDos, {
    //   [Date.now()]: { text, work: working },
    // });
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, isCompleted: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  console.log(toDos);

  const toggleCompleteToDo = (key) => {
    let newToDo = { ...toDos };
    newToDo[key].isCompleted = !newToDo[key].isCompleted;
    setToDos(newToDo);
    saveToDos(newToDo);
  };

  const editToDo = (key) => {
    Alert.prompt("Edit To Do", "How to change Text?", [
      { text: "Cancel" },
      {
        text: "OK",
        style: "destructive",
        onPress: (val) => {
          if (val !== "") {
            const changeToDo = { ...toDos };
            changeToDo[key].text = val;
            setToDos(changeToDo);
            saveToDos(changeToDo);
          }
        },
      },
    ]);
  };
  // const editToDo = (key) => {
  //   Alert.prompt("Edit To Do", "How to change Text?", (val) => {
  //     if (val !== "") {
  //       let newToDo = { ...toDos };
  //       const stringKey = key.toString(); // key를 문자열로 변환
  //       if (newToDo[stringKey]) {
  //         newToDo[stringKey].text = val;
  //         setToDos(newToDo);
  //         saveToDos(newToDo);
  //       } else {
  //         // 에러 처리: 해당 key에 해당하는 할 일이 없는 경우
  //         console.error(`Key ${stringKey} not found in toDos`);
  //       }
  //     }
  //   });
  // };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure!",
        style: "destructive",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
    return;
  };

  const onChangeText = (payload) => setText(payload);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={changeCatagory}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.gray }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={changeCatagory}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.gray,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        returnKeyType="done"
        onChangeText={onChangeText}
        style={styles.input}
        value={text}
        placeholder={working ? "Add a To Do." : "Where do you want to go?"}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              {/* <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Fontisto name="trash" size={18} color="white" />
              </TouchableOpacity> */}
              <View
                style={{ justifyContent: "flex-start", flexDirection: "row" }}
              >
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={() => toggleCompleteToDo(key)}
                >
                  <Fontisto
                    name={
                      toDos[key].isCompleted
                        ? "checkbox-active"
                        : "checkbox-passive"
                    }
                    size={18}
                    color="white"
                  />
                </TouchableOpacity>
                <Text
                  style={
                    toDos[key].isCompleted
                      ? {
                          ...styles.toDoText,
                          textDecorationLine: "line-through",
                        }
                      : styles.toDoText
                  }
                >
                  {toDos[key].text}
                </Text>
              </View>
              <View
                style={{ justifyContent: "flex-end", flexDirection: "row" }}
              >
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={() => editToDo(key)}
                >
                  <FontAwesome5 name="pencil-alt" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    // color: theme.gray,
    fontSize: 38,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
