var playerHealthDisp = document.getElementById('playerHealth');
var enemyHealthDisp = document.getElementById('enemyHealth');
var infoDisp = document.getElementById('info');
//buttons and listeners
var playButton = document.getElementById('play');
var playerTurnButton = document.getElementById('playerTurn');
var enemyTurnButton = document.getElementById('enemyTurn');
//event listener
playButton.onclick = function () {
   play()
};
function play() {
   playerTurnButton.disabled = false;
   enemyTurnButton.disabled = false;
}
playerTurnButton.onclick = function () {
   playerTurn()
};
enemyTurnButton.onclick = function () {
   enemyTurn()
};
function playerTurn() {
   updateDisp();
   playerTurnButton.disabled = true;
   enemyTurnButton.disabled = false;
}
function enemyTurn() {
   updateDisp();
   enemyTurnButton.disabled = true;
   playerTurnButton.disabled = false;
}
function updateDisp() {
   if (enemyTurnButton.disabled == false) {
      infoDisp.innerHTML = "Player Turn";
   }
   if (playerTurnButton.disabled == false){
      infoDisp.innerHTML = "Enemy Turn";
   }
}