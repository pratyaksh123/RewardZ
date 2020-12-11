const functions = require('firebase-functions');
const Razorpay = require('razorpay');
var key_id = 'rzp_test_pwiXBQGNe4sFik';
var key_secret = '2lizSTEOzZpzBFsohYaYUoVn';
var instance = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

exports.order = functions.https.onCall(async (data) => {
  const { amount } = data;
  var options = {
    amount: amount ? amount : 20, // amount in the smallest currency unit
    currency: 'INR',
    receipt: 'order_rcptid_11',
  };
  var orderData;
  await instance.orders.create(options, function (err, order) {
    if (err) {
      console.log(err);
      return err;
    }
    orderData = order;
  });
  console.log(orderData);
  return orderData;
});
