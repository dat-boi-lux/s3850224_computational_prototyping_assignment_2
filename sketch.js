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