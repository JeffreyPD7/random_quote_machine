
'use strict';

var express = require('express');
var app = express();

var port = process.env.PORT || 7000;
var environment = process.env.NODE_ENV;

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

// app.get('/', function (req, res) {
//     res.send('Hello World!');
// });

app.use(express.static('./build/'));

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
    console.log('\n__dirname = ' + __dirname +
        '\nprocess.cwd = ' + process.cwd());
});
