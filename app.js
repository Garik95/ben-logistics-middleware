var express = require('express');
var axios = require('axios');
var jsonQuery = require('json-query');
const mongoose = require('mongoose');
var app = express();

const token = 'YXppekBkbXd0cmFucy5jb206cGFzc3dvcmQ=';

// Import configuration and connect to DB
const { dbURL, dbName } = require('./config')
mongoose.connect(dbURL + '/' + dbName)

const models = require('./models')
var ObjectId = require('mongodb').ObjectID;

app.get('/', function (req, res) {
    var data;
    var ndata = [];
    var k=0; // not null data counter
    var c=0; // updated doc number
    axios.get('https://api.us.spireon.com/api/assetStatus', {
        headers: {
          'Authorization': 'Basic ' + token
        }}).then(response => {
        if(response.data.success === true){
            data = response.data.data;
            for(var i = 0;i<data.length; i++)
            {
                if(data[i].name != null) {
                    models.Trailer.update(
                        {"id":data[i].id},
                        {"$set":{
                            "address":data[i].address,
                            "city":data[i].city,
                            "state":data[i].state,
                            "name":data[i].name,
                            "serial":data[i].serial,
                            "lat":data[i].lat,
                            "lng":data[i].lng,
                            "zip":data[i].zip,
                            "moving":data[i].moving,
                            "movingStartTime":data[i].movingStartTime,
                            "stopped":data[i].stopped,
                            "stoppedStartTime":data[i].stoppedStartTime
                        }
                    },{upsert:true},function(err,res){
                        if(err) console.log(err);
                        else c++;
                    })
                    k++;
                }
            }
            var newlog = new models.Updatelog({
                rownum:     k,
                updated:    c
            });
            newlog.save();
            console.log(c + " docs updated")
        }else console.log("success: false")
      })
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});