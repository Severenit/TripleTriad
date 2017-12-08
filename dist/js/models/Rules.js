"use strict";define([cardGame.gamePath+"js/models/Settings.js"],function(t){return class e{static getRules(){return{SIMPLE:"SIMPLE",OPEN:"OPEN",WAR:"WAR",SAME:"SAME",PLUS:"PLUS",COMBO:"COMBO"}}initContext(t,e){this.row=t,this.col=e,this.cardUp=this.board.getCardAbove(t,e),this.cardRight=this.board.getCardOnTheRight(t,e),this.cardDown=this.board.getCardBelow(t,e),this.cardLeft=this.board.getCardOnTheLeft(t,e)}apply(r,i,s){if(this.step=0,this.board=r,this.card=r.getCardOnBoard(i,s),this.initContext(i,s),void 0===this.card)return void logger.warning("There is no card on the board at the coordinates [row: "+i+"; col: "+s+"]");let a=[];if(t.isRuleEnabled(e.getRules().SAME)&&(a=this.sameRule(),this.flip(a,e.getRules().SAME)),t.isRuleEnabled(e.getRules().PLUS)){let t=this.plusRule();this.flip(t,e.getRules().PLUS),a=a.concat(t)}if(this.flip(this.simpleRule(),e.getRules().SIMPLE),t.isRuleEnabled(e.getRules().WAR)&&this.flip(this.warRule(),e.getRules().WAR),t.isRuleEnabled(e.getRules().COMBO))for(let t=0;t<a.length;t++){let i=r.getCardCoordinate(a[t]);this.card=a[t],this.initContext(i.row,i.col);let s=this.simpleRule();a=a.concat(s),this.flip(s,e.getRules().COMBO)}}flip(t,e){logger.debug("Apply "+e+" rule [card: "+this.card.getCard().getName()+"; row: "+this.row+"; col:"+this.col+"]");for(let r=t.length-1;r>=0;r--)t[r].flip(this.card.getOwner(),this.card,e,this.step),logger.info("Rule "+e+" : (step "+this.step+") "+this.card.getCard().getName()+" flips "+t[r].getCard().getName())}testSimpleRule(t,e,r,i){return this.step=0,this.board=t,this.card=e,this.initContext(r,i),this.simpleRule()}testAllRules(r,i,s,a){this.step=0,this.board=r,this.card=i,this.initContext(s,a);let h=[],d=[];if(t.isRuleEnabled(e.getRules().SAME)&&(d=d.concat(this.sameRule())),t.isRuleEnabled(e.getRules().PLUS)&&(d=d.concat(this.plusRule())),h=h.concat(this.simpleRule()),t.isRuleEnabled(e.getRules().WAR)&&(h=h.concat(this.warRule())),t.isRuleEnabled(e.getRules().COMBO))for(let t=0;t<d.length;t++){let e=r.getCardCoordinate(d[t]);this.card=d[t],this.initContext(e.row,e.col);let i=this.simpleRule();d=d.concat(i)}return h=h.concat(d)}simpleRule(){let t=[];return this.cardUp&&this.cardUp.getOwner()!==this.card.getOwner()&&this.cardUp.getCard().getDown()<this.card.getCard().getUp()&&t.push(this.cardUp),this.cardDown&&this.cardDown.getOwner()!==this.card.getOwner()&&this.cardDown.getCard().getUp()<this.card.getCard().getDown()&&t.push(this.cardDown),this.cardLeft&&this.cardLeft.getOwner()!==this.card.getOwner()&&this.cardLeft.getCard().getRight()<this.card.getCard().getLeft()&&t.push(this.cardLeft),this.cardRight&&this.cardRight.getOwner()!==this.card.getOwner()&&this.cardRight.getCard().getLeft()<this.card.getCard().getRight()&&t.push(this.cardRight),t.length>0&&this.step++,t}sameRule(){let t=[],e=[],r=0;if(this.cardUp&&this.cardUp.getCard().getDown()===this.card.getCard().getUp()&&(r++,this.cardUp.getOwner()!==this.card.getOwner()&&e.push(this.cardUp)),this.cardDown&&this.cardDown.getCard().getUp()===this.card.getCard().getDown()&&(r++,this.cardDown.getOwner()!==this.card.getOwner()&&e.push(this.cardDown)),this.cardLeft&&this.cardLeft.getCard().getRight()===this.card.getCard().getLeft()&&(r++,this.cardLeft.getOwner()!==this.card.getOwner()&&e.push(this.cardLeft)),this.cardRight&&this.cardRight.getCard().getLeft()===this.card.getCard().getRight()&&(r++,this.cardRight.getOwner()!==this.card.getOwner()&&e.push(this.cardRight)),r>=2&&e.length>=1){for(let r=e.length-1;r>=0;r--)t.push(e[r]);this.step++}return t}warRule(){let t=[],e=this.card.getCard().getUp()+this.card.getCard().getRight()+this.card.getCard().getDown()+this.card.getCard().getLeft();if(this.cardUp&&this.cardUp.getOwner()!==this.card.getOwner()&&this.cardUp.getCard().getDown()===this.card.getCard().getUp()){this.cardUp.getCard().getUp()+this.cardUp.getCard().getRight()+this.cardUp.getCard().getDown()+this.cardUp.getCard().getLeft()<e&&t.push(this.cardUp)}if(this.cardDown&&this.cardDown.getOwner()!==this.card.getOwner()&&this.cardDown.getCard().getUp()===this.card.getCard().getDown()){this.cardDown.getCard().getUp()+this.cardDown.getCard().getRight()+this.cardDown.getCard().getDown()+this.cardDown.getCard().getLeft()<e&&t.push(this.cardDown)}if(this.cardLeft&&this.cardLeft.getOwner()!==this.card.getOwner()&&this.cardLeft.getCard().getRight()===this.card.getCard().getLeft()){this.cardLeft.getCard().getUp()+this.cardLeft.getCard().getRight()+this.cardLeft.getCard().getDown()+this.cardLeft.getCard().getLeft()<e&&t.push(this.cardLeft)}if(this.cardRight&&this.cardRight.getOwner()!==this.card.getOwner()&&this.cardRight.getCard().getLeft()===this.card.getCard().getRight()){this.cardRight.getCard().getUp()+this.cardRight.getCard().getRight()+this.cardRight.getCard().getDown()+this.cardRight.getCard().getLeft()<e&&t.push(this.cardRight)}return t.length>0&&this.step++,t}plusRule(){let t=[],e=[];if(this.cardUp){let t=this.cardUp.getCard().getDown()+this.card.getCard().getUp();e[t]=e[t]||[],e[t].push(this.cardUp)}if(this.cardDown){let t=this.cardDown.getCard().getUp()+this.card.getCard().getDown();e[t]=e[t]||[],e[t].push(this.cardDown)}if(this.cardLeft){let t=this.cardLeft.getCard().getRight()+this.card.getCard().getLeft();e[t]=e[t]||[],e[t].push(this.cardLeft)}if(this.cardRight){let t=this.cardRight.getCard().getLeft()+this.card.getCard().getRight();e[t]=e[t]||[],e[t].push(this.cardRight)}for(let r in e)if(e[r].length>=2)for(let i=0;i<e[r].length;i++){let s=e[r][i];s.getOwner()!==this.card.getOwner()&&t.push(s)}return t.length>0&&this.step++,t}}});