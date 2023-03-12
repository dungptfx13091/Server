const Transaction = require("../models/transaction");
const Hotel = require("../models/hotel");
const User = require("../models/user");

const formatDate = (date) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
};
const findDate = (startDate, endDate) => {
  return `${startDate} - ${endDate}`;
};

exports.list = async function (req, res, next) {
  //output: return list all transactions
  const transactionLists = await Transaction.find().lean();

  const userList = await User.find().lean();
  const findUser = (email) => {
    return userList.filter((user) => user.email == email)[0].userName;
  };

  const findUserResult = transactionLists.map((trans) => {
    return {
      ...trans,
      user: findUser(trans.user),
    };
  });

  const hotelList = await Hotel.find().lean();
  const findTitle = (id) => {
    return hotelList.filter((hotel) => hotel._id == id)[0].title;
  };

  const findTitleResult = findUserResult.map((trans) => {
    return {
      ...trans,
      hotel: findTitle(trans.hotel),
    };
  });
  const result = findTitleResult.map((trans) => {
    return {
      ...trans,
      date: findDate(formatDate(trans.dateStart), formatDate(trans.dateEnd)),
    };
  });
  res.json(result);
};

exports.lastest = async function (req, res, next) {
  //output: return lastest 8 transactions
  const transactionLists = await Transaction.find()
    .lean()
    .sort({ dateEnd: -1 })
    .limit(8)
    .exec();

  const userList = await User.find().lean();
  const findUser = (email) => {
    return userList.filter((user) => user.email == email)[0].userName;
  };

  const findUserResult = transactionLists.map((trans) => {
    return {
      ...trans,
      user: findUser(trans.user),
    };
  });

  const hotelList = await Hotel.find().lean();
  const findTitle = (id) => {
    return hotelList.filter((hotel) => hotel._id == id)[0].title;
  };

  const findTitleResult = findUserResult.map((trans) => {
    return {
      ...trans,
      hotel: findTitle(trans.hotel),
    };
  });
  const result = findTitleResult.map((trans) => {
    return {
      ...trans,
      date: findDate(formatDate(trans.dateStart), formatDate(trans.dateEnd)),
    };
  });
  res.json(result);
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

  const findTitleResult = transactionLists.map((trans) => {
    return {
      ...trans,
      hotel: findTitle(trans.hotel),
    };
  });

  const result = findTitleResult.map((trans) => {
    return {
      ...trans,
      date: findDate(formatDate(trans.dateStart), formatDate(trans.dateEnd)),
    };
  });

  res.json(result);
};
