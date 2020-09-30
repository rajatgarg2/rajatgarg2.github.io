//Blackjack!
let blackjackGame = {
    'you': {'scoreSpan': '#your-bj-result', 'div': '#yourBox', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-bj-result', 'div': '#dealerBox', 'score': 0},
    'cards': ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsMap': {'2': 2,'3': 3,'4': 4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A': [1,11]},
    'wins': 0,
    'loses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

const YOU=blackjackGame['you'];
const DEALER=blackjackGame['dealer'];

const hitSound=new Audio('sounds/swish.m4a');
const winSound=new Audio('sounds/cash.mp3');
const lostSound=new Audio('sounds/aww.mp3');

document.querySelector("#hit").addEventListener('click',bjHit);
document.querySelector("#stand").addEventListener('click',dealerLogic);
document.querySelector("#deal").addEventListener('click',bjDeal);

function bjHit(){
    if(blackjackGame['isStand'] === false){
        let card = randomCard();
        showCard(YOU,card);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function randomCard(){
    let randomIndex = Math.floor(Math.random()*12);
    return blackjackGame['cards'][randomIndex];
}

function showCard(activePlayer,x){
    if(activePlayer['score'] <= 21){
    let cardImage=document.createElement('img');
    cardImage.src="images/"+x+".png";
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
    }
}

function showScore(activePlayer){
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent = "BUST!";
        document.querySelector(activePlayer['scoreSpan']).style.color='red';
    }else{
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function bjDeal(){
    if(blackjackGame['turnsOver'] === true){
        blackjackGame['isStand'] = false;
        let yourImages=document.querySelector('#yourBox').querySelectorAll('img');
        let dealerImages=document.querySelector('#dealerBox').querySelectorAll('img');
        for(let i=0;i<yourImages.length;i++)
        yourImages[i].remove();
        for(let i=0;i<dealerImages.length;i++)
        dealerImages[i].remove();
        YOU['score']=0;
        DEALER['score']=0;
        document.querySelector(YOU['scoreSpan']).textContent = 0;
        document.querySelector(YOU['scoreSpan']).style.color='white';
        document.querySelector(DEALER['scoreSpan']).textContent = 0;
        document.querySelector(DEALER['scoreSpan']).style.color='white';
        document.querySelector("#bj-result").textContent = "Let's Play!";
        document.querySelector("#bj-result").style.color='black';
        blackjackGame['turnsOver'] = false;
    }
}

function updateScore(card, activePlayer){
    if(card === 'A'){
        if(activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        }
        else{
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    }
    else{
    activePlayer['score'] += blackjackGame['cardsMap'][card];
    } 
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic(){
    blackjackGame['isStand'] = true;
    while(DEALER['score'] < 16 && blackjackGame['isStand'] === true){
        let card=randomCard();
        showCard(DEALER,card);
        updateScore(card,DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    blackjackGame['turnsOver'] = true;
    var winner = computeWinner();
    showResult(winner);
}

function computeWinner(){
    var winner;
    if(YOU['score'] <=21 ){
        if((YOU['score'] > DEALER['score']) || (DEALER['score'] > 21)){
            blackjackGame['wins']++;
            winner='Y';
        }
        else if(YOU['score'] < DEALER['score']){
            blackjackGame['loses']++;
            winner='D';
        }
        else if(YOU['score'] === DEALER['score']){
            blackjackGame['draws']++;
            winner='N';
        }
    }
    else if(YOU['score'] > 21 &&  DEALER['score'] <=21 ){
        blackjackGame['loses']++;
        winner='D';
    }
    else if(YOU['score'] > 21 &&  DEALER['score'] > 21) {
        blackjackGame['draws']++;
        winner='N';
    }
    return winner;
}

function showResult(winner){
    var message , messageColor;
    if(blackjackGame['turnsOver'] === true){
        if(winner === 'Y'){
            document.querySelector("#wins").textContent = blackjackGame['wins'];
            message = 'You Won!';
            messageColor = 'green';
            winSound.play();
        }else if(winner === 'D'){
            document.querySelector("#loses").textContent = blackjackGame['loses'];
            message = 'You Lost!';
            messageColor='red';
            lostSound.play();
        }else if(winner === 'N'){
            document.querySelector("#draws").textContent = blackjackGame['draws'];
            message = "Draw!";
            messageColor = 'black';
        }
        document.querySelector("#bj-result").textContent = message;
        document.querySelector("#bj-result").style.color = messageColor;
    }
}