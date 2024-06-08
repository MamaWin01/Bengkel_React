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
  req.body.status = 0;

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
  if(!req.body.date || req.body.date == '') {
    req.body.date = new Date().toLocaleString()
  }

  let result = await bookList.find({nohp: req.body.nohp})
  req.body.BookID = req.body.nohp + result.length
  req.status = 0

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
    const list = await bookList.findOne({BookID: req.params.id,status:0})
    return res.status(200).json(list)
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }

}

const update = async (req, res) => {
    var list = await bookList.findOne({id: req.params.id})
    if(req.body.function == 'updateBackside') {
      list = await bookList.findOne({BookID: req.params.id})
      if(req.body.type == 'accept') {
        req.body.status = 1;
      } else {
        req.body.status = 2;
      }
      list = extend(list, req.body)
      try {
        await list.save()
        list.hashed_password = undefined
        list.salt = undefined
        res.json(list)

        return res;
      } catch (err) {
        return res.status(500).json({
          error: err.messages
        })
      }

    }

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
    if(!req.body.date || req.body.date == '') {
      req.body.date = new Date().toLocaleString()
    }
    if(req.body.type == 'delete') {
      req.body.status = 3;
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

const find = async (req, res) => {
  try {
    var result = await bookList.find({ status: {$in: [1,2,3]}}, BookListProjections)
    if(req.body.nohpOrBookID != '') {
        result = await bookList.find({BookID: req.body.nohpOrBookID, status: {$in: [1,2,3]}})
        console.log(result)
      if(result == null || result.length === 0) {
        result = await bookList.find({nohp: req.body.nohpOrBookID, status: {$in: [1,2,3]}})
      }
    }

    return res.status(200).json({result})
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
  find
}