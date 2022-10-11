var cube_scale = 22; //determines the size of cubes (as well as other 3D objects in the scene)
var wall_collide = 0; //variable to check whether a collision event is occurring
var player_direction = 0; //0 = none, 1 = left, 2 = right, 3 = up, 4 = down
var score = 0; //the accumulative score from collectibles

let banana_array = []; //an array to store collectibles of type "banana"
let apple_array = []; //an array to store collectibles of type "apple"
let walls_array = []; //an array to store wall objects

function setup() {
  createCanvas(800, 800, WEBGL); //create scene of certain size using WebGL
  angleMode(DEGREES); //sets the rotation mode to degrees, a more familiar measurement

  slider = createSlider(0, 360, 0); //create a slider to control the Z rotation of the scene
  slider.position(10, 10);
  slider.style("width", "120px");

  slider2 = createSlider(0, 360, 45); //create a slider to control the X rotation of the scene
  slider2.position(10, 40);
  slider2.style("width", "120px");

  counter = 0; //variable used when iterating through map data

  push();
  outputVolume(0.5); //set output volume of music
  music.loop(); //loop music
  pop();

  for (let i = 0; i < 16; i++) {
    //iterate through every verticle line in map data
    for (let j = 0; j < 16; j++) {
      //iterate through every horizontal line in map data
      if (map_data[counter] == 128) {
        //if the loop detects value "128" (the map code for a banana), then it creates a collectible
        banana_array.push(
          new Collectible(j * cube_scale, i * cube_scale, cube_scale / 10, 1)
        ); //x, y, size, collectible type
      }
      if (map_data[counter] == 77) {
        //if the loop detects value "77" (the map code for an apple), then it creates a collectible
        apple_array.push(
          new Collectible(j * cube_scale, i * cube_scale, cube_scale / 10, 2)
        ); //x, y, size, collectible type
      }
      if (map_data[counter] == 26) {
        //if the loop detects value "26" (the map code for the player origin), then it creates the player
        player1 = new Player(
          j * cube_scale,
          i * cube_scale,
          0,
          0,
          255,
          10,
          cube_scale / 10
        ); //x, y, colR, colG, colB, size, speed
      }
      if (map_data[counter] == 0) {
        //if the loop detects value "0" (the map code for wall), then it creates a wall
        walls_array.push(new Walls(j * cube_scale, i * cube_scale, cube_scale)); //x, y, size
      }
      //print(counter);
      counter++;
    }
  }
  //print(banana_array.length);
  //print(apple_array.length);
}

function preload() {
  map_data = loadStrings("map_data_6.txt"); //preload map data (an image that has been converted to text using Netpbm PGM format)
  cobblestone_tex = loadImage("cobblestone.png"); //preload cobble stone texture
  banana_mesh = loadModel("banana.obj"); //preload banana mesh
  banana_tex = loadImage("banana-tex.png"); //preload banana texture
  apple_mesh = loadModel("apple.obj"); //preload apple mesh
  apple_tex = loadImage("apple-tex.png"); //preload apple texture
  score_font = loadFont("Urbanist-Bold.otf"); //preload font
  music = loadSound("music.mp3"); //preload music
  collection_sound = loadSound("collection.mp3"); // preload collection sound effect
  bump = loadSound("bump.mp3"); //preload bump sound effect
}

function draw_score() {
  //function to draw score on the screen
  push();
  fill(0, 102, 153);
  textFont(score_font);
  textSize(width / 20);
  translate(cube_scale * 3, 0, 60);
  rotateX(-45);
  text("SCORE: " + score, 0, 0);
  pop();
}

function gameover_screen() {
  //function to show gameover text when called
  push();
  textFont(score_font);
  textSize(width / 20);
  translate(cube_scale * 1.8, 0, 96);
  rotateX(-45);
  text("GAME OVER", 0, 0);
  pop();
}

function lighting() {
  //function to create point lights at certain points in scene
  pointLight(255, 255, 255, 0, 0, 800);
  pointLight(255, 255, 255, 0, -500, 1200);
}

function check_wall_collision() {
  //function to check whether or not player has collided with a wall object
  for (let i = 0; i < walls_array.length; i++) {
    if (
      player1.x >= walls_array[i].x - (cube_scale - player1.size / 2) &&
      player1.x <= walls_array[i].x + (cube_scale - player1.size / 2) &&
      player1.y >= walls_array[i].y - (cube_scale - player1.size / 2) &&
      player1.y <= walls_array[i].y + (cube_scale - player1.size / 2)
    ) {
      wall_collide = 1;
      bump.playMode("untilDone");
      bump.play();
    }
  }
  //print("wall collide = " + wall_collide);
}

function check_banana_collision() {
  //function to check whether or not player character has collided with banana object
  for (let i = 0; i < banana_array.length; i++) {
    if (
      player1.x >= banana_array[i].x - (cube_scale - player1.size / 1.5) &&
      player1.x <= banana_array[i].x + (cube_scale - player1.size / 1.5) &&
      player1.y >= banana_array[i].y - (cube_scale - player1.size / 1.5) &&
      player1.y <= banana_array[i].y + (cube_scale - player1.size / 1.5)
    ) {
      //print("collided banana");
      banana_array.splice(i, 1);
      score += 1; //increment score by 1
      collection_sound.play();
    }
  }
}

function check_apple_collision() {
  //function to check whether or not player character has collided with apple object
  for (let i = 0; i < apple_array.length; i++) {
    if (
      player1.x >= apple_array[i].x - (cube_scale - player1.size / 1.5) &&
      player1.x <= apple_array[i].x + (cube_scale - player1.size / 1.5) &&
      player1.y >= apple_array[i].y - (cube_scale - player1.size / 1.5) &&
      player1.y <= apple_array[i].y + (cube_scale - player1.size / 1.5)
    ) {
      //print("collided apple");
      apple_array.splice(i, 1);
      score += 3; //increment score by 3
      collection_sound.play();
    }
  }
}

function keyReleased() {
  //function to detect when a key is released and how to act accordingly
  //print ("key released");
  if (player_direction == 1 && wall_collide == 1) {
    //checks the player direction and if the player is colliding with wall, travel in opposite direction of direction the player is facing. this is too avoid the player object become stuck after collision event.
    player1.x += player1.speed;
  }
  if (player_direction == 2 && wall_collide == 1) {
    player1.x -= player1.speed;
  }
  if (player_direction == 3 && wall_collide == 1) {
    player1.y += player1.speed;
  }
  if (player_direction == 4 && wall_collide == 1) {
    player1.y -= player1.speed;
  }
}

class Walls {
  //a class for wall objects
  constructor(x, y, size) {
    this.x = x; //x pos
    this.y = y; //y pos
    this.size = size; //size
  }

  wall_display() {
    //what wall will do when created
    noStroke();
    push();
    translate(this.x, this.y, 0); //set position to x, y variables
    texture(cobblestone_tex);
    box(cube_scale);
    pop();
  }
}

class Player {
  //a class for player objects
  constructor(x, y, colR, colG, colB, size, speed) {
    this.x = x; //x pos
    this.y = y; //y pos
    this.colR = colR; //player colour
    this.colG = colG;
    this.colB = colB;
    this.size = size; //player size
    this.speed = speed; //player speed
  }

  player_display() {
    //what the player object will do when created
    noStroke();
    fill(this.colR, this.colG, this.colB); //be created this colour
    push();
    translate(this.x, this.y, 0); //set position to these variables
    box(this.size);
    pop();
  }

  player_controls() {
    //the events which determine what the player object does when keys are pressed
    function keyPressed() {
      //print ("key pressed");
    }

    if (keyIsPressed) {
      if (keyCode == RIGHT_ARROW && wall_collide == 0) {
        //if right arrow pressed, then move right at "speed" variable
        this.x += this.speed;
        player_direction = 2;
        //print ("player direction = right");
      }
      if (keyCode == LEFT_ARROW && wall_collide == 0) {
        //if left arrow pressed, then move left at "speed" variable
        this.x -= this.speed;
        player_direction = 1;
        //print ("player direction = left");
      }
      if (keyCode == UP_ARROW && wall_collide == 0) {
        //if up arrow pressed, then move up at "speed" variable
        this.y -= this.speed;
        player_direction = 3;
        //print ("player direction = up");
      }
      if (keyCode == DOWN_ARROW && wall_collide == 0) {
        //if down arrow pressed, then move down at "speed" variable
        this.y += this.speed;
        player_direction = 4;
        //print ("player direction = down");
      }
    }
  }
}

class Collectible {
  //class to create collectible objects
  constructor(x, y, new_size, type) {
    this.x = x;
    this.y = y;
    this.size = new_size; //what type of collectible it is, there are two, banana or apple
    this.type = type;
  }

  collectible_display() {
    noStroke();
    fill(50);
    push();
    translate(this.x, this.y, 0);
    scale(this.size);
    rotateZ(frameCount * 2);
    rotateX(90);
    if (this.type == 1) {
      //if collectible created with object type 1, then it is a banana
      texture(banana_tex);
      model(banana_mesh);
    }
    if (this.type == 2) {
      //if collectible created with object type 2, then it is an apple
      texture(apple_tex);
      model(apple_mesh);
    }
    pop();
  }
}

function draw() {
  noStroke();
  background(200);
  //print("score = " + score);

  wall_collide = 0; //reset collision detector

  check_wall_collision(); //check if there are any wall collisions occurring
  check_banana_collision(); //check if there are any banana collisions occurring
  check_apple_collision(); //check if there are any apple collisions occurring

  lighting();

  rotateX(slider2.value()); //global x rotation, this affects all objects in the scene, saves me from having to create a camera (for now)
  rotateY(0); //global y rotation
  rotateZ(slider.value()); //global z rotation
  translate((-cube_scale * width) / (width / 7.5), -50, 150); //global translation

  for (let i = 0; i < banana_array.length; i++) {
    //for every banana object in the array, create a banana object at banana.x,y
    banana_array[i].collectible_display();
  }
  for (let i = 0; i < apple_array.length; i++) {
    //for every apple object in the array, create an apple object at apple.x,y
    apple_array[i].collectible_display();
  }
  for (let i = 0; i < walls_array.length; i++) {
    //for every wall object in the array, create a wall object at wall.x,y
    walls_array[i].wall_display();
  }

  player1.player_controls(); //initiate the player controls mechanism
  player1.player_display(); //initiate the player display mechanism

  draw_score(); //initiate the display of the score

  if (banana_array.length == 0 && apple_array.length == 0) {
    //if both the banana and apple arrays are empty, initiate the gameover text
    gameover_screen();
  }
}
