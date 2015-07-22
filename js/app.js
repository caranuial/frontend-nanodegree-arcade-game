//Score
var Score = function() {
    this.text = 'Score: ';
    this.value = 0;
};

// function to draw a score on the screen
Score.prototype.render = function() {
    ctx.font = "20px Courier New";
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText(this.text + this.value.toString(), 380, 75);
};

//Collectibles
var Collectible = function() {
    //picks a color /image
    this.sprite = this.genGemColor();
    //column position 
    this.x = columns[this.genColumn()];
    //line position
    this.line = this.genLine();
    this.y = lanes[this.line];
    console.log("Collectible y " + this.y + ", x " + this.x + ", line " + this.line);
};

//Function to generate color of a gem
Collectible.prototype.genGemColor = function() {
    var randomNumber = Math.floor(Math.random() * (4 - 1)) + 1;
    console.log("Gem Color is " + randomNumber);
    if (randomNumber === 1) {
        return 'images/Gem Green.png';
    } else if (randomNumber === 2) {
        return 'images/Gem Blue.png';
    } else {
        return 'images/Gem Orange.png';
    }
};

//Function to generate line on which gem is placed
Collectible.prototype.genLine = function() {
    var min = 0;
    var max = 2;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

//Function to generate column on which gem is placed
Collectible.prototype.genColumn = function() {
    var min = 0;
    var max = 4;
    return Math.floor(Math.random() * (max - min)) + min;
};

// Draw the gem on the screen
Collectible.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the gem's position
// Parameter: dt, a time delta between ticks
Collectible.prototype.update = function(dt) {
    //Check if player hits a gem
    if (player.line === this.line && player.x === this.x) {
        //Higher player score
        score.value += 1;
        console.log("Score " + score.value);
        var newX;
        var newLine;
        //Generate new position of gem which is not same as previous one
        do {
            newX = columns[this.genColumn()];
            newLine = this.genLine();
        }
        while (newX != this.x && newLine != this.line);
        this.x = newX;
        this.line = newLine;
        this.y = lanes[this.line];
        console.log("Collectible y " + this.y + ", x " + this.x);
        //Generate new color of gem
        this.sprite = this.genGemColor();
    }
};
//Defines all possible columns
var columns = [0, 101, 202, 303, 404];
//Defines all movable lanes
var lanes = [60, 145, 230, 315, 400];
//Sets enemy minimal and maximal speed
var maxSpeed = 150;
var minSpeed = 30;
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    //default position outside of screen
    this.x = -101;
    //gen line in which enemy starts
    this.line = this.genLine();
    this.y = lanes[this.line];
    //generate speed of enemy
    this.velocity = this.genSpeed();
};

//Function to generate line on which enemy starts
Enemy.prototype.genLine = function() {
    var min = 0;
    var max = 2;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

//Function to generate speed of enemy
Enemy.prototype.genSpeed = function() {
    return Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //Check if enemy is still on playground 
    //and if not generate new position and speed for enemy
    if (this.x >= 606) {
        this.x = -101;
        this.velocity = this.genSpeed();
        this.line = this.genLine();
        this.y = lanes[this.line];
        console.log("Enemy " + this.line + ", speed " + this.velocity);
    } else {
        this.x += this.velocity * dt;
    }
    //Check if player hits an enemy -> reset player to the starting position
    if (player.line === this.line && Math.abs(player.x - this.x) <= 50) {
        player.x = 202;
        player.y = 400;
        player.line = 4;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 400;
    this.line = 4;
};
// Update the player's image based on score
Player.prototype.update = function(dt) {
    if (score.value >= 20) {
        this.sprite = 'images/char-princess-girl.png';
    } else if (score.value >= 15) {
        this.sprite = 'images/char-pink-girl.png';
    } else if (score.value >= 10) {
        this.sprite = 'images/char-horn-girl.png';
    } else if (score.value >= 5) {
        this.sprite = 'images/char-cat-girl.png';
    }
};

// renders the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// function to move the player
Player.prototype.handleInput = function(keyCode) {
    if (keyCode === 'left' && this.x > 0) {
        this.x -= 101;
        console.log(this.x + ", " + this.y);
    }
    if (keyCode === 'right' && this.x < 400) {
        this.x += 101;
        console.log(this.x + ", " + this.y);
    }
    if (keyCode === 'up' && this.y > 60) {
        this.y -= 85;
        this.line -= 1;
        console.log(this.x + ", " + this.y + ", " + this.line);
    }
    if (keyCode === 'down' && this.y < 400) {
        this.y += 85;
        this.line += 1;
        console.log(this.x + ", " + this.y + ", " + this.line);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var collectible = new Collectible();
var allEnemies = [];
var player = new Player();

var numberOfEnemies = 3;
for (var j = 0; j < numberOfEnemies; j++) {
    allEnemies.push(new Enemy());
}

var score = new Score();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
