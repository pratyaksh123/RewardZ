const functions = require('firebase-functions');
const Razorpay = require('razorpay');
var key_id = 'rzp_test_pwiXBQGNe4sFik';
var key_secret = '2lizSTEOzZpzBFsohYaYUoVn';
var instance = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

exports.order = functions.https.onCall((data) => {
  const {amount} = data;
  var options = {
    amount: amount, // amount in the smallest currency unit
    currency: 'INR',
    receipt: 'order_rcptid_11',
  };
  var order_id;
  instance.orders.create(options, function (err, order) {
    order_id = order;
  });
  return order_id;
});
