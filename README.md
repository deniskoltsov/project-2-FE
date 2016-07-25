## BBIG NBA APP
---
**Overview**

I decided to design a website that hits up a basketball stats API and send back data. A user can click on a team to view all their current players, also they can click to view that teams season stats using the highcharts.js plugin in an interesting and engaging way. When cycling through the players, the user can click on a particular player, get their season avg., and total stats and have the option to add them to their favorites.  

---
**How it works and the technologies it relies on.**

Technology used:
- html
- css
- javascript
- jquery
- highcharts.js
- sportsradar.com API
- Materialize CSS

---

**How it works.**

- The HTML has a couple of containers with a header in it.
- The CSS was more complicated, I had one CSS file dedicated only to team colors and color codes. Depending on which team the user clicked, the HTML would change to that teams color and style. Also there is a separate CSS file for the header.
- Javascript
  1. Set up global vars, and established my route url
  2. The main click event begins with the user picking a team, which triggers an AJAX call to the back end to make a request to the API.
  3. Once the click is done, the team name, coach, and other stats are appended into the DOM.
  4. When the response is received, I called the getPlayers function which took the response and then called another function to append the players to the main players div.
  5. Then I run the findTeamStats function which takes the team stats and stores it, so that when the user clicks on the [see 'team name' stats] button, the stats are taken and passed through a function that creates the highcharts table for the team stats.
  6. The user is also able to click on the individual player, at that point there is another AJAX call to get all of the players info and store it.
  7. Then another two functions take the stats and create two different types of highcharts for the selected player.
  8. Once the user clicks on a player, the option to add him to your favorites appears, which stores that player into an object and stores it into the database.
  9. The delete function is activated by just clicking on any of the favorite players, then the remove AJAX call is made and that player is removed from the db.

---

Comments:

  It was challenging to create because I had a vision in mind and tried to achieve it. I'm pretty proud of the outcome and there are a couple of things that I would like to add later. First I would like to add the ability to search through many years, not just the most recent. Compare stats and players and have a twitter API call for each players live twitter feed.
