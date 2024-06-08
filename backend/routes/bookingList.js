import express from 'express'
import AuthController from '../controllers/AuthController.js'
import bookingListController from '../controllers/bookingListController.js'

const router = express.Router()

router.route('/api/bookingList')
      .get(AuthController.checkSignin,bookingListController.findAll)
      .post(AuthController.checkSignin,bookingListController.create)

router.route('/api/bookingList/:id')
      .get(AuthController.checkSignin,bookingListController.read)
      .put(AuthController.checkSignin,bookingListController.update)

export default router;