var express = require('express');
var axios = require('axios');
var jsonQuery = require('json-query');
const mongoose = require('mongoose');
var app = express();
const url = 'http://localhost:3000/graphql';
var token;

// const token = 'YXppekBkbXd0cmFucy5jb206cGFzc3dvcmQ=';

// Import configuration and connect to DB
const { dbURL, dbName } = require('./config')
mongoose.connect(dbURL + '/' + dbName)

const models = require('./models')
var ObjectId = require('mongodb').ObjectID;

var minutes = 2.5, the_interval = minutes * 60 * 1000;
var switcher = 1;
var isError;

setInterval(function() {
    if(switcher == 1) {
        axios.post(url,{
            query: `{ token (service:"FleetNetwork"){ token } }`
        }).then(res => {
            if( res.data.data.token.length > 0) {
                token = res.data.data.token[0].token
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
                    // var newlog = new models.Updatelog({
                    //     rownum:     k,
                    //     updated:    c
                    // });
                    // newlog.save();
                    console.log("Trailers location updated successfully")
                }else console.log("success: false")
            })
            }
            else {
                console.log("Fetch data error!")
            }
        }).catch(e => {
            console.log("switcher = 1");
        })
        switcher = 2;
        console.log("switcher = 2")
    }

    if(switcher == 2) {
        axios.post(url,{
            query: `{ token (service:"NetworkFleet"){ token } }`
        }).then(res => {
            if( res.data.data.token.length > 0) {
                token = res.data.data.token[0].token
                axios.get('https://api.networkfleet.com/drivers?limit=1000',{
                    headers:{
                        'Content-Type':'application/vnd.networkfleet.api-v1+json',
                        'Accept':'application/vnd.networkfleet.api-v1+json',
                        'Authorization':'Bearer ' + token
                    }
                }).then(res => {
                    if(res.data.count)
                    {
                        var data = res.data.driver;
                        for(var i = 0;i<data.length; i++)
                        {
                            if(data[i].assignedVehicleIds)
                            {
                                models.Driver.update({"id":data[i]["@id"]},{$set:{"first_name":data[i].firstName,"last_name":data[i].lastName,"email":data[i].emailAddress,"truckid":data[i].assignedVehicleIds.id[0]}},{upsert:true,multi:false}, function(err, res){
                                if(err) {console.log(err); isError = 1;}
                                });
                            }
                            {
                                models.Driver.update({"id":data[i]["@id"]},{$set:{"first_name":data[i].firstName,"last_name":data[i].lastName,"email":data[i].emailAddress,"truckid":0}},{upsert:true}, function(err, res){
                                    if(err) {console.log(err); isError = 1;}
                                });
                            }
                        }
                        if(isError != 1) { console.log("Drivers data succesfully updated!"); }
                        if(isError == 1) { console.log("Seems access token invalid!")}
                    }
                    switcher = 3;
                    console.log("Switched = 3");
                }).catch(e => {
                    console.log("switched to 4")
                    switcher = 4;
                })
            }
            else {
                console.log("Fetch data error!")
            }
        }).catch(e => {
            // console.log(e);
            console.log("switcher = 2")
        })
    }

    if(switcher == 3) {
        axios.post(url,{
            query: `{ token (service:"NetworkFleet"){ token } }`
        }).then(res => {
            if( res.data.data.token.length > 0) {
                token = res.data.data.token[0].token
                axios.get('https://api.networkfleet.com/locations?limit=1000',{
                    headers:{
                        'Content-Type':'application/vnd.networkfleet.api-v1+json',
                        'Accept':'application/vnd.networkfleet.api-v1+json',
                        'Authorization':'Bearer ' + token
                    }
                }).then(res => {
                    if(res.data.count)
                    {
                        var data = res.data.gpsMessage;
                        for(var i = 0;i<data.length; i++)
                        {
                            models.Location.update({truckid:data[i].vehicleId},{$set:{"latitude":data[i].latitude,"longitude":data[i].longitude}},{upsert:true}, function(err, res){
                                if(err) {console.log(err); isError = 1;}
                            });
                        }
                        if(isError != 1) { console.log("Drivers location succesfully updated!"); }
                        if(isError == 1) { console.log("Seems access token invalid!")}
                    }
                    switcher = 1;
                    console.log("switcher = 1");
                }).catch(e => {
                    switcher = 4;
                    console.log("switcher = 4");
                })
            }
            else {
                console.log("Fetch data error!")
            }
        }).catch(e => {
            console.log("switcher = 3");
        })
    }
    if(switcher == 4) {
        axios.post("https://auth.networkfleet.com/token",
            "grant_type=password&username=Dispatch16&password=dispatch16",{
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic RGlzcGF0Y2gxNiBkaXNwYXRjaDE2"
            }
        }).then(res => {
            if(res.data) {
                axios.post(url,{
                    query: 'mutation { updateToken(service:"NetworkFleet",token:"' + res.data.access_token +'"){name service token }}'
                })
            }
            switcher = 1;
            console.log(res.data);
            console.log("Token successfully updated!")
            console.log("switcher = 1");
        }).catch(e => {
            console.log("switcher = 4");
        })

    }
}, the_interval)

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});