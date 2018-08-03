var express = require('express');
var axios = require('axios');
var jsonQuery = require('json-query')
var app = express();

const token = 'YXppekBkbXd0cmFucy5jb206cGFzc3dvcmQ=';

app.get('/', function (req, res) {
    var data;
    var ndata = [];
    var c=0;
    axios.get('https://api.us.spireon.com/api/assetStatus', {
        headers: {
          'Authorization': 'Basic ' + token
        }}).then(response => {
        data = response.data.data;
        for(var i = 0;i<data.length; i++)
        {
            if(data[i].name != null) {
                ndata.push({
                    "address":data[i].address,
                    "city":data[i].city,
                    "state":data[i].state,
                    "name":data[i].name,
                    "serial":data[i].serial,
                    "id":data[i].id,
                    "lat":data[i].lat,
                    "lng":data[i].lng,
                    "zip":data[i].zip,
                    "moving":data[i].moving,
                    "movingStartTime":data[i].movingStartTime,
                    "stopped":data[i].stopped,
                    "stoppedStartTime":data[i].stoppedStartTime
                })
            }
            // console.log(data[i]);
        }
        console.log(ndata);
      })
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});