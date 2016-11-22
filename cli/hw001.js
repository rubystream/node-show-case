'use strict';
/*
 * NodeJs Mentoring sessions - Homework 001
 *
 * From the file worldcupplayerinfo_20140701.tsv calculate:
 * - average years of the team,
 * - oldest team,
 * - youngest team,
 * - list of captains sorted by age
 *
 * The results should be stored in JSON file.
 */

/*
 * The data is in tab separated cvs file with header:
 * Group	Country	Rank	Jersey	Position	Age	Selections	Club	Player	Captain
 *
 * a simple data row is like:
 * A	Brazil	3	1	Goalie	31	9	Botafogo   	Jefferson	0
 * A	Brazil	3	3	Defender	29	46	Paris Saint-Germain  	Thiago Silva 	1
 */
const fs = require('fs');
const csv = require('fast-csv');

var stream = fs.createReadStream('./data/worldcupplayerinfo_20140701.tsv');
var csvParseOptions = {
  delimiter: '\t',
  headers: true,
  ignoreEmpty: true,
  trim: true
};

var teams = [],
  report = {};

function createTeams(data) {
  // find the team by its country
  var team = teams.find(item => {
    return item.country === data.Country;
  });
  // if we have not have this team before
  // create a new team and add it to the teams collection
  if (!team) {
    team = {};
    team.country = data.Country;
    team.ages = [];
    teams.push(team);
  }

  try {
    let age = parseInt(data.Age);
    team.ages.push(age);
    // if the Player is the Captain of the team
    // store it
    if (data.Captain === '1') {
      team.captain = {
        name: data.Player,
        age: age
      };
    }
  } catch (e) {
    console.log(e);
  }
}

function calcTeamAvgAge() {
  teams.forEach(team => {
    let sumOdAges = team.ages.reduce((total, age) => {
      return total + age;
    });

    team.avg = sumOdAges / team.ages.length;
  });
}

function generateReport() {
  // create teams section
  report.teams = [];
  teams.forEach(team => {
    report.teams.push({
      country: team.country,
      avg: team.avg
    });
  });
  // sort them by country name
  report.teams.sort((x, y) => {
    return ((x.country < y.country) ? -1 : ((x.country > y.country) ? 1 : 0));
  });
  // sort teams by avg ages
  teams.sort((a, b) => {
    return b.avg - a.avg;
  });
  // populate report with youngest and oldest team
  report.max = {
    country: teams[0].country,
    avg: teams[0].avg
  };
  report.min = {
    country: teams[teams.length - 1].country,
    avg: teams[teams.length - 1].avg
  };
  // create list of captains
  report.captains = [];
  teams.forEach((team) => {
    if (team.captain) {
      report.captains.push({
        country: team.country,
        name: team.captain.name,
        age: team.captain.age
      });
    }
  });
  // sort the captains list by age
  report.captains.sort((a, b) => {
    return b.age - a.age;
  });
}

// main program :-)
var csvStream = csv(csvParseOptions)
  .on('data', (data) => {
    // console.log(data);
    createTeams(data);
  })
  .on('error', (e) => {
    console.log('Error', e);
  })
  .on('end', () => {
    calcTeamAvgAge();
    generateReport();
    // console.log(report);

    // write report to json file
    fs.writeFile('./hw001_report.json', JSON.stringify(report), (err) => {
      if (err) throw err;
      console.log('Report is saved!');
    });
  });

stream.pipe(csvStream);
