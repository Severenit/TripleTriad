"use strict";define([],function(){return class{constructor(t){if("string"!=typeof t)throw new TypeError("Expected String type");this.name=t,this.cards=[]}getName(){return this.name}setCards(t){this.cards=t}getCards(){return this.cards}}});