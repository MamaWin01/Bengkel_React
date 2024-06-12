import mongoose from 'mongoose'

const bookingList = new mongoose.Schema({
  id: String,
  name: String,
  nohp: String,
  BookID: String,
  date: String,
  desc: String,
  status: Number
})

export default mongoose.model('bookList', bookingList, 'bookList');