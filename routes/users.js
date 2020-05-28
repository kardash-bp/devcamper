const express = require('express')
const router = express.Router()
const User = require('../models/User')
// import route controller
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users')

const advancedQuery = require('../middleware/advancedQuery')
const { protect, authorize } = require('../middleware/auth')
router.use(protect)
router.use(authorize('admin'))

router.get('/', advancedQuery(User), getAllUsers)
router.get('/users/:id', getUser)
router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

module.exports = router
