import React, { useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  Appbar,
  Title,
  Surface,
  Card,
  Paragraph,
  Button,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [score, setScore] = useState(20);
  const fetchData = () => {
    firestore()
      .collection('Assignments')
      .get()
      .then((snapshot) => {
        const temp = [];
        snapshot.forEach((doc) => {
          temp.push({ id: doc.id, data: doc.data() });
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
        <Appbar.Action icon="dots-vertical" />
      </Appbar.Header>
      <ScrollView>
        <Surface style={styles.surface}>
          <Title style={styles.heading}>Your Current Coins</Title>
          <Text style={styles.coins}>{score}</Text>
        </Surface>

        <Text style={{ fontSize: 12, marginLeft: 15, marginTop: 10 }}>
          Complete the following Assignments to earn points!
        </Text>
        {data.length === 0 && <Text>All Done !!</Text>}

        {data ? (
          data.map((t) => {
            if (!t.data.done) {
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
            }
          })
        ) : (
          <></>
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
