import mongoose from 'mongoose'

const bookingList = new mongoose.Schema({
  id: String,
  name: String,
  nohp: Number,
  BookID: Number,
  date: String,
  desc: String,
  status: Number
})

export default mongoose.model('bookList', bookingList, 'bookList');