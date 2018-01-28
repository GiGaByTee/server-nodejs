var cool = require('cool-ascii-faces');
var express = require('express');
var cors = require('cors')
var app = express();
app.use(cors())
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var port = process.env.PORT || 8080;

var teams = require('./team.json');

app.get('/cool', function(request, response) {
    response.send(cool());
  });

app.listen(port);
console.log('Server started! At http://localhost:' + port);

//app.param('name', function(req, res, next, name) {

// check if the user with that name exists
// do some validations
// add -dude to the name
//var modified = name + '-dude';

// save name to the request
////req.name = modified;

//next();
//});


app.get('/football/teams', function (req, res) {

    res.send(teams);
});

app.get('/football/teams/:name', function (req, res) {
    var resTeam = findTeam(teams.teams, req.params.name);

    if (!resTeam) {
        reply = {
            errorMsg: "Football club with name '" + req.params.name + "' not found!"
        }
        res.send(reply);
    } else {
        res.send(resTeam);
    }
});

app.delete('/football/teams/:name', function (req, res) {
    var resTeam = findTeam(teams.teams, req.params.name);

    if (!resTeam) {
        reply = {
            errorMsg: "Football club with name '" + req.params.name + "' not found!"
        }
        res.send(reply);
    } else {
        // teams.teams.pop(resTeam);
        teams.teams = removeTeam(teams.teams, req.params.name);
        reply = {
            success: "Football club with name '" + req.params.name + "' was successfully deleted!"
        }
        res.send(reply);
    }
});

app.post('/football/teams/', function (req, res) {
    if (!req.body.shortName) {
        reply = {
            errorMsg: "shortName is required!"
        }
        res.status(400).send(reply);
    } else if (findTeam(teams.teams, req.body.shortName)) {
        reply = {
            errorMsg: "Football club with name '" + req.body.shortName + "' already exists!"
        }
        res.status(400).send(reply);

    } else {
        console.log(req.body);
        teams.teams.push(req.body);
        reply = {
            success: "Football club with name '" + req.body.shortName + "' was successfully added!"
        }
        res.send(reply);
    }
});

app.put('/football/teams/', function (req, res) {
    if (!req.body.shortName) {
        reply = {
            errorMsg: "shortName is required!"
        }
        res.status(400).send(reply);
    } else if (!findTeam(teams.teams, req.body.shortName)) {
        reply = {
            errorMsg: "Football club with name '" + req.body.shortName + "' not found!"
        }
        res.status(400).send(reply);

    } else {
        
        updateTeam(teams.teams, req.body);
        reply = {
            success: "Football club with name '" + req.body.shortName + "' was successfully updated!"
        }
        res.send(reply);
    }
});

function findTeam(arr, teamName) {
    for (var team in arr) {
        if (teamName == arr[team].shortName) {
            return arr[team];
        }
    }
}

function updateTeam(arr, updateBody) {
    for (var team in arr) {
        if (updateBody.shortName == arr[team].shortName) {
            arr[team].name = updateBody.name || arr[team].name;
            arr[team].code = updateBody.code || arr[team].code;
            arr[team].squadMarketValue = updateBody.squadMarketValue || arr[team].squadMarketValue;
            arr[team].crestUrl = updateBody.crestUrl || arr[team].crestUrl;
        }
    }
}

function removeTeam(arr, teamName) {
    return arr.filter(e => e.shortName !== teamName);
}