import React, { useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  View,
} from 'react-native';
import {
  Appbar,
  Title,
  Surface,
  Card,
  Paragraph,
  Button,
  Divider,
  Menu,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [score, setScore] = useState(20);
  const [visible, setVisible] = React.useState(false);
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

  useEffect(() => {
    fetchData();
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
            <Menu.Item onPress={() => {}} title="Payment History" />
          </Menu>
        </View>
      </Appbar.Header>

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
});

export default HomeScreen;
