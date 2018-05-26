const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const router = express.Router()

require('../models/Tracker')
const Tracker = mongoose.model('trackers')

const jsonParser = bodyParser.json()

// this route will return list of time tracker filtred by start at between two dates
router.get('/filter/between/:index?/:startAt?/:endAt?', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.status(401).send({ message: 'You are not allowed, please register or login' })
        } else {

            console.clear()

            // get dates from  params 
            dateStartAt = Math.abs(req.param('startAt', 0))
            dateEndtAt = Math.abs(req.param('endAt', 0))

            // get index from params
            index = req.param('index', 0)

                
            Tracker.find({
                startAt: {
                    $gt: dateStartAt, $lt: dateEndtAt
                },
                userId: authData.user._id
            })
            .sort({startAt : 'desc'})
            .then(users => {
                console.log(users)
                // get array of size equals to 10 or less
                range = (users.length > (index + 10)) ? 10 : (users.length - index)
                res.json(users.slice(index, range))
            }).catch(err => {
                console.log(err)
                res.json({
                    message: 'something wrong happend'
                })
            })
        }
    })
})


router.post('/new', verifyToken, jsonParser, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.status(401).send({ message: 'You are not allowed, please register or login' })
        } else {

            const userId = authData.user._id

            const newTimeTracker = new Tracker({
                userId: userId,
                startAt: req.body.startAt,
                endAt: req.body.endAt,
                duration: req.body.duration,
                breaks: req.body.breaks,
                description: req.body.description
            })

            newTimeTracker.save()
                .then(tracker => {
                    res.status(201).json({
                        message: 'Tracker created successfully',
                        id: tracker.id
                    })
                })
                .catch(err => {
                    console.log(err)
                    return
                })
        }
    })
})

// Format Of Token
// Authorization : Bearer <access_token>

// Verify Token 
function verifyToken(req, res, next) {
    // get auth header value
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(401)
    }
}

module.exports = router