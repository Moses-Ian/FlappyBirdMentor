// Other techniques for learning

class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);


class NeuralNetwork {
  /*
  * if first argument is a NeuralNetwork the constructor clones it
  * USAGE: cloned_nn = new NeuralNetwork(to_clone_nn);
  */
  constructor(in_nodes, hid_nodes, hid_nodes_2, out_nodes) {
    if (in_nodes instanceof NeuralNetwork) {
			let a = in_nodes;
      this.input_nodes = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
			this.hidden_nodes_2 = a.hidden_nodes_2;
      this.output_nodes = a.output_nodes;

      this.weights_ih = a.weights_ih.copy();
			this.weights_hh = a.weights_hh.copy();
      this.weights_ho = a.weights_ho.copy();

      this.bias_h = a.bias_h.copy();
			this.bias_h2 = a.bias_h2.copy();
      this.bias_o = a.bias_o.copy();
    } else {
      this.input_nodes = in_nodes;
      this.hidden_nodes = hid_nodes;
			this.hidden_nodes_2 = hid_nodes_2;
      this.output_nodes = out_nodes;

      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
			this.weights_hh = new Matrix(this.hidden_nodes_2, this.hidden_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes_2);
      this.weights_ih.randomize();
			this.weights_hh.randomize();
      this.weights_ho.randomize();

      this.bias_h = new Matrix(this.hidden_nodes, 1);
			this.bias_h2 = new Matrix(this.hidden_nodes_2, 1);
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_h.randomize();
			this.bias_h2.randomize();
      this.bias_o.randomize();
    }

    // TODO: copy these as well
    this.setLearningRate();
    this.setActivationFunction();


  }

  predict(input_array) {
		// Generating the Hidden Outputs
    this.inputs = Matrix.fromArray(input_array);
		this.hidden = Matrix.multiply(this.weights_ih, this.inputs);
    this.hidden.add(this.bias_h);
    // activation function!
    this.hidden.map(this.activation_function.func);
		
		// hidden layer 2
		this.hidden2 = Matrix.multiply(this.weights_hh, this.hidden);
		this.hidden2.add(this.bias_h2);
		this.hidden2.map(this.activation_function.func);

    // Generating the output's output!
		this.outputs = Matrix.multiply(this.weights_ho, this.hidden2);
    this.outputs.add(this.bias_o);
    this.outputs.map(this.activation_function.func);
		
		// Sending back to the caller!
    return this.outputs.toArray();
  }

  setLearningRate(learning_rate = learningRate) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

	// I save the outputs of each layer as variables
	// so this will always assume that the errors are for the most recent set of inputs
  backPropogation(errors) {
		let output_errors = Matrix.fromArray(errors);
		
		// calculate the output gradient
		let gradients = Matrix.map(this.outputs, this.activation_function.dfunc);
		gradients.multiply(output_errors);
		gradients.multiply(this.learning_rate);

		// Calculate deltas
    let hidden2_T = Matrix.transpose(this.hidden2);
		let weight_ho_deltas = Matrix.multiply(gradients, hidden2_T);

    // Adjust the weights by deltas
    this.weights_ho.add(weight_ho_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_o.add(gradients);

    // Calculate the hidden layer errors
    let who_t = Matrix.transpose(this.weights_ho);
		let hidden2_errors = Matrix.multiply(who_t, output_errors);

    // Calculate hidden gradient
    let hidden2_gradient = Matrix.map(this.hidden2, this.activation_function.dfunc);
		hidden2_gradient.multiply(hidden2_errors);
		hidden2_gradient.multiply(this.learning_rate);
		
		// calculate hidden -> hidden2 deltas
		let hidden_T = Matrix.transpose(this.hidden);
		let weights_hh_deltas = Matrix.multiply(hidden2_gradient, hidden_T);
		this.weights_hh.add(weights_hh_deltas)
		this.bias_h2.add(hidden2_gradient);
		
		let hidden_errors = Matrix.multiply(this.weights_hh, hidden2_errors);
		let hidden_gradient = Matrix.map(this.hidden, this.activation_function.dfunc);
		hidden_gradient.multiply(hidden_errors);
		hidden_gradient.multiply(this.learning_rate);

    // Calcuate input->hidden deltas
    let inputs_T = Matrix.transpose(this.inputs);
		let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);

    this.weights_ih.add(weight_ih_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_h.add(hidden_gradient);
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
    nn.weights_ih = Matrix.deserialize(data.weights_ih);
    nn.weights_ho = Matrix.deserialize(data.weights_ho);
    nn.bias_h = Matrix.deserialize(data.bias_h);
    nn.bias_o = Matrix.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }


  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  // Accept an arbitrary function for mutation
  mutate(func) {
    this.weights_ih.map(func);
    this.weights_ho.map(func);
    this.bias_h.map(func);
    this.bias_o.map(func);
  }



}
