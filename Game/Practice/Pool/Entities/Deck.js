class Deck {

    fillDeck (noOfLength,deck) {
        //console.log('<=> Fill Deck || ');
        deck.splice(0, deck.length);
        let rank =['A','K','Q','J','T','9','8','7','6','5','4','3','2'];
        let suit = ['S','H','D','C'];
        for(let tot=0; tot < noOfLength; tot++){ // No of Deck
            for(let r=0;r< rank.length ;r++){
                for(let s=0;s< suit.length ;s++){
                    deck.push(rank[r]+suit[s]); // Push All Cards
                }
            }
            deck.push('PJ'); // Add Printed Joker in Deck
        }

        //Shuffle the deck array with Fisher-Yates
        var i, j, tempi, tempj;
        for (i = 0; i < deck.length; i += 1) {
            j = Math.floor(Math.random() * (i + 1));
            tempi = deck[i];
            tempj = deck[j];
            deck[i] = tempj;
            deck[j] = tempi;
        }
    }
}
module.exports = Deck
