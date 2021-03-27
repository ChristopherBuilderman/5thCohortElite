var myGamePiece;
var myObstacles = [];
var myCrewmates = [];
var myCorpses = [];
var myScore;

function startGame() {
    myGamePiece = new component(60, 60, "red", 100, 120, "player");
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.getElementById("gameCanvas"),
    start : function() {
        this.canvas.width = 960;
        this.canvas.height = 540;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type, src) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } if (this.type == "pipe") {
            ctx = myGameArea.context;

            pipe_image = new Image();
            pipe_image.src = 'AmogusArt/Pipe.png';
            ctx.drawImage(pipe_image, this.x, this.y, this.width, this.height);
        } if (this.type == "pipeu") {
            ctx = myGameArea.context;

            pipeu_image = new Image();
            pipeu_image.src = 'AmogusArt/PipeU.png';
            ctx.drawImage(pipeu_image, this.x, this.y, this.width, this.height);
        } if (this.type == "pipebody") {
            ctx = myGameArea.context;

            pipebody_image = new Image();
            pipebody_image.src = 'AmogusArt/PipeBody.png';
            ctx.drawImage(pipebody_image, this.x, this.y, this.width, this.height);
        } if (this.type == "player") {
            ctx = myGameArea.context;

            player_image = new Image();
            player_image.src = 'AmogusArt/Red.png';
            ctx.drawImage(player_image, this.x, this.y, this.width, this.height);
        } if (this.type == "crewmate") {
            ctx = myGameArea.context;

            crewmate_Image = new Image();
            player_image.src = `AmogusArt/${src}`;
            ctx.drawImage(player_image, this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        this.hitTop();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.hitTop = function() {
    	var cloud9 = 0;
        if (this.y < cloud9) {
        	this.y = cloud9;
            this.gravitySpeed = 0;
        }
    }
    
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }

    this.getColor = function() {
        return this.color;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap, score;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        } 
    }
    for (i = 0; i < myCrewmates.length; i += 1) {
        if (myGamePiece.crashWith(myCrewmates[i])) {
            myCorpses.push(new component(60, 60, "color", myCrewmates[i].x, myCrewmates[i].y, "crewmate", "PurpleDead.png"));
            myCrewmates.splice(i, 1);
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(200)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 100;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(40, 64, "green", x, height - 64, "pipeu"));
        myObstacles.push(new component(40, height, "green", x, 0, "pipebody"));
        myObstacles.push(new component(40, 64, "green", x, height + gap, "pipe"));
        myObstacles.push(new component(40, x - height - gap, "green", x, height + gap, "pipebody"));

        if (everyinterval(800)) {
            myCrewmates.push(new component(60, 60, "color", x, height + gap / 2 - 32, "crewmate", "Purple.png"));
        }
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    for (i = 0; i < myCrewmates.length; i += 1) {
        myCrewmates[i].x += -1;
        myCrewmates[i].update();
    }
    for (i = 0; i < myCorpses.length; i += 1) {
        myCorpses[i].x += -1;
        myCorpses[i].update();
    }


    score = Math.floor(myGameArea.frameNo/200) - 4;
    if (score < 0) {
        score = 0;
    }
    myScore.text="SCORE: " + score;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}