class Bird {
	
	constructor(brain) {
		this.x = 64;
		this.y = height/2;
		this.gravity = gravity;
		this.velocity = 0;
		this.r = radius;

		this.score = 0;
		this.fitness = 0;
		if (brain)
			this.brain = brain.copy();
		else
			this.brain = new NeuralNetwork(5, 5, 1);
		
		this.isMentor = false;
	}
	
	think(pipes) {
		let pipe = this._getClosestPipe(pipes);
		
		let inputs = [];
		inputs[0] = (this.y - 50) / height;
		inputs[1] = this.velocity / height;
		inputs[2] = pipe ? pipe.x / width : 0;
		inputs[3] = pipe ? pipe.bottom / height : 0;
		inputs[4] = pipe ? (pipe.top - 100) / height : 0;
		
		let outputs = this.brain.predict(inputs);
		
		if (outputs[0] > 0.5)
			this.flap();
		
		return outputs;
	}
	
	update() {
		this.score++;
		
		this.velocity += this.gravity;
		this.y += this.velocity;
	}
	
	hitFloor() {
		return this.y > height;
	}
	
	hitRoof() {
		return this.y < 0;
	}
	
	flap() {
		this.velocity = -flapStrength; 
	}
	
  show() {
    fill(255);
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    if (this.velocity < 0) {
      rotate(-35);
    } else {
      rotate(35);
    }
		if (this.isMentor)
			tint(0, 255, 0, 127);
		else if (trainingCheckbox.checked())
			tint(255, 127);

    image(birdImg, 0, 0, this.r * 2, this.r * 2);
    //ellipse(0, 0, hurtBoxRadius * 2);
    pop();
  }
	
	_getClosestPipe(pipes) {
		let closest = pipes[0];
		for (let i=1; i<pipes.length; i++) {
			if (pipes[i].x < closest.x && pipes[i].x > this.x - 25)
				closest = pipes[i];
		}
		return closest;
	}
}