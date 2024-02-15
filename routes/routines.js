const express = require('express')
const {
	getRoutines,
	getRoutine,
	createRoutine,
    deleteRoutine,
    updateRoutine
} = require('../controllers/routineController')

const router = express.Router()

router.get('/', getRoutines)

router.get('/:id', getRoutine)

// post a new routine
router.post('/', createRoutine)

router.delete('/:id', deleteRoutine)

router.patch('/:id', updateRoutine)

module.exports = router
