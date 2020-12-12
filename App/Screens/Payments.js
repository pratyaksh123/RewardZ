import React, { useEffect, useState } from 'react';
import { Button, TextInput, Text, HelperText, List } from 'react-native-paper';
import {
  Dimensions,
  ImageBackground,
  View,
  Modal,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { firebase } from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const PaymentScreen = ({ params }) => {
  const [text, setText] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [couponApplied, setApplied] = React.useState({
    applied: false,
    value: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [score, setScore] = useState(0);
  const _onPressButton = async () => {
    const { data } = await firebase.functions().httpsCallable('order')({
      amount: (parseInt(text) - couponApplied.value) * 100,
    });
    const verify = async (data) => {
      const res = await firebase.functions().httpsCallable('confirmOrder')(
        data
      );
      if (res.data === 'Payment Successfull !') {
        firestore().collection('Payments').add({
          value: text,
          sucess: true,
          data: data,
        });
        if (couponApplied.applied) {
          firestore()
            .collection('Coupons')
            .doc(couponApplied.id)
            .delete()
            .then(() => {
              Alert.alert(res.data, 'Thank You');
              fetchCoupons();
            });
        }
      } else {
        Alert.alert(res.data);
      }
    };
    var options = {
      description: 'Semester Fees',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_xiuvC2dEYKTxOR',
      order_id: `${data.id}`,
      amount: `${data.amount}`,
      name: 'Pratyaksh Tyagi',
      prefill: {
        email: 'void@razorpay.com',
        contact: '9191919191',
        name: 'Razorpay Software',
      },
      theme: { color: '#F37254' },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        verify(data);
      })
      .catch((error) => {
        // handle failure
        console.log(error);
        Alert.alert(`Error`, `${error.description}`);
      });
  };
  console.log(couponApplied);
  const fetchCoupons = () => {
    firestore()
      .collection('Coupons')
      .get()
      .then((snapshot) => {
        const temp = [];
        snapshot.forEach((doc) => {
          temp.push({ id: doc.id, data: doc.data() });
        });
        setCoupons(temp);
      });
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('Score')
      .doc('RealTimeScore')
      .onSnapshot((documentSnapshot) => {
        setScore(documentSnapshot.data().data);
      });
    fetchCoupons();
    // Stop listening for updates when no longer required
    return () => {
      subscriber();
    };
  }, []);
  const redeemPoints = () => {
    // update the coupons in firestore
    if (score > 50) {
      firestore().collection('Coupons').add({
        value: 2000,
      });
      firestore()
        .collection('Score')
        .doc('RealTimeScore')
        .update({
          data: score - 50,
        })
        .then(() => {
          fetchCoupons();
          setModalVisible(!modalVisible);
        });
    } else {
      Alert.alert(
        'Error',
        'Sorry You can only avail discount coupons when you have points greater than 50'
      );
    }
  };
  const redeemCoupons = (t) => {
    setApplied({ applied: true, value: t.item.data.value, id: t.item.id });
  };

  return (
    <ScrollView>
      <ImageBackground
        source={require('../Assets/Images/finance.png')}
        style={{
          width: Dimensions.get('screen').width,
          height: 200,
        }}
      />
      <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 20 }}>
        Now easily pay your fees using razorpay and get Rewarded!
      </Text>
      <View style={{ margin: 20 }}>
        <TextInput
          style={{ marginVertical: 10, backgroundColor: 'white' }}
          label="Amount(₹)"
          value={text}
          keyboardType="number-pad"
          onChangeText={(text) => setText(text)}
        />
        {text >= 5000 ? (
          <Button
            style={{ width: 150, alignSelf: 'center' }}
            mode="contained"
            onPress={_onPressButton}
          >
            Pay Now
          </Button>
        ) : (
          <>
            <Button
              style={{ width: 150, alignSelf: 'center' }}
              mode="contained"
              onPress={_onPressButton}
              disabled={true}
            >
              Pay Now
            </Button>
            <HelperText
              style={{ textAlign: 'center' }}
              type="error"
              visible={() => {
                return text >= 5000;
              }}
            >
              Minimum Amount is INR 5000
            </HelperText>
          </>
        )}
        {couponApplied.applied && (
          <>
            <List.Item
              titleStyle={{ color: 'green', fontSize: 13 }}
              title={`₹${couponApplied.value} Coupon will be Applied at checkout !`}
              left={(props) => (
                <Icon
                  name="check-circle"
                  size={20}
                  style={{ alignSelf: 'center' }}
                  color="green"
                />
              )}
            />
            <Text></Text>
          </>
        )}
        <Text style={{ margin: 20, marginBottom: 5, textAlign: 'center' }}>
          Want Discounts ?{' '}
        </Text>
        <Button
          style={{ width: 300, alignSelf: 'center' }}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
          mode="contained"
        >
          Redeem your Points
        </Button>
      </View>
      {coupons.length !== 0 && (
        <>
          <List.Section title="Your Coupons"></List.Section>
          <FlatList
            data={coupons}
            renderItem={(t) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    console.log(t);
                    redeemCoupons(t);
                  }}
                >
                  <List.Item
                    title="Coupon"
                    description={`Value - ₹${t.item.data.value}`}
                    left={(props) => <List.Icon {...props} icon="offer" />}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}

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
            <Text style={styles.modalText}>Your Current Points : {score} </Text>

            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: '#2196F3',
                  marginRight: 20,
                }}
                onPress={() => {
                  redeemPoints();
                }}
              >
                <Text style={styles.textStyle}>Redeem</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: '#eb4934' }}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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

export default PaymentScreen;
