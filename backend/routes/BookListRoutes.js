import express from 'express'
import bookListController from '../controllers/bookListController.js'
import AuthController from '../controllers/AuthController.js'

const router = express.Router()

router.route('/api/bookList')
      .get(AuthController.checkSignin,bookListController.findAll)
      .post(bookListController.create)

router.route('/api/bookList/:id')
      .get(bookListController.read)
      .put(bookListController.update)

router.route('/api/bookHistory')
      .post(AuthController.checkSignin,bookListController.find)

export default router;