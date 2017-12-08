"use strict";define([cardGame.gamePath+"js/toolbox/Key.js",cardGame.gamePath+"js/models/Settings.js",cardGame.gamePath+"js/models/Rules.js",cardGame.gamePath+"js/models/Board.js",cardGame.gamePath+"js/views/common/Sound.js"],function(e,a,r,d,c){function n(e){c.play(c.getKeys().GAME),function(e){for(let d=e.getPlayers().length-1;d>=0;d--){let c=e.getPlayer(d).getDeck();for(let e=c.length-1;e>=0;e--)cardGame.$container.find(".card--player-"+(d+1)+"-appearance-deck-"+e).addClass("card--player-"+(d+1)+"-appearance-deck-"+e).css({"background-image":"url('"+cardGame.gamePath+"assets/img/cards/"+c[e].getName().replace(/ /g,"").toLowerCase()+".jpg')"});if(!a.isRuleEnabled(r.getRules().OPEN)){if(e.isOnePlayerGame()&&0===d)continue;cardGame.$container.find(".card.card--deck-player-"+(d+1)).each(function(){$(this).data("background",$(this).css("background-image")).css("background-image","").addClass("card--back").removeClass("card--player-"+(d+1))})}}let d=cardGame.$container.find(".card--player-2-appearance-deck-0"),n=parseFloat(d.css("animation-duration"))+parseFloat(d.css("animation-delay"));setTimeout(()=>(function(e){let a=e.getIndexPlayerPlaying()+1;for(let a=e.getPlayers().length-1;a>=0;a--){cardGame.$container.find(".score--player-"+(a+1)).text(e.getPlayer(a).getScore());for(let r=e.getPlayer(a).getDeck().length;r>=0;r--)cardGame.$container.find(".card--player-"+(a+1)+"-appearance-deck-"+r).addClass("card--deck-"+r).removeClass("card--out-board card--player-"+(a+1)+"-appearance-deck-"+r)}c.play(c.getKeys().SELECTOR),cardGame.$container.find(".player-selector").removeClass("player-selector--hide").addClass("player-selector--draw-player-"+a),cardGame.$container.find(".board__background").append($("<div>",{class:"cursor cursor--hide"}));let r=parseFloat(cardGame.$container.find(".player-selector--draw-player-"+a).css("animation-duration"));setTimeout(()=>t(e),1e3*(r+.2))})(e),1e3*n)}(e)}function t(d){let c=d.getIndexPlayerPlaying()+1;cardGame.$container.find(".player-selector").removeClass().addClass("player-selector player-selector--turn player-selector--turn-player-"+c),d.isOnePlayerGame()&&2===c?setTimeout(Routes.get(Routes.getKeys().AI_PLAYS_CARD),100*Math.floor(15*Math.random())):d.isOnePlayerGame()||a.isRuleEnabled(r.getRules().OPEN)?i(d):(cardGame.$container.find(".cursor").addClass("cursor--hide"),cardGame.$container.find(".board__background").append($("<div>",{class:"text-title",text:d.getPlayerPlaying().getName()+"'s turn"})),cardGame.$container.keydown(function(a){switch(a.which){case e.ENTER:o(d);break;default:return}}),cardGame.$container.find(".board__background").addClass("board__background--pointer"),cardGame.$container.find(".board__background").on("click",function(){o(d)}))}function o(e){let a=e.getIndexPlayerPlaying()+1;cardGame.$container.find(".card.card--deck-player-"+a).each(function(){$(this).css("background-image",$(this).data("background")).addClass("card--player-"+a).removeClass("card--back")}),cardGame.$container.find(".text-title").remove(),cardGame.$container.find(".cursor").removeClass("cursor--hide"),cardGame.$container.off("keydown"),cardGame.$container.find(".board__background").removeClass("board__background--pointer"),cardGame.$container.find(".board__background").off("click"),i(e)}function i(a,r){let d=a.getIndexPlayerPlaying()+1;void 0===r&&(r=a.getPlayerPlaying().getDeck().length-1),cardGame.$container.find(".card--deck-player-"+d).addClass("card--deck-player-playing"),s(a,r),cardGame.$container.keydown(function(n){switch(n.which){case e.UP:r+1<a.getPlayerPlaying().getDeck().length&&(r++,c.play(c.getKeys().SELECT)),s(a,r);break;case e.DOWN:r-1>=0&&(r--,c.play(c.getKeys().SELECT)),s(a,r);break;case e.ENTER:cardGame.$container.find(".cursor").removeClass("cursor--player-"+d+" cursor--card-"+r),cardGame.$container.off("keydown"),c.play(c.getKeys().SELECT),g(a,r);break;default:return}}),cardGame.$container.find(".card--deck-player-"+d).off("click"),cardGame.$container.find(".card--deck-player-"+d).on("click",function(){let e=$(this);cardGame.$container.find(".card--deck-player-"+d).each(function(n){e.get(0)===$(this).get(0)&&(console.log(n),r=cardGame.$container.find(".card--deck-player-"+d).length-1-n,console.log("sel"+r),cardGame.$container.find(".cursor").removeClass("cursor--player-"+d+" cursor--card-"+r),s(a,r),cardGame.$container.off("keydown"),c.play(c.getKeys().SELECT),g(a,r))})})}function s(e,a){let r=e.getIndexPlayerPlaying()+1;cardGame.$container.find(".cursor").removeClass().addClass("cursor cursor--player-"+r+" cursor--card-"+a),cardGame.$container.find(".card--selected-player-"+r).removeClass("card--selected-player-"+r),cardGame.$container.find(".card--deck-player-"+r+".card--deck-"+a).addClass("card--selected-player-"+r),l(e.getPlayerPlaying().getCard(a))}function l(e){cardGame.$container.find("#card-name-message").removeClass("message--hidden").text(e.getName())}function g(a,r){let d=a.getIndexPlayerPlaying()+1,n=1,t=1,o=cardGame.$container.find(".cursor");o.addClass("cursor--row-"+n+" cursor--col-"+t),o.removeClass("cursor--player-"+d),m(a,n,t),cardGame.$container.keydown(function(l){let g=n,f=t;switch(l.which){case e.LEFT:t-1>=0&&t--;break;case e.UP:n-1>=0&&n--;break;case e.RIGHT:t+1<3&&t++;break;case e.DOWN:n+1<3&&n++;break;case e.ENTER:return void(a.getBoard().getCardOnBoard(n,t)||(cardGame.$container.find(".card").removeClass("card--deck-player-playing"),cardGame.$container.find(".card--deck-player-"+d).off("click"),cardGame.$container.find(".board__grid").removeClass("board__grid--pointer"),s.off("click"),cardGame.$container.off("keydown"),c.play(c.getKeys().SELECT),Routes.get(Routes.getKeys().PLAYER_PLAYS_CARD)(a.getPlayerPlaying().getDeck()[r],n,t)));case e.ESCAPE:return cardGame.$container.find(".board__grid").removeClass("board__grid--pointer"),s.off("click"),cardGame.$container.off("keydown"),c.play(c.getKeys().CANCEL),void i(a,r);default:return}f===t&&g===n||c.play(c.getKeys().SELECT),o.removeClass("cursor--row-"+g+" cursor--col-"+f).addClass("cursor--row-"+n+" cursor--col-"+t),m(a,n,t)});let s=$(".board__grid");s.addClass("board__grid--pointer"),s.off("click"),s.on("click",function(e){let n=e.clientX-s.offset().left,t=e.clientY-s.offset().top,o=0,i=0;t>1/3*s.height()&&t<=2/3*s.height()?o=1:t>2/3*s.height()&&(o=2),n>1/3*s.width()&&n<=2/3*s.width()?i=1:n>2/3*s.width()&&(i=2),a.getBoard().getCardOnBoard(o,i)||(cardGame.$container.find(".card").removeClass("card--deck-player-playing"),cardGame.$container.find(".card--deck-player-"+d).off("click"),cardGame.$container.find(".board__grid").removeClass("board__grid--pointer"),s.off("click"),cardGame.$container.off("keydown"),c.play(c.getKeys().SELECT),Routes.get(Routes.getKeys().PLAYER_PLAYS_CARD)(a.getPlayerPlaying().getDeck()[r],o,i))})}function m(e,a,r){e.getBoard().getCardOnBoard(a,r)?l(e.getBoard().getCardOnBoard(a,r).getCard()):cardGame.$container.find("#card-name-message").addClass("message--hidden").text()}function f(e,n,t,o){let i=e.getIndexPlayerPlaying()+1;cardGame.$container.find(".card--deck-player-"+i+".card--deck-"+n).addClass("card--disappearance-deck-"+n),c.play(c.getKeys().MOVE_CARD),cardGame.$container.find(".cursor").addClass("cursor--hide"),cardGame.$container.find("#card-name-message").addClass("message--hidden");let s=parseFloat(cardGame.$container.find(".card--disappearance-deck-"+n).css("animation-duration"));for(let a=n+1;a<e.getPlayerPlaying().getDeck().length+1;a++){cardGame.$container.find(".card--deck-player-"+i+".card--deck-"+a).addClass("card--deck-lower-"+(a-1)).removeClass("card--deck-"+a);let e=parseFloat(cardGame.$container.find(".card--deck-lower-"+(a-1)).css("animation-duration"));!function(a,r){setTimeout(function(){cardGame.$container.find(".card--deck-player-"+a+".card--deck-lower-"+(r-1)).addClass("card--deck-"+(r-1)).removeClass("card--deck-lower-"+(r-1))},1e3*e)}(i,a)}setTimeout(()=>(function(e,n,t,o){let i=e.getIndexPlayerPlaying()+1;e.isOnePlayerGame()&&2===i&&cardGame.$container.find(".card.card--disappearance-deck-"+n).each(function(){$(this).css("background-image",$(this).data("background")).addClass("card--player-"+i).removeClass("card--back")});cardGame.$container.find(".card--deck-player-"+i+".card--disappearance-deck-"+n).addClass("card--appearance-row-"+t+" card--col-"+o).removeClass("card--disappearance-deck-"+n+" card--deck-player-"+i+" card--deck-"+n+" card--selected-player-"+i);let s=parseFloat(cardGame.$container.find(".card--appearance-row-"+t).css("animation-duration"));setTimeout(function(){cardGame.$container.find(".card--appearance-row-"+t).addClass("card--row-"+t).removeClass("card--appearance-row-"+t);let n=function(e){function a(t){let i=0;o[t]!==r.getRules().SIMPLE&&(cardGame.$container.find(".board__background").append($("<div>",{class:"text-title text-title--slide",text:o[t]})),i=1.5),setTimeout(function(){cardGame.$container.find(".text-title").remove(),c.play(c.getKeys().FLIP_CARD);for(let r=e.getBoard().getRows()-1;r>=0;r--)for(let c=e.getBoard().getCols()-1;c>=0;c--){let o=e.getBoard().getCardOnBoard(r,c);if(void 0!==o&&o.isFlipped()&&o.getFlippedStep()===t){let i=e.getBoard().getRelativePositionOf(o,o.getFlippedByCard()),s="Y";i!==d.getCardPositions().BOTTOM&&i!==d.getCardPositions().TOP||(s="X"),cardGame.$container.find(".card.card--row-"+r+".card--col-"+c).addClass("card--front card--front-"+s+"-row-"+r+"-col-"+c),cardGame.$container.find(".board__background").append($("<div>",{class:"card card--back card--back-"+s+"-row-"+r+"-col-"+c+" card--row-"+r+" card--col-"+c}));let l=parseFloat(cardGame.$container.find(".card--back-"+s+"-row-"+r+"-col-"+c).css("animation-duration"));!function(e,a,r,d){setTimeout(function(){cardGame.$container.find(".card.card--front.card--row-"+e+".card--col-"+a).removeClass("card--player-1 card--player-2").addClass("card--player-"+(d.getIndexPlayerPlaying()+1))},l/2*1e3)}(r,c,0,e),function(e,r){setTimeout(function(){cardGame.$container.find(".card.card--front.card--row-"+e+".card--col-"+r).removeClass("card--front card--front-"+s+"-row-"+e+"-col-"+r),cardGame.$container.find(".card.card--back.card--row-"+e+".card--col-"+r).remove(),t<n&&a(t+1)},1e3*l)}(r,c)}}},1e3*i)}let n=0,t=0,o={};for(let a=e.getBoard().getRows()-1;a>=0;a--)for(let d=e.getBoard().getCols()-1;d>=0;d--){let c=e.getBoard().getCardOnBoard(a,d);void 0!==c&&c.isFlipped()&&(c.getFlippedStep()>n&&(n=c.getFlippedStep()),c.getFlippedByRule()!==r.getRules().SIMPLE&&void 0===o[c.getFlippedStep()]&&t++,o[c.getFlippedStep()]=c.getFlippedByRule())}n>=1&&a(1);return.5*n+1.5*t}(e);setTimeout(function(){for(let a=0;a<e.getPlayers().length;a++)cardGame.$container.find(".score--player-"+(a+1)).text(e.getPlayer(a).getScore());e.isOnePlayerGame()||a.isRuleEnabled(r.getRules().OPEN)||cardGame.$container.find(".card.card--deck-player-"+i).each(function(){$(this).css("background-image","").addClass("card--back").removeClass("card--player-"+i)}),Routes.get(Routes.getKeys().END_TURN)()},1e3*n)},1e3*s)})(e,n,t,o),1e3*s)}function y(e){cardGame.$container.off("click"),cardGame.$container.find(".board__background").removeClass("board__background--pointer"),cardGame.$container.off("keydown"),cardGame.$container.find(".board__background").fadeOut("slow",()=>Routes.get(Routes.getKeys().FINAL_SCREEN)(e.isOnePlayerGame()))}return{startGame(e){n(e)},playCard(e,a,r,d){f(e,a,r,d)},newTurn(e){t(e)},gameOver(a){!function(a){let r="";a.getWinner().length>1?r=cardGame.i18n.DRAW:a.isOnePlayerGame()?a.getWinner()[0]===a.getPlayers()[0]?(r=cardGame.i18n.WIN,c.stopAllAndPlay(c.getKeys().VICTORY)):r=cardGame.i18n.LOSE:(r=a.getWinner()[0].getName()+" "+cardGame.i18n.WINS,c.stopAllAndPlay(c.getKeys().VICTORY)),cardGame.$container.find(".board__background").append($("<div>",{class:"text-title",text:r})),cardGame.$container.keydown(function(r){switch(r.which){case e.ENTER:y(a);break;default:return}}),cardGame.$container.find(".board__background").addClass("board__background--pointer"),cardGame.$container.find(".board__background").on("click",function(){y(a)})}(a)}}});