let table;
let maxRadius;
let minGdp, maxGdp;
let colorStart, colorEnd;
let gapRadius=250;
let hoveredCountry = null;
selectedYear=2010;

function loadContent(page) {
  fetch(page)
      .then(response => response.text())
      .then(html => {
          const contentDiv = document.getElementById('content');
          contentDiv.innerHTML = html;

          // Check if the loaded content includes a p5 sketch and initialize it
          if (window.mySketch) {
              new p5(mySketch, 'sketch-container');
          }
      })
      .catch(err => {
          console.error('Failed to load page: ', err);
      });
}

function preload() {
  table = loadTable('gdp.csv', 'csv', 'header');
}


function setup() {
  createCanvas(1500, 1500);
  angleMode(DEGREES);
  maxRadius = width / 4 ; // Adjust as needed
  table.rows.sort((a, b) => b.getNum('gdp') - a.getNum('gdp'));

  colorStart = color(255, 120, 0); // Warm color for high values
  colorEnd = color(0, 120, 255); // Cool color for low values
  

  // Assuming 'gdp' is already normalized in your data, otherwise normalize it here
  minGdp = min(table.getColumn('gdp').map(Number));
  maxGdp = max(table.getColumn('gdp').map(Number));
}


function draw() {
  background(0);
  translate(width / 2, height / 2); // Center the chart

  let numBars = table.getRowCount();
  let angleStep = 360 / numBars;
  let innerRadius = 100;


  for (let i = 0; i < numBars; i++) {
    let row = table.getRow(i);
    let country = row.get('Country Name');
    let gdp = row.getNum('gdp');

    // Normalize the GDP value to the range 0 - 1
    let normalizedGdp = norm(gdp, minGdp, maxGdp);

    // Calculate bar length based on GDP, using innerRadius to outerRadius
    let barLength = map(sqrt(normalizedGdp), 0, 1, innerRadius, maxRadius);
    let startRadius = gapRadius; // Adjust gapRadius as needed
    let endRadius = startRadius + barLength;

    // Interpolate the color based on the normalized GDP
    let barColor = lerpColor(colorStart, colorEnd, normalizedGdp);

    // Draw radial bars with the specified gap from the center
    fill(barColor);
    arc(0, 0, endRadius * 2, endRadius * 2, angleStep * i, angleStep * (i + 1), PIE);

    // Rotate the country names to align with the direction of the bars
    push();
    let angle = angleStep * i + angleStep / 2; // Midpoint of the bar
    let x = (startRadius + endRadius) / 2 * cos(angle);
    let y = (startRadius + endRadius) / 2 * sin(angle);
    
    translate(x, y);
    rotate(angle); // Align text with bar direction
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    text(country, 0, 0); 

    pop();

    
  }

  fill(0);
  ellipse(0, 0, gapRadius * 2, gapRadius * 2);


}


