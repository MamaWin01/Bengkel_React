import generator from '../helpers/generator.js'
import bookList from '../models/bookList.js'
import extend from 'lodash/extend.js'

const BookListProjections = {
  '_id': false,
  '__v': false
}

const findAll = async (req, res) => {
  try {
    let result = await bookList.find({status: 0}, BookListProjections)
    return res.status(200).json({result})
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const create = async (req, res) => {
  req.body.id = generator.generateId(6)
  console.log(req.body)

  if(!req.body.name || req.body.name == '') {
    return res.status(200).json({
      error: "Nama harus terisi",
      data: req.body
    })
  }
  if(!req.body.nohp || req.body.nohp == '') {
    return res.status(200).json({
      error: "No Hp harus terisi",
      data: req.body
    })
  }
  if(isNaN(req.body.nohp)) {
    return res.status(200).json({
      error: "No Hp harus berisi angka",
      data: req.body
    })
  }
  if(!req.body.desc || req.body.desc == '') {
    return res.status(200).json({
      error: "Descripsi harus terisi",
      data: req.body
    })  
  }
  if(!req.body.date || req.body.date == '') {
    req.body.date = new Date().toLocaleString()
  }

  let result = await bookList.find()
  req.body.BookID = req.body.nohp + result.length

  const list = new bookList(req.body)

  try {
    let result = await list.save()
    return res.status(200).json({
      messages: 'Booking List successfully added',
      result
    })
  } catch (err) {
    return res.status(500).json({
      error: 'Booking List failed to be added',
    })
  }
}

const read = async (req, res) => {
  try {
    const list = await bookList.findOne({BookID: req.params.bookid})
    return res.status(200).json(list)
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }

}

const update = async (req, res) => {
    console.log(req.body)
    var list = await bookList.findOne({bookID: req.params.bookid})

    if(!req.body.name || req.body.name == '') {
        return res.status(200).json({
          error: "Nama harus terisi",
          data: req.body
        })
    }
    if(!req.body.nohp || req.body.nohp == '') {
    return res.status(200).json({
        error: "No Hp harus terisi",
        data: req.body
    })
    }
    if(isNaN(req.body.nohp)) {
    return res.status(200).json({
        error: "No Hp harus berisi angka",
        data: req.body
    })
    }
    if(!req.body.desc || req.body.desc == '') {
    return res.status(200).json({
        error: "Descripsi harus terisi",
        data: req.body
    })  
    }
    if(!req.body.date || req.body.date == '') {
    req.body.date = new Date().toLocaleString()
    }

    list = extend(list, req.body)
  try {
    await list.save()
    list.hashed_password = undefined
    list.salt = undefined
    res.json(list)
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

export default {
  findAll,
  create,
  read,
  update,
}