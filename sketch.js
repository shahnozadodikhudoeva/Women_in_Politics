/* define global variables */
// set our canvas size, unit is pixel
var canvas_width = 1200;
var canvas_height = 4600;

// set font type, height and color, unit is pixel
var font_type = 'Arial';
var font_height = 15;
var font_color = 'white';

// set the margins
var right_margin = 100, left_margin = 50;
var top_margin = 20, bottom_margin = 20;

// set line spacing
var line_spacing = 30;

// set the grid appearance
var grid_weight = 1;
// record the longest name's length
var longest_name_length = 0;

// set the space between the names and the horizontal lines
var space_name_line = 10;


/* preload the data */
function preload(){
  /* read csv file */
  table = loadTable("full_data.csv", "csv", "header");
}


// traverse all names to find out the longest one
function getLongestNameLength(names){
  for (var i = 0; i < names.length; i++){
    // get current name's length
    current_name_length = textWidth(names[i]);
    // if the current name's length is longer than the current longest length,
    // then update the value of the current longest one
    if (current_name_length > longest_name_length)
      longest_name_length = current_name_length;
  }
  return longest_name_length;
}

// set the gradient color between two colors
function setGradient(x1, x2, y, c1, c2, weight){
  var min_x = min(x1, x2), max_x = max(x1, x2);
  for(let i = min_x; i <= max_x; i++){
    let inter = map(i, x1, x2, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    strokeWeight(weight);
    point(i, y);
  }
}


function setup() {
  // put setup code here
  // setup our canvas
  createCanvas(canvas_width, canvas_height);

  // get all countries' names
  countries = table.getColumn("Country Name");
  women = table.getColumn("2021_wom");
  gdp = table.getColumn("2021_gdp");
  health = table.getColumn("2021_life");

  // get the longest name's length
  longest_name_length = getLongestNameLength(countries);

  // set the text type and size
  textFont(font_type);
  textSize(font_height);

  // check output in console
  console.log(table.getRowCount() + " total rows in table");
  console.log(table.getColumnCount() + " total columns in table");
}

function draw() {
  // put drawing code here
  // setup our canavs's background color, in black
  var SIZE = 25;
  background(255, 255, 255);
  // set BMI points color

  text_y = top_margin + font_height;

  // coordinate start and end position for each horizontal line on the x-axis
  line_x1 = longest_name_length + space_name_line + left_margin;
  line_x2 = canvas_width - right_margin;
  // coordinate vertical position on the y-axis for each line
  line_y = top_margin + font_height/2;

  // coordinate the start and end position for each vertical line on the y-axis
  vertical_line_y1 = top_margin;
  vertical_line_y2 = (font_height + line_spacing) * SIZE*1.7 + font_height + line_spacing*3;

  indicators = ["Countries", "Proportion of women in parliaments (%)", "GDP growth (%)","Life Expectancy (age)" ];
  for(var i = 0; i <= 3; i++){
    vertical_line_x = map(i+1, 1,4,line_x1, line_x2);
    if(i == 0){
      stroke(0);
      strokeWeight(grid_weight);
    
      line(vertical_line_x, vertical_line_y1 + line_spacing*0.75, vertical_line_x, vertical_line_y2);
    }
    fill(0);
    noStroke();
    textAlign(CENTER);
    text(indicators[i], vertical_line_x, vertical_line_y1-font_height*0.7);
  }

  for(var i = 0 ; i <= SIZE ; i++){
        if(i == 0){
      text_y = text_y + font_height + line_spacing*1.5;
      line_y = text_y - font_height/2;
    }
    fill(0);
    noStroke();
    // DRAW TEXT
    textAlign(LEFT);
    // right-align
    text_x = left_margin + longest_name_length - textWidth(countries[i]);
    // draw the text at the position (text_x, text_y)
    text(countries[i], text_x, text_y);

    
    var indics = [women, gdp, health];
    if( i == 0){
      stroke(0);
      strokeWeight(grid_weight);
      line(line_x1, line_y - line_spacing*1.5, line_x2 *2, line_y - line_spacing*1.5);
    }

    for(j = 2 ; j <= 4 ; j++){
      loc = map(j, 1, 4, line_x1, line_x2);
      var indic = indics[j-2];
      var numericIndic = indic.map(Number);
      var val = numericIndic[countries.length-i - 1];
      var min_indic = min(numericIndic);
      min_indic = min_indic < 0 ? 0 : min_indic;
      var max_indic = max(numericIndic);
      var minDiameter = 10;
      var maxDiameter = line_spacing*2.4;
    
      var circleDiameter = map(Math.round(val), min_indic, max_indic, minDiameter, maxDiameter);
      noFill();
      stroke(0,0,0);
      strokeWeight(grid_weight);
      ellipse(loc, line_y, maxDiameter, maxDiameter);
      noStroke();
      if (j === 2) {
        fill(255, 0, 0);
      } else if (j === 3) {
        fill(0, 255, 0);
      } else if (j === 4) {
        fill(50, 100, 255);
      }
      ellipse(loc, line_y, circleDiameter, circleDiameter);
      
      fill(0);
      textAlign(CENTER, CENTER);
      text(Math.round(val), loc, line_y);
    }


    //Go to next row. Don't change the order of these commands.
    text_y = text_y + font_height + line_spacing*2;
    line_y = text_y - font_height/2;

  }
}

