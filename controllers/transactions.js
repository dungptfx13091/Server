const Transaction = require("../models/transaction");
const Hotel = require("../models/hotel");

exports.list = async function (req, res, next) {
  //output: return list all transactions
  const transactionLists = await Transaction.find();
  res.json(transactionLists);
};

exports.lastest = async function (req, res, next) {
  //output: return lastest 8 transactions
  const transactionLists = await Transaction.find()
    .sort({ dateEnd: -1 })
    .limit(8)
    .exec();
  res.json(transactionLists);
};

exports.add = async (req, res, next) => {
  const { user, hotel, room, dateStart, dateEnd, price, payment, status } =
    req.body;

  try {
    Transaction.create({
      user,
      hotel,
      room,
      dateStart,
      dateEnd,
      price,
      payment,
      status,
    });
    res.status(200).json("Success");
  } catch (err) {
    res.send({ status: "err" });
  }
};

exports.userTrans = async function (req, res, next) {
  //output: return all transactions of a user (find user by email)
  const transactionLists = await Transaction.find({
    user: req.query.email,
  }).lean();
  const hotelList = await Hotel.find().lean();
  const findTitle = (id) => {
    return hotelList.filter((hotel) => hotel._id == id)[0].title;
  };

  const result = transactionLists.map((trans) => {
    return {
      ...trans,
      hotel: findTitle(trans.hotel),
    };
  });

  res.json(result);
};
