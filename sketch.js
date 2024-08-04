let bird;
let mentor;
let savedBirds;
let pipes;
let bgImgX1;
let bgImgX2;
let backgroundImg;
let score;
let isPaused;
let outputs;
let trainingCheckbox;
let lastTimeItWasWrong;
let progressBar;
let bestTime;
let isMobile;

function preload() {
  birdImg = loadImage('assets/bird.png');
  pipeImg = loadImage('assets/pipes.png');
  pipeRevImg = loadImage('assets/pipes_reverse.png');
  backgroundImg = loadImage('assets/background.png');
}

function setup() {
	isMobile = detectMobile();
	let canvas;
	if (isMobile)
		canvas = createCanvas(windowWidth, windowHeight);
	else
		canvas = createCanvas(400, 600);
	canvas.parent('sketch-container');
	
	angleMode(DEGREES);
	rectMode(CORNER);
	imageMode(CORNER);
	textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(50);
	
	bird = new Bird();
	mentor = new Bird();
	mentor.isMentor = true;
	
	pipes = [];
	pipes.push(new Pipe());
	
	bgImgX1 = 0;
	bgImgX2 = width;
	
	score = 0;
	
	isPaused = false;
	savedBirds = [];
	
	trainingCheckbox = select('#trainingCheckbox');
	progressBar = select('#progressBar');
	
	lastTimeItWasWrong = performance.now();
	bestTime = 0;
}

function draw() {
	if (isMobile && doneTraining() && trainingCheckbox.checked())
		trainingCheckbox.checked(false);
	
	parallax(backgroundImg);
  
	if (frameCount % pipePeriod == 0)
		pipes.push(new Pipe());
	
	for (let i=pipes.length-1; i>=0; i--) {
		pipes[i].update();
		pipes[i].show();
		
		if (pipes[i].finished()) {
			pipes.splice(i, 1);
			score++;
		}
	}

	outputs = bird.think(pipes);
	
	if (trainingCheckbox.checked()) {
		error(pipes);
		mentor.update();
		mentor.show();  
	}
	
	bird.update();
	
	for (let i=0; i<pipes.length; i++)
		if (pipes[i].hit(bird))
		  restart();

	if (bird.hitFloor() || bird.hitRoof())
		restart();
	else
		bird.show();
	
}

function error() {
	let err;
	let pipe = bird._getClosestPipe(pipes);
	
	// you're above me -> you should do nothing
	if (bird.y < mentor.y - 10)
		err = 0 - outputs[0];
	// you're far below me -> you should jump
	else if (bird.y > mentor.y + 30)
		err = 1 - outputs[0];
	// you're below me and getting farther away -> you should jump
	else if (bird.y > mentor.y + 10 && bird.velocity > 0)
		err = 1 - outputs[0];
	// don't get too close to the bottom pipe
	else if (bird.y + tooCloseToPipe > pipe.bottom)
		err = 1 - outputs[0];
	// you're close enough -> do whatever you want
	else 
		err = 0;

	
	bird.wrong = abs(err) > 0.2;
	if (bird.wrong) {
		checkIfDoneTraining();
	}
	
	
	bird.brain.backPropogation([err]);
}

function keyPressed() {
	if (key == ' ')
		mentor.flap();
	else if (key == 'p' && isPaused) {
		resume();
		lastTimeItWasWrong = performance.now();
	}
	else if (key == 'p' && !isPaused)
		pause();
	else if (key == 'r')
		restart();
	else if (key == 't') {
		// if about to start training again, reset the timer
		if (!trainingCheckbox.checked())
			lastTimeItWasWrong = performance.now();
		trainingCheckbox.checked(!trainingCheckbox.checked());
	}
}

function touchStarted() {
	// flap when the screen is tapped
	mentor.flap();
	
	// prevent default touch behaviour
	return false;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

// Function to detect if the device is mobile
function detectMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function parallax(img) {
	background(0);
	image(img, bgImgX1, 0, width, height);
	image(img, bgImgX2, 0, width, height);
	bgImgX1 -= bgScrollSpeed;
	bgImgX2 -= bgScrollSpeed;
	
	if (bgImgX1 < -width)
		bgImgX1 = bgImgX2 + width;
	if (bgImgX2 < -width)
		bgImgX2 = bgImgX1 + width;
}

function gameOver() {
	
}

function pause() {
	noLoop();
	isPaused = true;
}

function resume() {
	loop();
	isPaused = false;
}

function restart() {
	bird = new Bird(bird.brain);
	mentor = new Bird();
	mentor.isMentor = true;
	pipes = [];
	pipes.push(new Pipe());
	score = 0;
	isPaused = false;
	frameCount = 0;
	loop();
}

function checkIfDoneTraining() {
	let time = (performance.now() - lastTimeItWasWrong) / 1000;
	if (time > bestTime) {
		bestTime = time;
		progressBar.style('width', `${bestTime / timeToComplete * 100}%`);
		if (bestTime > timeToComplete) {
			let trainingElement = select('#training');
			trainingElement.style('visibility', 'hidden');
			let done2Element = select('#done2');
			done2Element.style('visibility', 'visible');
			let done1Element = select('#done1');
			done1Element.style('visibility', 'visible');
		}
	}
	lastTimeItWasWrong = performance.now();
	return false;
}

function doneTraining() {
	console.log(bestTime);
	return bestTime > timeToComplete;
}