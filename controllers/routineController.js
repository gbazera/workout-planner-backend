const Routine = require('../models/routineModel')
const mongoose = require('mongoose')

//get all routines
const getRoutines = async (req, res) => {
    const user_id = req.user._id

    const routines = await Routine.find({ user_id }).sort({ createdAt: -1 })

    res.status(200).json(routines)
}

//get a single routine
const getRoutine = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such routine.' })
    }

    const routine = await Routine.findById(id)

    if (!routine) {
        return res.status(400).json({ error: 'No such routine.' })
    }

    res.status(200).json(routine)
}

//create a new routine
const createRoutine = async (req, res) => {
    const { title, exercises } = req.body

    if (!title) {
        return res.status(400).json({ error: 'Please enter the title', title })
    }

    try {
        const user_id = req.user._id
        const routine = await Routine.create({ title, exercises, user_id })
        res.status(200).json(routine)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//delete a routine
const deleteRoutine = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such routine.' })
    }

    const routine = await Routine.findOneAndDelete({ _id: id })

    if (!routine) {
        return res.status(400).json({ error: 'No such routine.' })
    }

    res.status(200).json(routine)
}

//update a routine
const updateRoutine = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such routine.' })
    }

    const routine = await Routine.findOneAndUpdate(
        { _id: id },
        {
            ...req.body,
        }
    )

    if (!routine) {
        return res.status(400).json({ error: 'No such routine.' })
    }

    res.status(200).json(routine)
}

module.exports = {
    getRoutines,
    getRoutine,
    createRoutine,
    deleteRoutine,
    updateRoutine,
}
