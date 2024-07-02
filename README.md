# Flappy Bird with Imitation Learning

## Description

In this demonstration, you are the green bird, trying to teach the yellow AI bird how to play the game. Try your best to navigate the pipes, and the bird will learn from your direction!

## Link

You can view the deployed page here:

https://moses-ian.github.io/FlappyBirdMentor

## Usage

Press SPACE to flap
Press T to start or stop training
Press R to reset the game (the bird will keep its memory)
Press P to pause and unpause the game

## Brief Explanation of the Algorithm

The yellow bird's AI is a neural network which takes 5 inputs: the bird's y position, the bird's y velocity, the left edge location of the closest pipe, the y location of the bottom of the top pipe, and the y location of the top of the bottom pipe. The output is a number between 1 and 0, where any number above 0.5 indicates that the bird will flap and otherwise do nothing. The "mentor" (you) plays the game. If the bird is much higher than the mentor (more than 60 pixels above you) then the correct action is to do nothing. So the error is zero minus whatever the network output. If the bird is much lower than the mentor (more than 60 pixels below you) then the correct action is to flap. So the error is one minus the network's output. If the bird is within 60 pixels of you, then the bird is doing the correct thing and the error is zero. The network takes the error and backpropogates it in real time to update the weights.

## Credits

Coding Train Neural Networks: https://www.youtube.com/watch?v=XJ7HLz9VYz0&list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh

## Created by Ian Moses

https://github.com/Moses-Ian

https://moses-ian.github.io/portfolio/

https://www.linkedin.com/in/moses-ian/
