var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 10;
var ballY = 10;
var ballSpeedY = 3;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 4;

var showingWinScreen = false;

var paddleY = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

function calculateMousePos(e) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = e.clientX - rect.left - root.scrollLeft;
	var mouseY = e.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(e) {
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

window.onload = function () {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(function () {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);

	canvas.addEventListener('mousedown', handleMouseClick);

	canvas.addEventListener('mousemove', 
		function (e) {
			var mousePos = calculateMousePos(e);
			paddleY = mousePos.y - (PADDLE_HEIGHT/2);	
		})
}

function ballReset() {
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showingWinScreen = true;
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function computerMovment() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter < ballY - 35) {
		paddle2Y += 6;
	} else if (paddle2YCenter < ballY + 35) {
		paddle2Y -= 6;
	}
}

function moveEverything() {
	if(showingWinScreen) {
		return; 
	}
	computerMovment()

	ballX += ballSpeedX;
	if(ballX < 10) {
		if(ballY > paddleY && ballY < paddleY + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddleY + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score++; //must be before reset
			ballReset();
		}
	}
	if(ballX > canvas.width - 10) {
		if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			ballReset();
			player1Score++;
		}
	}

	ballY += ballSpeedY;
	if(ballY > canvas.height - 10 || ballY < 10) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawEverything() {
	colorRect(0,0,canvas.width,canvas.height, 'black');
	if(showingWinScreen) {
		canvasContext.fillStyle = 'white';
		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText("YOU WON!", 380, 200)
		} else if (player2Score >= WINNING_SCORE) {
			canvasContext.fillText("YOU LOST :(", 380, 200)
		}
		canvasContext.fillText("CLICK TO CONTINUE", 350, 500);
		return; 
	}
	colorRect(0,paddleY,PADDLE_WIDTH,PADDLE_HEIGHT, 'white');
	colorRect(canvas.width - PADDLE_WIDTH,paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT, 'white');

	colorCircle(ballX, ballY, 10, 'white');

	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width - 100, 100);
	
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}