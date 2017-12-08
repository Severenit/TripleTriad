"use strict";define([cardGame.gamePath+"js/views/game/GameScript.js",cardGame.gamePath+"js/models/Settings.js",cardGame.gamePath+"js/models/GameEngine.js"],function(e,a,t){return function(){let r,m=cardGame.gamePath+"js/views/game/game.html";return{play(e){let t={player1:a.getPlayer1Name(),player2:!0===e?void 0:a.getPlayer2Name(),onePlayer:!0===e,gamePath:cardGame.gamePath};$.get(m,function(a){let r=Handlebars.compile(a);cardGame.$container.find(".board__game-area").html(r(t)),Routes.get(Routes.getKeys().START_GAME)(e)})},startGame(a){let m=(r=new t).initGame(a);e.startGame(m)},playerPlaysCard(a,...t){let m=r.playerPlaysCard(a,...t);e.playCard(...m)},AIPlaysCard(){let a=r.AIPlaysCard();e.playCard(...a)},endTurn(){let a=r.endTurn();a.isGameOver()?e.gameOver(a):e.newTurn(a)}}}()});