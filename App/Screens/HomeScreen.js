import React, { useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  View,
  TouchableHighlight,
  Modal,
  FlatList,
} from 'react-native';
import {
  Appbar,
  Title,
  Surface,
  Card,
  Paragraph,
  Button,
  Menu,
  List,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [score, setScore] = useState(20);
  const [visible, setVisible] = React.useState(false);
  const [history, setHistory] = useState([]);
  var menuRef;
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const fetchData = () => {
    firestore()
      .collection('Assignments')
      .get()
      .then((snapshot) => {
        const temp = [];
        snapshot.forEach((doc) => {
          if (!doc.data().done) {
            temp.push({ id: doc.id, data: doc.data() });
          }
        });
        setData(temp);
      });
  };

  const fetchPayments = () => {
    firestore()
      .collection('Payments')
      .get()
      .then((snapshot) => {
        const temp = [];
        snapshot.forEach((doc) => {
          temp.push({ id: doc.id, data: doc.data() });
        });
        setHistory(temp);
      });
  };

  navigation.addListener('didFocus', () => {
    fetchPayments();
  });
  useEffect(() => {
    fetchData();
    fetchPayments();
    const subscriber = firestore()
      .collection('Score')
      .doc('RealTimeScore')
      .onSnapshot((documentSnapshot) => {
        setScore(documentSnapshot.data().data);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  const update = (id) => {
    firestore()
      .collection('Assignments')
      .doc(id)
      .update({
        done: true,
      })
      .then(() => {
        fetchData();
      });
    firestore()
      .collection('Score')
      .doc('RealTimeScore')
      .update({
        data: score + 10,
      });
  };
  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Home" />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Appbar.Action
                ref={menuRef}
                icon="dots-vertical"
                onPress={openMenu}
                color="white"
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              title="Payment History"
            />
          </Menu>
        </View>
      </Appbar.Header>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Your Payment History</Text>
            <FlatList
              data={history}
              renderItem={(t) => {
                if (t.item.data.sucess) {
                  return (
                    <List.Item
                      titleStyle={{ color: 'green', fontSize: 15 }}
                      style={{ alignItems: 'center', justifyContent: 'center' }}
                      title={`Payment Recived`}
                      right={() => {
                        return (
                          <Text
                            style={{ color: 'green', fontSize: 15 }}
                          >{`₹${t.item.data.value}`}</Text>
                        );
                      }}
                      left={(props) => (
                        <Icon
                          name="check-circle"
                          size={20}
                          style={{ alignSelf: 'center' }}
                          color="green"
                        />
                      )}
                    />
                  );
                } else {
                  return (
                    <List.Item
                      titleStyle={{ color: 'red', fontSize: 15 }}
                      style={{ alignItems: 'center', justifyContent: 'center' }}
                      title={`Payment Declined`}
                      right={() => {
                        return (
                          <Text
                            style={{ color: 'red', fontSize: 15 }}
                          >{`₹${t.item.data.value}`}</Text>
                        );
                      }}
                      left={(props) => (
                        <Icon
                          name="times-circle-o"
                          size={20}
                          style={{ alignSelf: 'center' }}
                          color="red"
                        />
                      )}
                    />
                  );
                }
              }}
            />

            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: '#eb4934',
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView>
        <Surface style={styles.surface}>
          <Title style={styles.heading}>Your Current Coins</Title>
          <Text style={styles.coins}>{score}</Text>
        </Surface>
        {data && data.length === 0 && (
          <>
            <ImageBackground
              source={require('../Assets/Images/checklist.png')}
              style={{
                width: Dimensions.get('screen').width,
                height: Dimensions.get('screen').height / 2,
                marginTop: -40,
              }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 20, textAlign: 'center' }}>
              All Tasks Done For Now !
            </Text>
          </>
        )}
        {data && data.length !== 0 && (
          <Text style={{ fontSize: 12, marginLeft: 15, marginTop: 10 }}>
            Complete the following Assignments to earn points!
          </Text>
        )}

        {data ? (
          data.map((t) => {
            return (
              <Card key={t.data.title} style={{ margin: 15, elevation: 6 }}>
                <Card.Content>
                  <Title>{t.data.title}</Title>
                  <Paragraph>Due Date -{t.data.due}</Paragraph>
                </Card.Content>
                <Card.Cover source={{ uri: t.data.url }} />
                <Card.Actions>
                  <Button
                    onPress={() => {
                      update(t.id);
                    }}
                  >
                    Mark as Done
                  </Button>
                </Card.Actions>
              </Card>
            );
          })
        ) : (
          <ActivityIndicator />
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 5,
  },
  coins: {
    fontSize: 30,
    textAlign: 'center',
  },
  surface: {
    elevation: 4,
    width: Dimensions.get('screen').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    height: 300,
    width: Dimensions.get('screen').width - 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginLeft: Dimensions.get('screen').width / 2 - 40,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;
