const mongoose = require('mongoose')
const Schema = mongoose.Schema


const BreakSchema = new Schema({
    startAt:{
        type: Date,
        required: true
    },
    resumeAt:{
        type: Date,
        required: true
    },
    duration:{
        type: Number,
        required: true
    }
})

const TrackerSchema = new Schema({
    userId:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    startAt:{
        type: Date,
        required: true
    },
    endAt:{
        type: Date,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    breaks: [BreakSchema]
})

mongoose.model('trackers', TrackerSchema)