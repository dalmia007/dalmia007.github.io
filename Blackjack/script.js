$("#hit-button").prop("disabled", true);
$("#stand-button").prop("disabled", true);
$("#hit-button").addClass("disabled");
$("#stand-button").addClass("disabled");


// Card from deck counter
var counter = 0;

// Dealer Variables
var dealer = {
  score: 0,
  hand: []
};

// Player Variables
var player = {
  score: 0,
  hand: []
};

// Deck Variables
var deck = [];
var suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
var values = ["A","2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
createDeck();
shuffleDeck();

// Deck Creation & Assign Strength based of card values
function createDeck() {
  //var deck = [];
  for (i = 0; i < suits.length; i++) {
      for (j = 0; j < values.length; j++) {
          var strength = parseInt(values[j]);
          if (values[j] == "J" || values[j] == "Q" || values[j] == "K") strength = 10;
            if (values[j] == "A")
                strength = 11;
            var card = {
        Value: values[j],
        Suit: suits[i],
        Strength: strength
      };
      deck.push(card);
    }
  }
  return deck;
}



// Shuffle Deck (starting with randomly selecting two locations(cards) in the deck array)
function shuffleDeck() {
    for (i = 0; i < 1000; i++){
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));

        // Swapping Location(Cards) everytime the loop runs
        [deck[location1], deck[location2]] = [deck[location2], deck[location1]]
        
    }
}


// Render card images using the deck array and its values
getImage = function (deck) {
    var x = deck.Value;
    var y = deck.Suit[0];
    if (deck.Strength === 1 || deck.Strength === 11) x = "A";
    

    return '<img src = "img/deck/' + x + y + '.png">';
};


// Assigning value to the total of the card strengths
function totalValue(delta) {
    var total = 0;
    var aceCount = 0;
    var handArray = [];
    handArray = delta;
    for (i = 0; i < handArray.length; i++){
        if (handArray[i].Value === 'A') {
            total = total + 11;
            aceCount++;
        } else {
            total = total + handArray[i].Strength;
        }
    }

    while (total > 21 && aceCount > 0) {
        total = total - 10;
        aceCount--;
    }
    return total;
}

// Reset all variables after game/round ends
function reset() {
    $("#hit-button").addClass("disabled");
    $("#stand-button").addClass("disabled");
    $("#deal-button").removeClass("disabled");
    dealer.hand = [];
    player.hand = [];
    dealer.score = 0;
    player.score = 0;
    counter = 0;
    createDeck();
    shuffleDeck();
}


// Deciding outcomes based off game rules using if statements
function game() {
    if (player.score === 21 && player.hand.length === 2 && dealer.hand[0].Strength < 10 && dealer.score <= 21) {
        $("#messages").html("<h2>Blackjack!</h2>");
        reset();
    }

    if (player.score === 21) {
        if (dealer.hand.length === 1) {
            stand();
            if (dealer.score === 21) {
                $("#messages").html("<h2>Tie!</h2>"); 
            } else $("#messages").html("<h2>You Win!</h2>");
        }
        reset();
    }

    if (player.score > 21) {
        $("#messages").html("<h2>Bust!</h2>");
        reset();
    }

    if (dealer.score > 21) {
        $("#messages").html("<h2>You Win!</h2>");
        reset();
    }

    if (dealer.score >= 17 && player.score < dealer.score && dealer.score <= 21) {
        $("#messages").html("<h2>Dealer Wins!</h2>");
        reset();
    }

    if (dealer.score >= 17 && player.score > dealer.score && player.score < 21) {
        $("#messages").html("<h2>You Win!</h2>");
        reset();
    }

    if (dealer.score >= 17 && player.score === dealer.score && dealer.score < 21) {
        $("#messages").html("<h2>Standoff!</h2>");
        reset();
    }

}

// Function decide what happens when the hit button is clicked and how player points are assigned
function hit() {
    player.hand.push(deck[counter]);
    player.score = totalValue(player.hand);
    $("#player-hand").append(getImage(player.hand[(player.hand.length)-1]));
    $("#player-label").html( "PLAYER TOTAL :" +" " + player.score);
    counter++;
    if (counter > 2) game(); 

}

// Function to decide how cards to dealt to the dealer and dealer points are assigned
function dealerHand() {
    dealer.hand.push(deck[counter]);
    dealer.score = totalValue(dealer.hand);
    $("#dealer-hand").append(getImage(dealer.hand[(dealer.hand.length)-1]));
    $("#dealer-label").html("DEALER TOTAL :" + " " + dealer.score);
    counter++;
}

// Function to decide the outcome of stand button
function stand() {
    while (dealer.score < 17) dealerHand();
    game();
    
}

// Function to decide how the cards are dealt and points are calculated when a new game starts
function startGame() {
    $("#hit-button").prop("disabled", false);
    $("#stand-button").prop("disabled", false);
    $("#hit-button").removeClass("disabled");
    $("#stand-button").removeClass("disabled");
    $("#deal-button").addClass("disabled");
    $("#messages").html("<h2>Let's Play!</h2>");
    $("#dealer-hand").html("<div></div>")
    $("#player-hand").html("<div></div>")
    hit();
    hit();
    dealerHand();
    game();
   
}

// Using Jquery to specify the on click action of the deal button
$("#deal-button").click(function () { 
    startGame();
});

// Using Jquery to specify the on click action of the hit button
$("#hit-button").click(function () { 
    hit();
});

// Using Jquery to specify the on click action of the stand button
$("#stand-button").click(function () { 
    stand();
});


