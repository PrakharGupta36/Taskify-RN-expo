import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

function Task({ index, task, item, onDelete }) {
  const { buttonDelete, textStyle, taskItem } = styles;

  return (
    <View style={taskItem}>
      <Text style={{ marginTop: 30, marginBottom: 10 }}>
        {index + 1}.<Text style={task}> {item.text} </Text>
      </Text>
      <TouchableWithoutFeedback onPress={onDelete}>
        <View style={buttonDelete}>
          <Text style={textStyle}> Delete </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default function App() {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);

  const { input, container, textStyle, button, list, task } = styles;

  function onChange(e) {
    setText(e);
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@storage_Key");
      return jsonValue != null ? setData(JSON.parse(jsonValue)) : null;
    } catch (e) {
      // error reading value
    }
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@storage_Key", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    storeData(data);
  }, [data]);

  function onPress() {
    if (text.length) {
      setData([...data, { id: Math.random(), text: text }]);
      console.log(data);
    }
    setText("");
  }

  function onDelete(e) {
    const filterData = data.filter((data) => e.id !== data.id);

    setData(filterData);
    storeData(filterData);
  }

  return (
    <SafeAreaView>
      <View style={container}>
        <TextInput
          onChangeText={onChange}
          style={input}
          value={text}
          placeholder='Enter task...'
        />
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={button}>
            <Text style={textStyle}> Add Task </Text>
          </View>
        </TouchableWithoutFeedback>
        <ScrollView style={list}>
          <View>
            {data.length ? (
              <FlatList
                data={data}
                keyExtractor={({ id }) => id}
                renderItem={({ item, index }) => (
                  <Task
                    index={index}
                    onDelete={() => onDelete(item)}
                    item={item}
                    task={task}
                  />
                )}
              />
            ) : (
              <Text> No task </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    margin: 12,
    paddingTop: 10,
  },
  textStyle: {
    fontSize: 12.5,
    color: "white",
  },
  input: {
    height: 40,
    padding: 10,
    borderWidth: 1,
    marginTop: 2,
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    borderWidth: 1,
    width: 80,
    height: 35,
    marginTop: 12,
    backgroundColor: "black",
  },
  buttonDelete: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    width: 80,
    height: 35,
    marginTop: 12,
    backgroundColor: "#e65757",
  },
  task: {
    fontSize: 16,
    fontWeight: "bold",
    position: "relative",
    top: 30,
  },
  list: {
    marginTop: 20,
    height: 600,
    marginBottom: 30,
  },
  taskItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
