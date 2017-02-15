/**
 * Created by kaceria on 15.02.2017.
 */
var express = require('express');
var path = require('path');
var app = express();

app.use('/', express.static(path.join(__dirname, 'web')));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});