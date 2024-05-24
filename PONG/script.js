
//HTML elements 
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Static variables
const width = canvas.width;
const height = canvas.height;

//Gave over variable is set as false.
let game_over= false;

//Draw the current state of canvas
//The ball is drawn and given the current X and Y position. 
function draw (){
	//Redrawing the play area and the ball so that there are NO repeated balls, it generates a whole new ball/canvas.
	// draw/redraw play area
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0, width, height);

	// draw/redraw ball
	ctx.fillStyle= 'white';
	ctx.fillRect(ball_move.x,ball_move.y,ball_size,ball_size);
	
	// draw/redraw  paddles
	//Paddle 1 (left)
	ctx.fillStyle= 'white';
	ctx.fillRect(paddle_offset,left_paddle_top, paddle_width, paddle_height)
	//Paddle 2 (right)
	ctx.fillStyle= 'white';
	ctx.fillRect((width-paddle_offset - paddle_width),right_paddle_top, paddle_width, paddle_height)
	//Subtract the width of the paddle since it counts as well.

	//Draw score
	ctx.font = '75px monospace';
	ctx.textAlign = 'left';
	ctx.fillText(leftScore.toString(), 100, 100);

	ctx.font = '75px monospace';
	ctx.textAlign = 'right';
	ctx.fillText(rightScore.toString(), width - 100, 100);
	//Draw the game over text
	if(game_over){
		ctx.fillStyle = 'white';
		ctx.font = '50px monospace';
		ctx.textAlign = 'center';
		ctx.fillText("GAME OVER", width / 2, height / 2);
	}
	
}

//Builds play area
ctx.fillStyle = 'black';
ctx.fillRect(50,50, width, height);


//Ball
//Variable created to dictate ball size.
const ball_size= 20;
//Variable created to dictate ball position/movement.
var ball_move = { x:20 , y:30};

//Speed of ball; horizontal and vertical rate of change.
var x_speed= 15;
var y_speed = 5;

//Function will update the position of the ball
function updateBall(){
	//add on to the existing xy cordinate
	ball_move.x += x_speed;
	ball_move.y += y_speed;	
	track_ball(); //Track ball function is added for the paddle to know its position.
}

//Gameplay
//Check to see if the ball collides iwth the top or bottom edge of the paddle
function adjustAngle(distanceFromTop, distanceFromBottom){

	if(distanceFromTop < 0){
		//If ball is near top of paddle, reduceY speed
		y_speed -= 15;
	}
	else if(distanceFromBottom < 0){
		//If ball is near top of paddle, reduceY speed
		y_speed += 15;
	}
}
//Ball resets to the center of the game.
function resetBall(){
	ball_move = {x:250, y:150}
}
//Variables for the scores are set to 0.
var leftScore = 0;
var rightScore = 0;
//(local) generates a ball object to track each side's of the ball
//check to see if the ball collides wiht the edges of the canvas
//or with either left or right paddle
function checkCollide(){
	var ball = {
		left: ball_move.x,
		right: ball_move.x + ball_size,
		//Add the width of the paddle since it counts as well.
		top: ball_move.y,
		bottom: ball_move.y + ball_size
	}
	//If the ball collide with the left/right edge of the canvas
	if(ball.left < 0 || ball.right > width){
		// {
		// //ternary operator
		// //if we strike the left wall, increment the left score
		// //otherwise, increment the rightScore
		// ball.left < 0 ? leftScore++ : rightScore++:

		// }

		//reverse the edirection of travel
		x_speed = -x_speed;

	}
	if(ball.left < 0){
		//Right score is increased as the ball hits the wall.
		rightScore++;
		//Start the ball all over again and the ball will move to the right.
		resetBall();
		x_speed=15;
		y_speed=5
	}
	if(ball.right > width){
		//Left score is increased as the ball hits the wall.
		leftScore++
		//Start the ball all over again and the ball will move to the left.
		resetBall();
		x_speed=-15;
		y_speed=5;
	}

	if(leftScore== 10 || rightScore == 10 ){
		//If the left or right score equal 10 then game_over is true and the ball will be in a fixed position.
		game_over = true;
		y_speed=0;
		x_speed=0;
	}

	//If the ball collide with the top/bottom edge of the canvas
	if(ball.top < 0 || ball.bottom > height){
		//reverse the edirection of travel
		y_speed= -y_speed;
	}

	//(local) generates the position of the left paddle.
	var left_paddle = {
		left: paddle_offset,
		right: paddle_offset + paddle_width,
		top: left_paddle_top,
		bottom: left_paddle_top + paddle_height
	};
	//(local) generates the position of the right paddle.
	var right_paddle = {
	left: width-paddle_offset - paddle_width,
	right:width-paddle_offset,
	top: right_paddle_top,
	bottom: right_paddle_top + paddle_height
	};
	//Check the collosion of the left paddle
	if(check_paddle_collide(ball, left_paddle)){
		//if we hit the ball with the paddle
		//adjust the angle of attack of the ball
		// when it reverses direction
		let distanceFromTop = ball.top - left_paddle_top;
		let distanceFromBottom= left_paddle.bottom -ball.bottom
		adjustAngle(distanceFromTop, distanceFromBottom)
		x_speed = Math.abs(x_speed)
	}
	//Check the collosion of the right paddle
	if(check_paddle_collide(ball, right_paddle)){
			let distanceFromTop = ball.top - right_paddle_top;
			let distanceFromBottom= right_paddle.bottom -ball.bottom
			adjustAngle(distanceFromTop, distanceFromBottom)
			y_speed = Math.abs(y_speed)

		}
		//You can use the same function for different values 
	
		
};
//Values are created to represent their position in the if statement, and later replaced for actual variables.
function check_paddle_collide(chk_ball, chk_paddle){
		if(	chk_ball.left < chk_paddle.right &&
		chk_ball.right > chk_paddle.left &&
		chk_ball.top <chk_paddle.bottom &&
		chk_ball.bottom >chk_paddle.top){
			x_speed= -x_speed;
		}
}


//Paddle
const paddle_width = 10
const paddle_height =100
const paddle_offset = 20; //Give a specfic distance we can keep the paddles from the sides of the screens.

//Postion of the paddle is set along with its speeds.
var left_paddle_top = 30;
var right_paddle_top= 30;
var paddle_speed= 5; 
var paddle_modifier= 2.35;

//Function to track the ball for the paddle, allowing for adjusment in speeds.
function track_ball(){
	var ball= {
		top: ball_move.y,
		bottom: ball_move.y + ball_size
	}

	var left_paddle={
		top: left_paddle_top,
		bottom: left_paddle_top + paddle_height
	}
	if (ball.top < left_paddle.top){
		left_paddle_top -= paddle_speed*Math.random(1.3,2,0.5,0.6) +paddle_modifier;
	}
	if(ball.bottom >
		left_paddle.bottom){
		left_paddle_top += paddle_speed*Math.random(1.3,2,0.5,0.6)+paddle_modifier;
	}

}

//Event listner is added for the right paddle's mouse movement. 
document.addEventListener("mousemove", (event)=>{//event e points to what will happen on mousemove. 
	//track the offset of the mouse, apply this to the paddles y cordinates
	right_paddle_top =event.offsetY 
	
})

//Game loop
function game_loop(){
	//As long as game over is false, the game will run.
	if(!game_over){
	updateBall();
	checkCollide();
	setTimeout(game_loop,20);
	}	
	draw();
	if(game_over=false){
		leftScore =0;
		rightScore=0;

	}
	}
	game_loop();
// Button resets everything back to normal, the game begins once more.
function playAgain(){
	//Game over is set to false; both scores are set to 0; the speeds are set to normal again.
	game_over=false;
	leftScore =0;
	rightScore=0;
	x_speed= 15;
	y_speed=10

}