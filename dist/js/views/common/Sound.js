"use strict";define([cardGame.gamePath+"js/models/Settings.js"],function(e){return function(){let t={GAME:"cardGameGameMusic",VICTORY:"cardGameVictoryMusic",MOVE_CARD:"moveCardSound",FLIP_CARD:"flipCardSound",SELECT:"selectSound",CANCEL:"cancelSound",SPECIAL:"specialSound",SELECTOR:"selectorSound"};return{getKeys:()=>t,stopAll(){let e=document.getElementsByTagName("audio");for(let t=0;t<e.length;t++)e[t].pause()},stopAllAndPlay(e){this.stopAll(),this.play(e)},play(l){if(Object.values(t).includes(l)){if(e.isAudioEnabled()){let e=document.getElementById(l);null!==e&&(e.currentTime=0,e.play())}}else logger.warning("The sound for "+l+" could not be found")}}}()});