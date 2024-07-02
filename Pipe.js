class Pipe {
	constructor() {
		this.w = pipeWidth;
		this.x = width + this.w;
		this.speed = pipeSpeed;
		this.top = random(height/2);
		this.bottom = height - random(height/2);
		this.adjustLocation();
	}
	
	adjustLocation() {
		if (height - this.bottom < pipeMinDistanceToEdge)
			this.bottom = height - pipeMinDistanceToEdge;
		if (this.top < pipeMinDistanceToEdge)
			this.top = pipeMinDistanceToEdge;
		if (this.bottom - this.top < pipeMinGap) {
			let newSpace = pipeMinGap - (this.bottom - this.top);
			this.bottom += newSpace / 2;
			this.top -= newSpace / 2;
		}
		if (this.bottom - this.top > pipeMaxGap) {
			let newSpace = (this.bottom - this.top) - pipeMaxGap;
			this.bottom -= newSpace / 2;
			this.top += newSpace / 2;
		}
	}
	
	update() {
		this.x -= this.speed;
	}
	
	finished() {
		return this.x + this.w < 0;
	}
	
	hit(bird) {
		return this.hitTop(bird) || this.hitBottom(bird);
  }
	
	hitTop(bird) {
    if (bird.x + hurtBoxRadius < this.x)
			return false;
		if (bird.x - hurtBoxRadius > this.x + this.w)
			return false;
		if (bird.y - hurtBoxRadius > this.top)
			return false;
		return true;
	}
	
	hitBottom(bird) {
    if (bird.x + hurtBoxRadius < this.x)
			return false;
		if (bird.x - hurtBoxRadius > this.x + this.w)
			return false;
		if (bird.y + hurtBoxRadius < this.bottom)
			return false;
		return true;
	}
	
	show() {
    /* top pipe */
    image(pipeRevImg, this.x, this.top - pipeRevImg.height, this.w, pipeRevImg.height);
    /* bottom pipe */
    fill(0, 255, 0);
    image(pipeImg, this.x, this.bottom, this.w, pipeImg.height);
    fill(255, 0, 0);
    // rect(this.x, this.top - pipeRevImg.height, this.w, pipeRevImg.height);
    // rect(this.x, this.bottom, this.w, pipeImg.height );
		return;
	}
}