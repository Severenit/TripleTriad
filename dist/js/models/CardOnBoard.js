define([cardGame.gamePath+"js/models/Card.js",cardGame.gamePath+"js/models/PlayerInGame.js"],function(e,p){return class{constructor(t,i){if("object"!=typeof t||!(t instanceof e))throw new TypeError("Expected Card type");if("object"!=typeof i||!(i instanceof p))throw new TypeError("Expected PlayerInGame type");this.card=t,this.player=i,this.flippedByCard=void 0,this.flippedByRule=void 0,this.flippedStep=void 0}getCard(){return this.card}getOwner(){return this.player}flip(e,p,t,i){this.player=e,this.flippedByCard=p,this.flippedByRule=t,this.flippedStep=i}unflip(){this.flippedByCard=void 0,this.flippedByRule=void 0,this.flippedStep=void 0}isFlipped(){return void 0!==this.flippedByCard}getFlippedByCard(){return this.flippedByCard}getFlippedByRule(){return this.flippedByRule}getFlippedStep(){return this.flippedStep}}});