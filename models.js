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
    stoppedStartTime:   String,
    status:             String
});

let Trailer = mongoose.model('trailers',trailerSchema);

const locationsSchema = mongoose.Schema({
    truckid:            Number,
    latitude:           Number,
    longitude:          Number
});

let Location = mongoose.model('locations',locationsSchema);

const driversSchema = mongoose.Schema({
    id:                 Number,
    first_name:         String,
    last_name:          String,
    email:              String,
    truckid:            Number
})

let Driver =mongoose.model('drivers',driversSchema);

const updatelogSchema = mongoose.Schema({
    logtime: {type: Date, default: Date.now},
    rownum:     Number,
    updated:    Number
});

let Updatelog = mongoose.model('updatelogs',updatelogSchema);

module.exports = {
    Trailer:Trailer,
    Updatelog:Updatelog,
    Driver:Driver,
    Location:Location
}