'use strict';

/**
 * Show and manage the game.
 * @author Jean-Gabriel Genest
 * @since 17.11.02
 * @version 17.11.19
 */
define([cardGame.gamePath + "js/toolbox/Key.js",
        cardGame.gamePath + "js/models/Settings.js",
        cardGame.gamePath + "js/models/Rules.js",
        cardGame.gamePath + "js/models/Board.js",
        cardGame.gamePath + "js/views/common/Sound.js"],
    function (Key, Settings, Rules, Board, Sound) {

        /**
         * Start the music.
         * @param gameState State of the game
         * @since 17.11.05
         */
        function initGame(gameState) {
            Sound.play(Sound.getKeys().GAME);
            drawCards(gameState);
        }

        /**
         * Draw the players' cards. If open is disabled, show only the back of the cards.
         * @param gameState State of the game
         * @since 17.11.05
         */
        function drawCards(gameState) {
            /* Show player's cards */
            for (let i = gameState.getPlayers().length - 1; i >= 0; i--) {
                let deck = gameState.getPlayer(i).getDeck();

                for (let j = deck.length - 1; j >= 0; j--) {
                    cardGame.$container.find(".card--player-" + (i + 1) + "-appearance-deck-" + j)
                        .addClass("card--player-" + (i + 1) + "-appearance-deck-" + j)
                        .css({
                            "background-image": "url('" + cardGame.gamePath + "assets/img/cards/" + deck[j].getName().replace(/ /g, '').toLowerCase() + ".jpg')"
                        });
                }

                /* Hide the card and show the back if open is disabled */
                if (!Settings.isRuleEnabled(Rules.getRules().OPEN)) {
                    /* If the player plays against the AI, do not hide the player's cards */
                    if (gameState.isOnePlayerGame() && i === 0) {
                        continue;
                    }

                    cardGame.$container.find(".card.card--deck-player-" + (i + 1)).each(function () {
                        $(this).data("background", $(this).css("background-image"))
                            .css("background-image", "")
                            .addClass("card--back")
                            .removeClass("card--player-" + (i + 1));
                    });
                }
            }

            /* After the animation of the cards*/
            let $cardAnimation = cardGame.$container.find(".card--player-2-appearance-deck-0");
            let animationDelay = parseFloat($cardAnimation.css("animation-duration")) + parseFloat($cardAnimation.css("animation-delay"));
            setTimeout(() => drawFirstPlayerPlaying(gameState), animationDelay * 1000);
        }

        /**
         * Select the first player who is going to play.
         * Show the scores and place definitively cards in decks.
         * @param gameState State of the game
         * @since 17.11.05
         */
        function drawFirstPlayerPlaying(gameState) {
            let playerPlaying = gameState.getIndexPlayerPlaying() + 1;
            for (let i = gameState.getPlayers().length - 1; i >= 0; i--) {

                //Show scores
                cardGame.$container.find(".score--player-" + (i + 1)).text(gameState.getPlayer(i).getScore());
                /* Remove the classes for the animation and add the classes for the position */
                for (let j = gameState.getPlayer(i).getDeck().length; j >= 0; j--) {
                    cardGame.$container.find(".card--player-" + (i + 1) + "-appearance-deck-" + j).addClass("card--deck-" + j)
                        .removeClass("card--out-board card--player-" + (i + 1) + "-appearance-deck-" + j);
                }
            }

            /* Show the player selector */
            Sound.play(Sound.getKeys().SELECTOR);
            cardGame.$container.find(".player-selector")
                .removeClass("player-selector--hide")
                .addClass("player-selector--draw-player-" + playerPlaying);
            cardGame.$container.find(".board__background").append($("<div>", {class: "cursor cursor--hide"}));

            /* After the animation of the selector*/
            let animationDelay = parseFloat(cardGame.$container.find(".player-selector--draw-player-" + playerPlaying).css("animation-duration"));
            setTimeout(() => startNewTurn(gameState), (animationDelay + .2) * 1000);
        }

        /**
         * Start a new turn.
         * If open is enabled, show a message and hide both decks.
         * @param gameState State of the game
         * @since 17.11.05
         */
        function startNewTurn(gameState) {
            let playerPlaying = gameState.getIndexPlayerPlaying() + 1;

            //Move the selector to the player currently playing
            cardGame.$container.find(".player-selector")
                .removeClass()
                .addClass("player-selector player-selector--turn player-selector--turn-player-" + playerPlaying);

            /* If the second player is an AI, a card is chosen for it */
            if (gameState.isOnePlayerGame() && playerPlaying === 2) {
                setTimeout(Routes.get(Routes.getKeys().AI_PLAYS_CARD), 100 * Math.floor(Math.random() * 15));
                return;
            }

            /* If cards are hidden, show a message to indicate the player's turn until the enter key is pressed */
            if (!gameState.isOnePlayerGame() && !Settings.isRuleEnabled(Rules.getRules().OPEN)) {
                cardGame.$container.find(".cursor").addClass("cursor--hide");
                cardGame.$container.find(".board__background").append($("<div>", {
                        class: "text-title",
                        text: gameState.getPlayerPlaying().getName() + "'s turn"
                    })
                );

                cardGame.$container.keydown(function (e) {
                    switch (e.which) {
                        case Key.ENTER:
                            showPlayersCards(gameState);
                            break;

                        default:
                            return;
                    }
                });

                cardGame.$container.find(".board__background").addClass("board__background--pointer");
                cardGame.$container.find(".board__background").on("click", function () {
                    showPlayersCards(gameState);
                })

            } else {
                chooseCardToPlay(gameState);
            }
        }

        /**
         * Show the player's cards whose it's the turn.
         * @since 17.11.20
         */
        function showPlayersCards(gameState) {
            let playerPlaying = gameState.getIndexPlayerPlaying() + 1;

            //Show the player's cards
            cardGame.$container.find(".card.card--deck-player-" + playerPlaying).each(function () {
                $(this).css("background-image", $(this).data("background"))
                    .addClass("card--player-" + playerPlaying)
                    .removeClass("card--back");
            });

            cardGame.$container.find(".text-title").remove();
            cardGame.$container.find(".cursor").removeClass("cursor--hide");
            cardGame.$container.off("keydown");
            cardGame.$container.find(".board__background").removeClass("board__background--pointer");
            cardGame.$container.find(".board__background").off("click");

            chooseCardToPlay(gameState);
        }

        /**
         * Let the player selects a card in their deck.
         * @param gameState State of the game
         * @param selectedCard Index of the currently selected card
         * @since 17.11.05
         */
        function chooseCardToPlay(gameState, selectedCard) {
            let playerPlaying = gameState.getIndexPlayerPlaying() + 1;

            /* The default card is the top one */
            if (selectedCard === undefined) {
                selectedCard = gameState.getPlayerPlaying().getDeck().length - 1;
            }

            //Specify the cards in the deck of the playing player
            cardGame.$container.find(".card--deck-player-" + playerPlaying).addClass("card--deck-player-playing");

            updateSelectedCard(gameState, selectedCard);

            cardGame.$container.keydown(function (e) {
                switch (e.which) {
                    case Key.UP:
                        if (selectedCard + 1 < gameState.getPlayerPlaying().getDeck().length) {
                            selectedCard++;
                            Sound.play(Sound.getKeys().SELECT);
                        }
                        updateSelectedCard(gameState, selectedCard);
                        break;

                    case Key.DOWN:
                        if (selectedCard - 1 >= 0) {
                            selectedCard--;
                            Sound.play(Sound.getKeys().SELECT);
                        }
                        updateSelectedCard(gameState, selectedCard);
                        break;

                    case Key.ENTER:
                        cardGame.$container.find(".cursor")
                            .removeClass("cursor--player-" + playerPlaying + " cursor--card-" + selectedCard);
                        cardGame.$container.off("keydown");
                        Sound.play(Sound.getKeys().SELECT);
                        chooseCase(gameState, selectedCard);
                        break;

                    default:
                        return;
                }
            });

            cardGame.$container.find(".card--deck-player-" + playerPlaying).off("click"); //Remove the previous events if the player changed their card
            cardGame.$container.find(".card--deck-player-" + playerPlaying).on("click", function () {
                let $selectedCard = $(this);
                cardGame.$container.find(".card--deck-player-" + playerPlaying).each(function (index) {
                    if ($selectedCard.get(0) === $(this).get(0)) {
                        console.log(index);
                        selectedCard = cardGame.$container.find(".card--deck-player-" + playerPlaying).length - 1 - index;
                        console.log("sel" + selectedCard);

                        cardGame.$container.find(".cursor")
                            .removeClass("cursor--player-" + playerPlaying + " cursor--card-" + selectedCard);

                        updateSelectedCard(gameState, selectedCard);
                        cardGame.$container.off("keydown");

                        Sound.play(Sound.getKeys().SELECT);
                        chooseCase(gameState, selectedCard);
                    }
                })
            });
        }

        /**
         * Move the cursor to the selected card, shift the latter and show the card name.
         * @param gameState State of the game
         * @param selectedCard Index of the currently selected card
         * @since 17.11.05
         */
        function updateSelectedCard(gameState, selectedCard) {
            let playerPlaying = gameState.getIndexPlayerPlaying() + 1;

            //Move the cursor
            cardGame.$container.find(".cursor")
                .removeClass()
                .addClass("cursor cursor--player-" + playerPlaying + " cursor--card-" + selectedCard);

            //Shift the cards
            cardGame.$container.find(".card--selected-player-" + playerPlaying)
                .removeClass("card--selected-player-" + playerPlaying);

            cardGame.$container.find(".card--deck-player-" + playerPlaying + ".card--deck-" + selectedCard)
                .addClass("card--selected-player-" + playerPlaying);

            //Show the name of the card
            showCardNameMessage(gameState.getPlayerPlaying().getCard(selectedCard));
        }

        /**
         * Show the name of the card.
         * @param card Card whose the name must be shown
         * @since 17.11.05
         */
        function showCardNameMessage(card) {
            cardGame.$container.find("#card-name-message").removeClass("message--hidden").text(card.getName());
        }

        /**
         *
         * @param gameState State of the game
         * @param selectedCard Index of the currently selected card
         * @since 17.11.05
         */
        function chooseCase(gameState, selectedCard) {
            let playerPlaying = gameState.getIndexPlayerPlaying() + 1;
            let currentRow = 1, currentCol = 1;
            let $cursor = cardGame.$container.find(".cursor");

            //Move the cursor to the board
            $cursor.addClass("cursor--row-" + currentRow + " cursor--col-" + currentCol);
            $cursor.removeClass("cursor--player-" + playerPlaying);

            /* Show the name of the card under the cursor or hide it */
            showCardNameUnderCursor(gameState, currentRow, currentCol);

            /* Case selection */
            cardGame.$container.keydown(function (e) {
                let previousRow = currentRow;
                let previousCol = currentCol;

                switch (e.which) {
                    case Key.LEFT:
                        currentCol - 1 >= 0 ? currentCol-- : currentCol;
                        break;

                    case Key.UP:
                        currentRow - 1 >= 0 ? currentRow-- : currentRow;
                        break;

                    case Key.RIGHT:
                        currentCol + 1 < 3 ? currentCol++ : currentCol;
                        break;

                    case Key.DOWN:
                        currentRow + 1 < 3 ? currentRow++ : currentRow;
                        break;

                    case Key.ENTER:
                        if (!gameState.getBoard().getCardOnBoard(currentRow, currentCol)) {
                            //Unbind the click on the deck
                            cardGame.$container.find(".card").removeClass("card--deck-player-playing");
                            cardGame.$container.find(".card--deck-player-" + playerPlaying).off("click");

                            //Unbind events on the cases
                            cardGame.$container.find(".board__grid").removeClass("board__grid--pointer");
                            $board__grid.off("click");
                            cardGame.$container.off("keydown");

                            Sound.play(Sound.getKeys().SELECT);
                            Routes.get(Routes.getKeys().PLAYER_PLAYS_CARD)(gameState.getPlayerPlaying().getDeck()[selectedCard], currentRow, currentCol);
                        }
                        return;
                        break;

                    case Key.ESCAPE:
                        cardGame.$container.find(".board__grid").removeClass("board__grid--pointer");
                        $board__grid.off("click");
                        cardGame.$container.off("keydown");
                        Sound.play(Sound.getKeys().CANCEL);
                        chooseCardToPlay(gameState, selectedCard);
                        return;
                        break;

                    default:
                        return;
                }

                if (previousCol !== currentCol || previousRow !== currentRow) {
                    Sound.play(Sound.getKeys().SELECT);
                }

                //Move the cursor
                $cursor.removeClass("cursor--row-" + previousRow + " cursor--col-" + previousCol)
                    .addClass("cursor--row-" + currentRow + " cursor--col-" + currentCol);

                showCardNameUnderCursor(gameState, currentRow, currentCol);
            });

            let $board__grid = $(".board__grid");
            $board__grid.addClass("board__grid--pointer");
            $board__grid.off("click"); //Remove the previous events if the player changed their card
            $board__grid.on("click", function (e) {
                let x = e.clientX - $board__grid.offset().left;
                let y = e.clientY - $board__grid.offset().top;
                let row = 0;
                let col = 0;
                if (y > 1 / 3 * $board__grid.height() && y <= 2 / 3 * $board__grid.height()) {
                    row = 1;
                }
                else if (y > 2 / 3 * $board__grid.height()) {
                    row = 2;
                }

                if (x > 1 / 3 * $board__grid.width() && x <= 2 / 3 * $board__grid.width()) {
                    col = 1;
                }
                else if (x > 2 / 3 * $board__grid.width()) {
                    col = 2;
                }

                if (!gameState.getBoard().getCardOnBoard(row, col)) {
                    //Unbind the click on the deck
                    cardGame.$container.find(".card").removeClass("card--deck-player-playing");
                    cardGame.$container.find(".card--deck-player-" + playerPlaying).off("click");

                    //Unbind events on the cases
                    cardGame.$container.find(".board__grid").removeClass("board__grid--pointer");
                    $board__grid.off("click");
                    cardGame.$container.off("keydown");

                    Sound.play(Sound.getKeys().SELECT);
                    Routes.get(Routes.getKeys().PLAYER_PLAYS_CARD)(gameState.getPlayerPlaying().getDeck()[selectedCard], row, col);
                }
            })
        }

        /**
         * Show the name of the card under the cursor if there is any.
         * @param gameState State of the game
         * @param row Row where the cursor is
         * @param col Column where the cursor is
         * @since 17.11.05
         */
        function showCardNameUnderCursor(gameState, row, col) {
            if (gameState.getBoard().getCardOnBoard(row, col)) {
                showCardNameMessage(gameState.getBoard().getCardOnBoard(row, col).getCard());
            } else {
                cardGame.$container.find("#card-name-message").addClass("message--hidden").text();
            }
        }

        /**
         * Remove the card from the player's deck and lower the other cards.
         * @param gameState State of the game
         * @param indexCardPlayed Index of the card played
         * @param row Row on the board where the card is played
         * @param col Column on the board where the card is played
         * @since 17.11.05
         */
        function removeCardFromDeck(gameState, indexCardPlayed, row, col) {
            let playerPlaying = gameState.getIndexPlayerPlaying() + 1;

            //Remove the card from the deck
            cardGame.$container.find(".card--deck-player-" + playerPlaying + ".card--deck-" + indexCardPlayed).addClass("card--disappearance-deck-" + indexCardPlayed);
            Sound.play(Sound.getKeys().MOVE_CARD);

            //Remove the classes positioning the cursor on the board
            cardGame.$container.find(".cursor").addClass("cursor--hide");

            //Remove the name of the card under the cursor if there is any
            cardGame.$container.find("#card-name-message").addClass("message--hidden");

            let animationDisappearanceDelay = parseFloat(cardGame.$container.find(".card--disappearance-deck-" + indexCardPlayed).css("animation-duration"));

            /* Lower the position of the cards above the one which has just been removed from the deck */
            for (let i = indexCardPlayed + 1; i < gameState.getPlayerPlaying().getDeck().length + 1; i++) {
                cardGame.$container.find(".card--deck-player-" + playerPlaying + ".card--deck-" + i)
                    .addClass("card--deck-lower-" + (i - 1))
                    .removeClass("card--deck-" + i);

                let animationLowerDelay = parseFloat(cardGame.$container.find(".card--deck-lower-" + (i - 1)).css("animation-duration"));

                (function (playerPlaying, i) {
                    setTimeout(function () {
                        cardGame.$container.find(".card--deck-player-" + playerPlaying + ".card--deck-lower-" + (i - 1))
                            .addClass("card--deck-" + (i - 1))
                            .removeClass("card--deck-lower-" + (i - 1));
                    }, animationLowerDelay * 1000);
                })(playerPlaying, i);
            }

            setTimeout(() => placeCardOnBoard(gameState, indexCardPlayed, row, col), animationDisappearanceDelay * 1000);
        }

        /**
         * Position the card on the board.
         * @param gameState State of the game
         * @param indexCardPlayed Index of the card played
         * @param row Row on the board where the card is played
         * @param col Column on the board where the card is played
         * @since 17.11.05
         */
        function placeCardOnBoard(gameState, indexCardPlayed, row, col) {
            let playerPlaying = gameState.getIndexPlayerPlaying() + 1;

            //If the player plays against the AI, it's time to reveal the card
            if (gameState.isOnePlayerGame() && playerPlaying === 2) {
                cardGame.$container.find(".card.card--disappearance-deck-" + indexCardPlayed).each(function () {
                    $(this).css("background-image", $(this).data("background"))
                        .addClass("card--player-" + playerPlaying)
                        .removeClass("card--back");
                });
            }

            //Move the card to the board
            cardGame.$container.find(".card--deck-player-" + playerPlaying + ".card--disappearance-deck-" + indexCardPlayed)
                .addClass("card--appearance-row-" + row + " card--col-" + col)
                .removeClass("card--disappearance-deck-" + indexCardPlayed
                    + " card--deck-player-" + playerPlaying
                    + " card--deck-" + indexCardPlayed
                    + " card--selected-player-" + playerPlaying);

            let animationAppearanceDelay = parseFloat(cardGame.$container.find(".card--appearance-row-" + row).css("animation-duration"));

            setTimeout(function () {
                //Position the card on its case
                cardGame.$container.find(".card--appearance-row-" + row)
                    .addClass("card--row-" + row)
                    .removeClass("card--appearance-row-" + row);

                //Flip the nearby cards if necessary
                let animationFlipDelay = flipCards(gameState);

                setTimeout(function () {
                    //Update scores
                    for (let i = 0; i < gameState.getPlayers().length; i++) {
                        cardGame.$container.find(".score--player-" + (i + 1)).text(gameState.getPlayer(i).getScore());
                    }

                    //Hide cards
                    if (!gameState.isOnePlayerGame() && !Settings.isRuleEnabled(Rules.getRules().OPEN)) {
                        cardGame.$container.find(".card.card--deck-player-" + playerPlaying).each(function () {
                            $(this).css("background-image", "")
                                .addClass("card--back")
                                .removeClass("card--player-" + playerPlaying);
                        });
                    }

                    //End the turn
                    Routes.get(Routes.getKeys().END_TURN)();
                }, animationFlipDelay * 1000);

            }, animationAppearanceDelay * 1000);
        }

        /**
         * Flip the cards which need to be flipped.
         * @param gameState State of the game
         * @returns {number} the time in seconds that the animation will take
         * @since 17.11.05
         */
        function flipCards(gameState) {
            /* Determine what rules will apply at each step */
            let steps = 0, nbRulesDisplayed = 0, rules = {};
            for (let i = gameState.getBoard().getRows() - 1; i >= 0; i--) {
                for (let j = gameState.getBoard().getCols() - 1; j >= 0; j--) {
                    let cardOnBoard = gameState.getBoard().getCardOnBoard(i, j);
                    if (cardOnBoard !== undefined && cardOnBoard.isFlipped()) {
                        //Find the last step
                        if (cardOnBoard.getFlippedStep() > steps) {
                            steps = cardOnBoard.getFlippedStep();
                        }
                        //Count the number of rules applied without counting the simple one and by counting each step only once
                        if (cardOnBoard.getFlippedByRule() !== Rules.getRules().SIMPLE && rules[cardOnBoard.getFlippedStep()] === undefined) {
                            nbRulesDisplayed++;
                        }
                        //Associate the step to the rule
                        rules[cardOnBoard.getFlippedStep()] = cardOnBoard.getFlippedByRule();
                    }
                }
            }

            //Flip the cards
            function flipCard(step) {
                //Show the rule applying
                let delayed = 0;
                if (rules[step] !== Rules.getRules().SIMPLE) {
                    cardGame.$container.find(".board__background").append($("<div>", {
                        class: "text-title text-title--slide",
                        text: rules[step]
                    }));
                    delayed = 1.5;
                }

                setTimeout(function () {
                    //Remove the text
                    cardGame.$container.find(".text-title").remove();

                    Sound.play(Sound.getKeys().FLIP_CARD);

                    for (let i = gameState.getBoard().getRows() - 1; i >= 0; i--) {
                        for (let j = gameState.getBoard().getCols() - 1; j >= 0; j--) {
                            let cardOnBoard = gameState.getBoard().getCardOnBoard(i, j);
                            if (cardOnBoard !== undefined && cardOnBoard.isFlipped() && cardOnBoard.getFlippedStep() === step) {
                                //X or Y rotation
                                let position = gameState.getBoard().getRelativePositionOf(cardOnBoard, cardOnBoard.getFlippedByCard());
                                let rotation = "Y";
                                if (position === Board.getCardPositions().BOTTOM || position === Board.getCardPositions().TOP) {
                                    rotation = "X";
                                }

                                //Add a back to the card
                                cardGame.$container.find(".card.card--row-" + i + ".card--col-" + j)
                                    .addClass("card--front card--front-" + rotation + "-row-" + i + "-col-" + j);
                                cardGame.$container.find(".board__background").append($("<div>", {
                                    class: "card card--back card--back-" + rotation + "-row-" + i + "-col-" + j + " card--row-" + i + " card--col-" + j
                                }));

                                let animationFlipDelay = parseFloat(cardGame.$container.find(".card--back-" + rotation + "-row-" + i + "-col-" + j).css("animation-duration"));

                                //Change the color of the card
                                (function (i, j, cardOnBoard, gameState) {
                                    setTimeout(function () {
                                        cardGame.$container.find(".card.card--front.card--row-" + i + ".card--col-" + j)
                                            .removeClass("card--player-1 card--player-2")
                                            .addClass("card--player-" + (gameState.getIndexPlayerPlaying() + 1));
                                    }, animationFlipDelay / 2 * 1000);
                                })(i, j, cardOnBoard, gameState);

                                (function (i, j) {
                                    //Remove the back
                                    setTimeout(function () {
                                        cardGame.$container.find(".card.card--front.card--row-" + i + ".card--col-" + j)
                                            .removeClass("card--front card--front-" + rotation + "-row-" + i + "-col-" + j);
                                        cardGame.$container.find(".card.card--back.card--row-" + i + ".card--col-" + j).remove();

                                        if (step < steps) {
                                            flipCard(step + 1);
                                        }

                                    }, animationFlipDelay * 1000);
                                })(i, j);
                            }
                        }
                    }
                }, delayed * 1000);
            }

            if (steps >= 1) {
                flipCard(1);
            }

            return (steps * .5) + (nbRulesDisplayed * 1.5);
        }

        /**
         * Show the game over screen with the name of the winner or a draw message.
         * Start the victory music if there is a winner.
         * @param gameState State of the game
         * @since 17.11.05
         */
        function gameIsOver(gameState) {

            let text = "";
            if (gameState.getWinner().length > 1) {
                text = cardGame.i18n.DRAW;
            } else {
                if (gameState.isOnePlayerGame()) {
                    if (gameState.getWinner()[0] === gameState.getPlayers()[0]) {
                        text = cardGame.i18n.WIN;
                        Sound.stopAllAndPlay(Sound.getKeys().VICTORY);
                    } else {
                        text = cardGame.i18n.LOSE;
                    }
                }
                else {
                    text = gameState.getWinner()[0].getName() + " " + cardGame.i18n.WINS;
                    Sound.stopAllAndPlay(Sound.getKeys().VICTORY);
                }
            }
            cardGame.$container.find(".board__background").append($("<div>", {
                class: "text-title",
                text: text
            }));

            cardGame.$container.keydown(function (e) {
                switch (e.which) {
                    case Key.ENTER:
                        gameDisappear(gameState);
                        break;

                    default:
                        return;
                }
            });

            cardGame.$container.find(".board__background").addClass("board__background--pointer");
            cardGame.$container.find(".board__background").on("click", function () {
                gameDisappear(gameState);
            })
        }

        /**
         * Make the game view disappear to show the final screen.
         * @since 17.11.20
         */
        function gameDisappear(gameState) {
            cardGame.$container.off("click");
            cardGame.$container.find(".board__background").removeClass("board__background--pointer");
            cardGame.$container.off("keydown");

            cardGame.$container.find(".board__background").fadeOut("slow", () => Routes.get(Routes.getKeys().FINAL_SCREEN)(gameState.isOnePlayerGame()));
        }

        return {
            /**
             * Start the game (draw cards and the first player playing) and let the first player chooses a card to play.
             * @param gameState State of the game
             * @since 17.11.02
             */
            startGame(gameState) {
                initGame(gameState);
            },

            /**
             * Play the card on the board.
             * @param gameState State of the game
             * @param indexCard Index of the card in the deck
             * @param row Row of the case where the card is played
             * @param col Column of the case where the card is played
             * @since 17.11.05
             */
            playCard(gameState, indexCard, row, col) {
                removeCardFromDeck(gameState, indexCard, row, col);
            },

            /**
             * Start a new turn.
             * @param gameState State of the game
             */
            newTurn(gameState) {
                startNewTurn(gameState);
            },

            /**
             * Show the game over screen.
             * @param gameState State of the game
             */
            gameOver(gameState) {
                gameIsOver(gameState);
            }
        };
    });