document.addEventListener('DOMContentLoaded', function() {
    console.log('yay! it works!');

    var teamLogo = document.querySelectorAll('.team');
    var displayTeamName = document.getElementById('display-team-name');
    var displayTeamMarket = document.getElementById('display-team-market');
    var main = document.getElementById('main');
    var coachSpan = document.getElementById('coachSpan');
    var foundedSpan = document.getElementById('foundedSpan');
    var confSpan = document.getElementById('confSpan');
    var divSpan = document.getElementById('divSpan');
    var playerMainDisplay = document.getElementById('player-main')
    var playerDisplayDiv = document.getElementById('players-display');
    var gridItem = document.getElementById('grid');
    var playerBox = document.getElementById('playerBox');

    //buttons
    var standingBtn = document.getElementById('standing-btn');
    var teamStatsBtn = document.getElementById('team-btn');
    var displayTeamNameBtn = document.getElementById('display-team-name-btn');
    var addFavPlayerBtn = document.getElementById('add-fav-player-btn');
    var seeFavPlayerBtn = document.getElementById('see-fav-player-btn')

    var standingName = [];
    var standingWins = [];
    var standingLosses = [];

    // the URL of our backend to use in our AJAX calls:
    // var url = 'http://localhost:3000';
    var url = 'https://ancient-savannah-39262.herokuapp.com/';

    //on click event trigger
    $(teamLogo).on('click', function(ev) {
      ev.preventDefault();
      changeHeader();
      var teamID = $(this).attr('id');
      console.log('TEAM ID: ', teamID);
      var data = {
        queryString: teamID
      };
      $.ajax({
        url: url + 'team',
        method: 'POST',
        data: data,
        dataType: 'json'
      }).done(function(response) {
        console.log("RESPONSE: ", response);
        //change class of 76ers because of glitch
        if (response.name === '76ers') {
          $(main).attr('class', 'Sixers');
        } else {
          $(main).attr('class', response.name);
        }
        getPlayers(response);
        appendTeam(response);
        teamStatsBtn.id = teamID;
        findTeamStats();
        //see favorites
        $(seeFavPlayerBtn).on('click', function() {
          $(gridItem).empty();
          $('.basic-team-profile').css('display', 'none');
          $('.team-name').css('display', 'none');
          $('.charts').css('display', 'none');
          $.get(url + 'player/new', function(response) {
            if (response.length) {
              // console.log(response);
              seeFavPlayers(response);
            } else {
              console.log("none found");
            }
            //delete favorite
            var favoritePlayer = document.querySelectorAll('.favorite')
            $(favoritePlayer).on('click', function() {
              var chosenId = $(this).parent()[0].id;
              console.log('click: ', chosenId);
              var data = {
                id: chosenId
              };
              $.ajax({
                url: url + 'player/' + chosenId,
                dataType: 'json',
                data: data,
                method: 'delete'
              }).done(function(response) {
                console.log(response);
              }); // end ajax
            }); // end delete button
          });
        });
        var gridItemSelect = document.querySelectorAll('.grid-item');
        //click on player image
        $(gridItemSelect).on('click', function(ev) {
          $(seeFavPlayerBtn).css('display', 'none');
          ev.preventDefault();
          var playerID = $(this).attr('id');
          var playerImageSrc = $(this).find('img').attr('src');
          $('.team-name').css('display', 'none');
          $('#players-display').css('display', 'none');
          $('.basic-team-profile').css('display', 'none');
          var data = {
            queryString: playerID
          };
          $.ajax({
            url: url + 'player',
            method: 'POST',
            data: data,
            dataType: 'json'
          }).done(function(response) {
            console.log("PLAYER: ", response);
            var playerInfo = getPlayerInfo(response);
            var playerAvgStats = getPlayerAvgStats(response);
            var playerTtlStats = getPlayerTtlStats(response);
            appendPlayerInfo(playerInfo, playerImageSrc);
            makePlayerChart(playerInfo, playerAvgStats, playerTtlStats);
            //favorite the player
            $(addFavPlayerBtn).css('display', 'block');
            $(addFavPlayerBtn).on('click', function() {
              var newPlayer = {};
              newPlayer['firstName'] = response.first_name;
              newPlayer['lastName'] = response.last_name;
              newPlayer['fullName'] = response.full_name;
              newPlayer['id'] = response.id;
              newPlayer['birthPlace'] = response.birth_place;
              newPlayer['birthDate'] = response.birthdate;
              newPlayer['draftRound'] = response.draft.round;
              newPlayer['draftPick'] = response.draft.pick;
              newPlayer['draftYear'] = response.draft.year;
              newPlayer['experience'] = response.experience;
              newPlayer['jerseyNum'] = response.jersey_number;
              newPlayer['position'] = response.position;
              newPlayer['teamName'] = response.team.name;
              newPlayer['height'] = response.height;
              newPlayer['weight'] = response.weight;
              newPlayer['link'] = 'https://nba-players.herokuapp.com/players/' + response.last_name + '/' + response.first_name;
              $.ajax({
                url: url + 'player/new',
                method: 'POST',
                data: newPlayer,
                dataType: 'json'
              }).done(function(response) {
                console.log("response: ", response);
                console.log('post complete');
              });
            })
          })
        })
      })
    });

    $(standingBtn).on('click', function(ev) {
      ev.preventDefault();
      var data = {
        queryString: 'seasontd/2015/REG/standings'
      }
      $('#chart-container').css('display', 'block');
      $.ajax({
        url: url + 'standing',
        method: 'POST',
        data: data,
        dataType: 'json'
      }).done(function(response) {
        console.log("RESPONSE: ", response);
        standingName.length = 0;
        standingWins.length = 0;
        standingLosses.length = 0;
        getStandings(response);
      });
    });

    //Functions
    function getPlayerInfo(response) {
      var playerInfo = {
        fullName: response.full_name,
        id: response.id,
        birthPlace: response.birth_place,
        birthDate: response.birthdate,
        draftRound: response.draft.round,
        draftPick: response.draft.pick,
        draftYear: response.draft.year,
        experience: response.experience,
        jerseyNum: response.jersey_number,
        position: response.position,
        teamName: response.team.name,
        height: response.height,
        weight: response.weight,
      };
      return playerInfo;
    }

    function getPlayerTtlStats(response) {
      var playerTtlStats = {
        points: response.seasons[0].teams[0].total.points,
        assists: response.seasons[0].teams[0].total.assists,
        defReb: response.seasons[0].teams[0].total.defensive_rebounds,
        offReb: response.seasons[0].teams[0].total.offensive_rebounds,
        rebounds: response.seasons[0].teams[0].total.rebounds,
        minutes: response.seasons[0].teams[0].total.minutes,
        turnovers: response.seasons[0].teams[0].total.turnovers,
        fouls: response.seasons[0].teams[0].total.personal_fouls,
        steals: response.seasons[0].teams[0].total.steals,
        ftMade: response.seasons[0].teams[0].total.free_throws_made,
        ftAtt: response.seasons[0].teams[0].total.free_throws_att,
        blocks: response.seasons[0].teams[0].total.blocks,
        threeAtt: response.seasons[0].teams[0].total.three_points_att,
        threeMade: response.seasons[0].teams[0].total.three_points_made,
        twoAtt: response.seasons[0].teams[0].total.two_points_att,
        twoMade: response.seasons[0].teams[0].total.two_points_made,
        fgAtt: response.seasons[0].teams[0].total.field_goals_att,
        fgMade: response.seasons[0].teams[0].total.field_goals_made,
        fpPct: response.seasons[0].teams[0].total.field_goals_pct,
        twoPct: response.seasons[0].teams[0].total.two_points_pct,
        threePct: response.seasons[0].teams[0].total.three_points_pct,
        ftMade: response.seasons[0].teams[0].total.free_throws_pct
      }
      return playerTtlStats;
    }

    function getPlayerAvgStats(response) {
      var playerAvgStats = {
        points: response.seasons[0].teams[0].average.points,
        assists: response.seasons[0].teams[0].average.assists,
        defReb: response.seasons[0].teams[0].average.def_rebounds,
        offReb: response.seasons[0].teams[0].average.off_rebounds,
        rebounds: response.seasons[0].teams[0].average.rebounds,
        minutes: response.seasons[0].teams[0].average.minutes,
        turnovers: response.seasons[0].teams[0].average.turnovers,
        fouls: response.seasons[0].teams[0].average.personal_fouls,
        steals: response.seasons[0].teams[0].average.steals,
        ftMade: response.seasons[0].teams[0].average.free_throws_made,
        ftAtt: response.seasons[0].teams[0].average.free_throws_att,
        blocks: response.seasons[0].teams[0].average.blocks,
        threeAtt: response.seasons[0].teams[0].average.three_points_att,
        threeMade: response.seasons[0].teams[0].average.three_points_made,
        twoAtt: response.seasons[0].teams[0].average.two_points_att,
        twoMade: response.seasons[0].teams[0].average.two_points_made,
        fgAtt: response.seasons[0].teams[0].average.field_goals_att,
        fgMade: response.seasons[0].teams[0].average.field_goals_made
      }
      return playerAvgStats;
    }

    function seeFavPlayers(response) {
      $(gridItem).empty();
      for (var i = 0; i < response.length; i++) {
        console.log(response[i]);
        console.log('link: ', response[i].link);
        console.log('name: ', response[i].fullName);
        var playerDiv = document.createElement('div');
        $(playerDiv).attr('class', 'grid-item');
        $(playerDiv).attr('id', response[i].id);
        var h3 = document.createElement('h3');
        $(h3).text(response[i].fullName);
        var img = document.createElement('img');
        $(img).attr('src', response[i].link);
        $(img).attr('class', 'player-image');
        $(img).addClass('favorite');
        $(playerDiv).append(h3);
        $(playerDiv).append(img);
        $(grid).append(playerDiv);
      }
    }

    function appendPlayerInfo(playerInfo, playerImageSrc) {
      var playerDiv = document.createElement('div');
      $(playerDiv).attr('class', 'grid-item');
      $(playerDiv).attr('id', playerInfo.id);
      var h4 = document.createElement('h4');
      $(h4).text(playerInfo.fullName);
      var draftDiv = document.createElement('div');
      $(draftDiv).attr('id', 'draft-div');
      var h5 = document.createElement('h5');
      var h5a = document.createElement('h5');
      var h5b = document.createElement('h5');
      var h5c = document.createElement('h5');
      var h5d = document.createElement('h5');
      var h5e = document.createElement('h5');
      var h5f = document.createElement('h5');
      $(h5d).text('Draft Year: ' + playerInfo.draftYear);
      $(h5e).text('Round: ' + playerInfo.draftRound);
      $(h5f).text('Pick: ' + playerInfo.draftPick);
      $(h5c).text('Jersey Number: ' + playerInfo.jerseyNum);
      $(h5b).text('Team: ' + playerInfo.teamName);
      $(h5a).text('Birth Place: ' + playerInfo.birthPlace);
      $(h5).text('Position: ' + playerInfo.position);
      var img = document.createElement('img');
      $(img).attr('src', playerImageSrc);
      $(img).attr('class', 'player-image');
      $(playerDiv).append(img);
      $(playerMainDisplay).append(playerDiv);

      $(playerMainDisplay).append(h4);
      $(draftDiv).append(h5d);
      $(draftDiv).append(h5e);
      $(draftDiv).append(h5f);
      $(playerMainDisplay).append(draftDiv);
      $(playerMainDisplay).append(h5);
      $(playerMainDisplay).append(h5a);
      $(playerMainDisplay).append(h5b);
      $(playerMainDisplay).append(h5c);

    }

    function findTeamStats() {
      $(teamStatsBtn).on('click', function(ev) {
        ev.preventDefault();
        $('#chart-container').css('display', 'none');
        var data = {
          queryString: teamStatsBtn.id
        };
        $.ajax({
          url: url + 'team-stats',
          method: 'POST',
          data: data,
          dataType: 'json'
        }).done(function(response) {
          console.log('TEAM: ', response);
          teamChart(response);
        })
      })
    }

    function changeHeader() {
      $("header.large-header .division h3").fadeOut();
      $("header.large-header h2").fadeOut();
      $("header.large-header .logo").fadeOut();
      $('#chart-container').css('display', 'none');
      $("header.large-header").css('height', '100%');
      $(main).css('display', 'block');
      $('.team-name').css('display', 'block');
      $('#players-display').css('display', 'block');
      $('.basic-team-profile').css('display', 'flex');
      $('#player-main').empty();
      $(seeFavPlayerBtn).css('display', 'block');
      $('.charts').css('display', 'none');
      $('.basic-team-profile').css('display', 'flex');
      $('.team-name').css('display', 'block');
    }

    function appendTeam(response) {
      var chosenTeamName = response.name;
      var chosenMarketName = response.market;
      $(displayTeamName).text(chosenTeamName);
      $(displayTeamNameBtn).text(chosenTeamName);
      $(displayTeamMarket).text(chosenMarketName);
      $(coachSpan).text(response.coaches[0].full_name);
      $(foundedSpan).text(response.founded);
      $(confSpan).text(response.conference.name);
      $(divSpan).text(response.division.name);
    };

    function getPlayers(response) {
      $(grid).empty();
      var playersArr = response.players;
      for (var i = 0; i < playersArr.length; i++) {
        var playerName = playersArr[i].full_name;
        var lastName = playersArr[i].last_name;
        var firstName = playersArr[i].first_name;
        var playerID = playersArr[i].id;
        var jerseyNum = playersArr[i].jersey_number;
        appendPlayers(playerName, lastName, firstName, playerID);
      }
    }

    function appendPlayers(playerName, lastName, firstName, playerID) {
      var playerDiv = document.createElement('div');
      $(playerDiv).attr('class', 'grid-item');
      $(playerDiv).attr('id', playerID);
      var h3 = document.createElement('h3');
      $(h3).text(playerName);
      var img = document.createElement('img');
      $(img).attr('src', 'https://nba-players.herokuapp.com/players/' + lastName + '/' + firstName);
      //if pic is missing change the source to this:
      $(img).error(function() {
        $(this).attr('src', 'images/not_found.png');
      });
      $(img).attr('class', 'player-image');
      $(playerDiv).append(h3);
      $(playerDiv).append(img);
      $(grid).append(playerDiv);
    }

    function getStandings(response) {
      var array = response.conferences;
      console.log(array);
      for (var i = 0; i < array.length; i++) {
        var divisionArr = array[i].divisions
        for (var j = 0; j < divisionArr.length; j++) {
          var teamsArr = divisionArr[j].teams;
          for (var k = 0; k < teamsArr.length; k++) {
            standingName.push(teamsArr[k].name);
            standingWins.push(teamsArr[k].wins);
            standingLosses.push(teamsArr[k].losses);
            console.log(standingName,standingWins,standingLosses);
          }
        }

      }
      standingsChart(standingName, standingWins, standingLosses);
    };

    function standingsChart(standingName, standingWins, standingLosses) {
      $('#standings').highcharts({
        chart: {
          type: 'column'
        },
        title: {
          text: 'Team Standings'
        },
        subtitle: {
          text: 'for 2015 Season'
        },
        xAxis: {
          categories: [standingName],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Games'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
          name: 'Wins',
          data: [standingWins]

        }, {
          name: 'Losses',
          data: [standingLosses]
        }]
      });
    };

    function makePlayerChart(playerInfo, playerAvgStats, playerTtlStats) {
      $('.charts').css('display', 'flex');
      $('#player-chart-container-1').css('display', 'block')
      $('#player-chart-container-2').css('display', 'block')
      $('#player-chart-container-1').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: playerInfo.fullName + ' Total Stats for 2015'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Totals',
          colorByPoint: true,
          data: [{
            name: 'Points',
            y: playerTtlStats.points,
            sliced: true,
            selected: true
          }, {
            name: 'Assists',
            y: playerTtlStats.assists
          }, {
            name: 'Blocks',
            y: playerTtlStats.blocks
          }, {
            name: 'Steals',
            y: playerTtlStats.steals
          }, {
            name: 'Rebounds',
            y: playerTtlStats.rebounds
          }, {
            name: 'Defensive Rebounds',
            y: playerTtlStats.defReb
          }, {
            name: 'Offensive Rebounds',
            y: playerTtlStats.offReb
          }]
        }]
      });

      $('#player-chart-container-2').highcharts({
        chart: {
          type: 'column'
        },
        title: {
          text: playerInfo.fullName + ' 2015 Stats.'
        },
        subtitle: {
          text: 'In ' + playerAvgStats.minutes + ' minutes per game.'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          title: {
            text: 'Stats'
          }

        },
        legend: {
          enabled: false
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y:.1f}'
            }
          }
        },

        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.1f}</b> per game<br/>'
        },

        series: [{
          name: 'Per Game Stats',
          colorByPoint: true,
          data: [{
            name: 'Points',
            y: playerAvgStats.points
          }, {
            name: 'Assists',
            y: playerAvgStats.assists
          }, {
            name: 'Blocks',
            y: playerAvgStats.blocks
          }, {
            name: 'Steals',
            y: playerAvgStats.steals
          }, {
            name: 'Field Goals Made',
            y: playerAvgStats.fgMade
          }, {
            name: 'Field Goals Attempted',
            y: playerAvgStats.fgAtt
          }, {
            name: 'Defensive Rebounds',
            y: playerAvgStats.defReb
          }, {
            name: 'Offensive Rebounds',
            y: playerAvgStats.offReb
          }, {
            name: 'Total Rebounds',
            y: playerAvgStats.rebounds
          }, {
            name: 'Free Throws Made',
            y: playerAvgStats.ftMade
          }, {
            name: 'Free Throws Attempted',
            y: playerAvgStats.ftAtt
          }, {
            name: 'Threes Made',
            y: playerAvgStats.threeMade
          }, {
            name: 'Threes Attempted',
            y: playerAvgStats.threeAtt
          }, {
            name: 'Turnovers',
            y: playerAvgStats.turnovers
          }]
        }],
      });
    };

    function teamChart(response) {
      $('#chart-container').css('display', 'block');
      $('#chart-container').highcharts({
        chart: {
          type: 'bar'
        },
        title: {
          text: 'Team Stats'
        },
        subtitle: {
          text: 'for 2015 NBA Season'
        },
        xAxis: {
          categories: ['Points', 'Assists', 'Blocks', 'Defensive Rebounds', 'Offensive Rebounds', 'Total Rebounds', 'Steals', 'Free Throws Made', 'Free Throws Attempted', 'Points in the Paint', 'Turnovers'],
          title: {
            text: null
          }
        },
        tooltip: {
          valueSuffix: ' per game'
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true
            }
          }
        },
        series: [{
          name: 'PER GAME STATS',
          data: [response.own_record.average.points, response.own_record.average.assists, response.own_record.average.blocks, response.own_record.average.def_rebounds, response.own_record.average.off_rebounds, response.own_record.average.rebounds, response.own_record.average.steals, response.own_record.average.free_throws_made, response.own_record.average.free_throws_att, response.own_record.average.paint_pts, response.own_record.average.turnovers]
        }]
      });
    }


  }) // end DOMContentLoaded
