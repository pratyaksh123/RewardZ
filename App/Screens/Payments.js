import React from 'react';
import { Button, TextInput, Text, HelperText } from 'react-native-paper';
import { Dimensions, ImageBackground, View } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { firebase } from '@react-native-firebase/functions';
import { useState } from 'react';

const PaymentScreen = ({ params }) => {
  const [text, setText] = useState(null);
  const _onPressButton = async () => {
    const { data } = await firebase.functions().httpsCallable('order')({
      amount: parseInt(text) * 100,
    });
    console.log(data);

    var options = {
      description: 'Semester Fees',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_gUXuZCNgRyKBmN',
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
        alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };
  return (
    <View>
      <ImageBackground
        source={require('../Assets/Images/finance.png')}
        style={{
          width: Dimensions.get('screen').width,
          height: 200,
        }}
      />
      <Text style={{ textAlign: 'center', fontSize: 16, marginTop: 20 }}>
        Now easily pay your fees using razorpay !
      </Text>
      <View style={{ margin: 20 }}>
        <TextInput
          style={{ marginVertical: 10, backgroundColor: 'white' }}
          label="Amount"
          value={text}
          keyboardType="number-pad"
          onChangeText={(text) => setText(text)}
        />
        <TextInput
          style={{ marginVertical: 10, backgroundColor: 'white' }}
          label="Discount Code"
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
          <HelperText
            type="error"
            visible={() => {
              return text >= 5000;
            }}
          >
            Minimum Amount is INR 5000
          </HelperText>
        )}
        <Text style={{ marginTop: 50, marginBottom: 5, textAlign: 'center' }}>
          Want Discounts ?{' '}
        </Text>
        <Button style={{ width: 300, alignSelf: 'center' }} mode="contained">
          Redeem your Points
        </Button>
      </View>
    </View>
  );
};

export default PaymentScreen;
