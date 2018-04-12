# Real Time Web course repo - week 1
## What
For my first week of practice in the world of real-time web, I created a simple balloon game. The goal is to gain more point than the other team. You can score point by creating balloons and have them leave the screen, or by destroying the other team's balloons.

## Demo
View a demo [here](https://ballonnen.herokuapp.com/)

## How
### Getting started
To get started first clone this repository

`git clone git@github.com:hackshackshacks/real-time-web.git`

Secondly navigate to this project with your terminal

` cd projectPath `

Run npm install to collect the required packages

`npm install`

Run npm run watch to start the app and watch for changes with using [nodemon](https://www.npmjs.com/package/nodemon)

`npm run watch`

## Dependencies
### Socket.io
For this project I used [Socket.io](https://socket.io/) to enable real time updates in my app. Socket.io allows Javascript to emit changes which the server will relay to all active users.
