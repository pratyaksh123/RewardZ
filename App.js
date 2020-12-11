import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  View,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import Navigator from './App/Navigator/Stack';

import RazorpayCheckout from 'react-native-razorpay';
import { firebase } from '@react-native-firebase/functions';

class ButtonBasics extends Component {
  async _onPressButton() {
    const { data } = await firebase.functions().httpsCallable('order')({
      amount: parseInt(100),
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
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button onPress={this._onPressButton} title="Press Me" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20,
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

// Wrap Here with a HOC if required.
export default () => {
  return <Navigator />;
};
