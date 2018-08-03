const mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const trailerSchema = mongoose.Schema({
    address:            String,
    city:               String,
    state:              String,
    name:               String,
    serial:             String,
    id:                 Number,
    lat:                String,
    lng:                String,
    zip:                Number,
    moving:             Boolean,
    movingStartTime:    String,
    stopped:            Boolean,
    stoppedStartTime:   String
});

let Trailer = mongoose.model('trailers',trailerSchema);

const updatelogSchema = mongoose.Schema({
    logtime: {type: Date, default: Date.now},
    rownum:     Number,
    updated:    Number
});

let Updatelog = mongoose.model('updatelogs',updatelogSchema);

module.exports = {
    Trailer:Trailer,
    Updatelog:Updatelog
}