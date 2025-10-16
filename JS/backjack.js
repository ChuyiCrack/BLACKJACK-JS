const hit = document.getElementById("hitButton")
const stand = document.getElementById("standButton")
const userCardsBox = document.getElementById("userBox")
const dealerBox = document.getElementById("dealerBox")

const userDisplay = document.getElementById("userCount")
const dealerDisplay = document.getElementById("dealerCount")
const statusMatch = document.getElementById("statusMatch")


const hitButton = document.getElementById("hitButton")
const standButton = document.getElementById("standButtton")
const restartButton = document.getElementById("restartButton")

let gameEnded = false

let dealerPoints = 0
let acesDealer = 0

let userPoints = 0
let acesUser = 0

let deck

let hiddenDealerCard = ""

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function buildDeck(){
    deck = []
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    for(let i = 0; i < values.length; i++){
        for(let k = 0 ; k < types.length; k++){
            deck.push(values[i]+"-"+types[k])
        }
    }

}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCardImage(card){
   let cardImage = document.createElement("img")
    console.log("/cards/" + card + ".png")
    cardImage.src = "/ASSETS/cards/" + card + ".png" 
    return cardImage
}

function checkCardisAce(card){
    num = card.split("-")[0]
    return num == "A"
}

function getValueCard(card , currPoints){

    if(card == ""){
        return 0
    }

    let numCard = card.split("-")[0]
    let valueCard = parseInt(numCard)
    
    //It's a letter
    let pointsCard
    if(isNaN(valueCard)){
        if(numCard  == "A"){
            pointsCard= currPoints + 11 <= 21 ? 11 : 1;
        }
        else{
            pointsCard=10
        }
    }
    else{
        pointsCard=valueCard
    }
    return pointsCard
}


function giveCardUser(card){
    //Append card to the html
    let cardImage = createCardImage(card)
    userCardsBox.append(cardImage)
    let valCard=getValueCard(card , userPoints)
    if(valCard == 11){
        acesUser+=1
    }
    userPoints+=valCard 
    //The ace that is in the User decck convert it to 1 to avoid BURST
    if(userPoints > 21 && acesUser > 0){
        userPoints-=10
        acesUser-=1
    }
    console.log(acesUser)
    userDisplay.innerText = userPoints
}

function giveCardsDealer(card){
    //Append card to the html
    if(hiddenDealerCard == ""){
        hiddenDealerCard = card
        return
    }
    let cardImage = createCardImage(card)
    dealerBox.append(cardImage)
    valCard = getValueCard(card , dealerPoints)
    if(valCard == 11){
        acesDealer+=1
    }
    dealerPoints +=valCard
    if(dealerPoints > 21 && acesDealer > 0){
        dealerPoints-=10
        acesDealer-=1
    }
    dealerDisplay.innerText = dealerPoints
}

function inittializeGame(){
    restartButton.style.display = "none"
    
    let randomCard
    //Give user two ranndom cards
    for(let i = 0 ; i< 2 ;i++){
        randomCard = deck.pop()
        giveCardUser(randomCard)
        // userPoints+= randomCard
    }

    //Give cards to dealer until it gets close to 21
    for(let i = 0 ; i< 2 ;i++){
        randomCard = deck.pop()
        giveCardsDealer(randomCard)
        // userPoints+= randomCard
    }

}

function unrevealHiddenCardDealer(){
        dealerPoints += getValueCard(hiddenDealerCard,dealerPoints)
        document.getElementById("bacckCardDealer").remove()
        let hiddenCard = createCardImage(hiddenDealerCard)
        dealerBox.prepend(hiddenCard)
        dealerDisplay.innerText = dealerPoints
}

function hitFunc(){
    if(userPoints > 21 || gameEnded){
        gameEnded = true
        return
    }
    randomCard = deck.pop()
    giveCardUser(randomCard)
    if(userPoints > 21){
        statusMatch.innerText = "BUSTED"
        unrevealHiddenCardDealer()
        restartButton.style.display = "inline"
        return
    }
}

async function standFunnc(){
    if(userPoints > 21){
        return
    }
    await sleep(300);
    unrevealHiddenCardDealer()
    await sleep(1000);
    while(userPoints > dealerPoints && dealerPoints < 21){
        randomCard = deck.pop()
        giveCardsDealer(randomCard)
        await sleep(700);
    }
    
    if(userPoints == dealerPoints){
        statusMatch.innerText = "TIE"
        return
    }

    if(dealerPoints <= 21 && userPoints < dealerPoints){
        statusMatch.innerText = "Dealer WON"
    }
    else{
        statusMatch.innerText = "You WON"
    }
    gameEnded = true
    restartButton.style.display = "inline"
}


hitButton.addEventListener("click" , hitFunc)
standButton.addEventListener("click" , standFunnc)
restartButton.addEventListener("click" , () => {
    location.reload(); // Reloads the current page
});

buildDeck()
shuffle(deck)
inittializeGame()






