var generation = 0;

function nextGeneration() {
	calculateFitness();
	for (let i=0; i<POP_SIZE; i++) {
		birds[i] = spawnChild();
	}
	savedBirds = [];
	generation++;
}

function pickOne() {
	let index = 0;
	let r = random();
	
	while (r > 0) {
		r = r - savedBirds[index].fitness;
		index++;
	}
	index--;
	return savedBirds[index];
}

function spawnChild() {
	let parent = pickOne(savedBirds);
	let child = new Bird(parent.brain);
	child.brain.mutate(mutateNode);
	return child;
}

function calculateFitness() {
	let sum = 0;
	for (let bird of savedBirds)
		sum += bird.score * bird.score;
	
	for (let bird of savedBirds)
		bird.fitness = bird.score * bird.score / sum;
}

function mutateNode(val, i, j) {
	let result = val;
	if (random() < 0.1) {
		let m = random() * 2 - 1;	// a number between -1 and 1
		m = m * 0.1;
		result += m;
	}
	return result;
}

function saveLivingBirds() {
	folderPath = ".";
	for (let i=0; i<birds.length; i++) {
		filename = `${i}.json`;
		let bird = birds[i];
		let details = {
			learningRate: bird.learningRate,
			inputNodes: bird.input_nodes,
			hiddenWeights: bird.brain.weights_ih.data,
			hiddenBiases: bird.brain.bias_h.data.flat(),
			outputWeights: bird.brain.weights_ho.data,
			outputBiases: bird.brain.bias_o.data.flat(),
			Score: 0
		}
		saveJSON(details, filename);
	}
}