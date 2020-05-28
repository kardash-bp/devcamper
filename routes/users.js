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
router.get('/:id', getUser)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router
