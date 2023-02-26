const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Transaction = require("../models/transaction");

exports.list = async function (req, res, next) {
  //output: return list all rooms
  const roomLists = await Room.find();
  res.json(roomLists);
};

exports.add = async (req, res, next) => {
  const { title, price, maxPeople, desc, roomNumbers } = req.body;
  console.log(req.body);

  try {
    Room.create({ title, price, maxPeople, desc, roomNumbers });
    res.status(200).json("Success");
  } catch (err) {
    res.send({ status: "err" });
  }
};

exports.delete = async (req, res, next) => {
  try {
    Room.findByIdAndDelete({ _id: req.query.id })
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

exports.search = async function (req, res, next) {
  //input from req.query: {hotel_id, startDate, endDate }
  //output :list rooms of hotel (find by id) that not booking
  const hotel = await Hotel.findOne({ _id: req.query.id });
  const totalRooms = await Room.find();

  const rooms = [];
  for (let i = 0; i < hotel.rooms.length; i++) {
    for (let j = 0; j < totalRooms.length; j++) {
      if (totalRooms[j]._id.toString() == hotel.rooms[i].toString()) {
        rooms.push(totalRooms[j]);
      }
    }
  }

  const transactions = await Transaction.find({ hotel: req.query.id });
  const roomFilter = (roomNum) => {
    for (let i = 0; i < transactions.length; i++) {
      if (
        !(
          Date.parse(req.query.endDate) <
            Date.parse(transactions[i].dateStart) ||
          Date.parse(req.query.startDate) > Date.parse(transactions[i].dateEnd)
        )
      ) {
        for (let j = 0; j < transactions[i].room.length; j++) {
          const bookingRoom = transactions[i].room[j];
          roomNum.splice(roomNum.indexOf(bookingRoom), 1);
        }
      }
    }
    return roomNum;
  };
  for (let i = 0; i < rooms.length; i++) {
    rooms[i].roomNumbers = roomFilter(rooms[i].roomNumbers);
  }
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].roomNumbers.length == 0) {
      rooms.splice(i, 1);
    }
  }

  res.json(rooms);
};
