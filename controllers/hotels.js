const { ObjectID } = require("bson");
const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Transaction = require("../models/transaction");

exports.list = async function (req, res, next) {
  //output: return list all hotels
  const hotelList = await Hotel.find();
  res.json(hotelList);
};

exports.add = async (req, res, next) => {
  const {
    name,
    type,
    city,
    address,
    distance,
    photos,
    desc,
    rating,
    featured,
    rooms,
  } = req.body;
  console.log(req.body);

  try {
    Hotel.create({
      name,
      type,
      city,
      address,
      distance,
      photos,
      desc,
      rating,
      featured,
      rooms,
    });
    res.status(200).json("Success");
  } catch (err) {
    res.send({ status: "err" });
  }
};

exports.delete = async (req, res, next) => {
  try {
    Hotel.findByIdAndDelete({ _id: req.query.id })
      .exec()
      .then((doc) => {
        if (!doc) {
          return res.status(400).end();
        }
        return res.status(200).end();
      });
  } catch (err) {
    res.send({ status: "err" });
  }
};

exports.detail = async function (req, res, next) {
  try {
    const hotel = await Hotel.findOne({ _id: req.query.id });
    if (hotel) res.send(hotel);
    else res.send("Not Found!");
  } catch (err) {
    res.send({ status: "err" });
  }
};

exports.search = async function (req, res, next) {
  //input from req.query: {city, startDate, endDate, roomRequired}
  // output: list hotel
  const hotels = await Hotel.find({ city: req.query.city });
  const rooms = await Room.find();
  const transactions = await Transaction.find();
  //Count total rooms of a hotel
  const totalRoom = (id) => {
    let count = 0;
    for (let i = 0; i < hotels[id].rooms.length; i++) {
      const roomNum = rooms
        .filter((room) => room.id == hotels[id].rooms[i])
        .map((room) => room.roomNumbers)[0];
      count += roomNum.length;
    }
    return count;
  };

  //Count Num of rooms of a hotel that booking in req query date
  const bookingRoom = (id) => {
    let count = 0;
    const transaction = transactions.filter(
      (transaction) => transaction.hotel.toString() === hotels[id].id
    );
    transaction.map(function (trans) {
      if (
        !(
          Date.parse(req.query.endDate) < Date.parse(trans.dateStart) ||
          Date.parse(req.query.startDate) > Date.parse(trans.dateEnd)
        )
      ) {
        count++;
      }
    });
    return count;
  };

  const result = [];

  for (let i = 0; i < hotels.length; i++) {
    if (totalRoom(i) - bookingRoom(i) >= req.query.roomRequired) {
      result.push(hotels[i]);
    }
  }
  res.send(result);
};

exports.homePage = async function (req, res, next) {
  //output: return list of hotels group by city, by type and 3 hotel top rating

  const cityHN = await Hotel.find({ city: "Ha Noi" });
  const cityHCM = await Hotel.find({ city: "Ho Chi Minh" });
  const cityDN = await Hotel.find({ city: "Da Nang" });

  const typeHotel = await Hotel.find({ type: "hotel" });
  const typeApartment = await Hotel.find({ type: "apartment" });
  const typeResort = await Hotel.find({ type: "resort" });
  const typeVilla = await Hotel.find({ type: "villa" });
  const typeCabin = await Hotel.find({ type: "cabin" });

  const topHotel = await Hotel.find().sort({ rating: -1 }).limit(3).exec();
  res.json({
    city: { hn: cityHN, hcm: cityHCM, dn: cityDN },
    type: {
      hotel: typeHotel,
      apartment: typeApartment,
      resort: typeResort,
      villa: typeVilla,
      cabin: typeCabin,
    },
    top3Hotel: topHotel,
  });
};
