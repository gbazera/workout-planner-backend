require('dotenv').config()

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const routineRoutes = require('./routes/routines')
const userRoutes = require('./routes/user')

const app = express();

app.use(cors({
    origin: 'https://workout-planner-gb.netlify.app',
    credentials: true
}))

app.use(express.json())

app.use((req, res, next)=>{
    console.log(req.path, req.method)
    next()
})

app.use('/api/routines', routineRoutes)
app.use('/api/user', userRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(process.env.PORT, () => {
            console.log('connected to db and listening on port', process.env.PORT);
        });
    })
    .catch((err)=>{
        console.log(err)
    })