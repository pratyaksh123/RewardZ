const functions = require('firebase-functions');
const Razorpay = require('razorpay');
const crypto = require('crypto');
var key_id = 'rzp_test_xiuvC2dEYKTxOR';
var key_secret = 'F3nNFpvlkoQsKpG2GNmMcJMW';
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
  return orderData;
});

exports.confirmOrder = functions.https.onCall(async (data) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
  const text = razorpay_order_id + '|' + razorpay_payment_id;
  var signature = crypto
    .createHmac('sha256', key_secret)
    .update(text)
    .digest('hex');

  if (signature === razorpay_signature) {
    console.log('PAYMENT SUCCESSFULL');

    return 'Payment Successfull !';
  } else {
    return 'Payment Error!';
  }
});
