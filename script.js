//Initializing important global variables
var userName;
var userNameActive = false;//variable used to makre sure the user has already entered a username
var score = Number(document.getElementById("score").value);//current score
var highscores = [0,0,0]//for easy, medium, and hard more
var difficulty;
var timer;
var time;
var min;
var sec;

//defining color palette for use
var baseBackgroundColor = "#aadddc";
var clickableColor = "#64a8a7";
var clickedColor = "#00706a";
var currentColor = "#054c48";
var mode;
//defining other important variables
  var firstClicked = false;
//defining the configurations for each dice (16 dice - 6 configuration each)
  var configurations = [
      ["R", "I", "F", "O", "B", "X"],
      ["I", "F", "E", "H", "E", "Y"],
      ["D", "E", "N", "O", "W", "S"],
      ["U", "T", "O", "K", "N", "D"],
      ["H", "M", "S", "R", "A", "D"],
      ["L", "U", "P", "E", "T", "S"],
      ["A", "C", "I", "T", "O", "A"],
      ["Y", "L", "G", "K", "U", "E"],
      ["QU", "B", "M", "J", "O", "A"],
      ["E", "H", "I", "S", "P", "N"],
      ["V", "E", "T", "I", "G", "N"],
      ["B", "A", "L", "I", "Y", "T"],
      ["E", "Z", "A", "V", "N", "D"],
      ["R", "A", "L", "E", "S", "C"],
      ["U", "W", "I", "L", "R", "G"],
      ["P", "A", "C", "E", "M", "D"]
  ]
//creating list of possible buttons that can be clicked
  var clickable = ["", "", "", "", "", "", "", ""];
  var buttonIndex = 0;
//creating list to keep track of all the clicked buttons
  var clickedChars = [];
//creating a list to keep track of all the words the user enters
  var userWords = []

//creating myDictHold which will store all 100,000+ words of the english language
var myDicthold;
//using XMLHttpRequest to copy values from a file on my github to myDictHold
var xhr = new XMLHttpRequest();
xhr.open("GET", "english.txt");
xhr.onload = function() {
    var myDict = xhr.responseText.split("\n");
    myDicthold = new Array(myDict.length);
    for (i = 0; i < myDict.length; i++) {
        myDicthold[i] = "";
        for (j = 0; j < myDict[i].length - 1; j++)
            myDicthold[i] += myDict[i].charAt(j);
    }
}
xhr.send();
//function to check the inputted username to make sure it meets certain criteria
function checkUserName() {
if(!userNameActive){// only executes body if the user has not already created a username
userName = document.getElementById("userName").value;
if(userName.length > 0 && userName.length < 18) {//makes sure entered username is of a valid length
var confirmUserName = confirm("Are you sure you want to use \"" + userName + "\" as your username?") //confirms with user
if(confirmUserName) {
userNameActive = true;
displayDifficulties();//displays the difficulty options for playing the game (easy, med, hard)
document.getElementById("userNameContainer").style.height = 0;
document.getElementById("titleName").innerHTML = "Gamer: " + userName;
}
}
else{
document.getElementById("incorrectUsername").innerHTML = "The username entered was invalid. Please enter a username between 1 and 18 characters";//shows red message is name is invalid
}
}
else {
displayDifficulties();//if the user has previously created a username, and is simply playing a new game, they do not need to reenter a username, and can simply proceed to play the game
}
}
//function to reveal the difficulty menu when the user clicks "PLAY GAME" in the home menu
function displayDifficulties() {
  document.getElementById("difficultyButtons").style.height = "15vh";
}
//function to reveal the help menu and instructions on click of "HOW TO PLAY" in the home menu
function openHelpMenu() {
  document.getElementById("helpText").style.height = "100%";
}
//function to close the help menu when user clicks "I AM READY TO PLAY" in the help menu
function closeHelpMenu() {
  document.getElementById("helpText").style.height = 0;
}
//function which excecutes onclick of one of the difficulty options "easy", "medium", or "hard"
function startGame(time){ // takes in time argument, becuase each difficulty has a different time limit which will be set to the timer. easy - 3min, medium - 2min, hard - 1min
  document.getElementById("menuTitleNameContainer").style.height = 0;
  document.getElementById("preGameMenu").style.width= 0; // closing home menu
  document.getElementById("difficultyButtons").style.height = 0; //closing difficulty button menu
  difficulty = Number(time);  // setting value global of global variable "difficulty" to the time given based on difficulty
  playGame() // executing play game function to actually start the game
}
//main game function which resets all configurations before the game starts, and also begins the game
function playGame(){
  document.getElementById("userStats").innerHTML = "Easy Mode: " + highscores[2] + "<br>Medium Mode: " + highscores[1] + "<br>Hard Mode: " + highscores[0];
  document.getElementById("timer").classList.remove("pulsing"); // removes the pusling css animation effect from the timer
  document.getElementById("timer").style.backgroundColor = "#64a8a7"; //resets timer color
  document.getElementById("endGameMenu").style.height = 0; // closes end game menu
  document.getElementById("endGameMenu").style.opacity = 0;

  //making sure are buttons are no longer dissabled so that the user can actually click them
  document.getElementById("submitButton").diabled = false;
  document.getElementById("clearButton").diabled = false;
  // un disabling all the letter boggle buttons
  for(i=0;i<16;i++) {
    document.getElementById(i).disabled = false;
  }
  document.getElementById("wordSubmitted").innerHTML = ""; // resetting the div containing words submitted
  document.getElementById("score").value = 0;//resetting score bar
    //setting the timings in minutes and seconds for the timer
    min = difficulty - 1;
    sec = 60;
    //reseting key game variables
    firstClicked = false;
    clickable = ["", "", "", "", "", "", "", ""];
    buttonIndex = 0;
    clickedChars = [];
    userWords = [];
    score = 0;
    //starting timer function for countdown
    timer = setInterval(displayTime, 1000);
    //calling function to generate new letters for the game board
    genRandomLetters()
}

//function to generate new letters for the game board
function genRandomLetters() {
    for (i = 0; i < 16; i++) {
        randInt = Math.floor(Math.random() * 6);
        //gets random letter from coresponding list inside the configurations list
        letter = configurations[i][randInt];
        document.getElementById(i).innerHTML = letter;
        document.getElementById(i).value = letter;
    }
}
//checking for key presses as shortcuts to submit and clear board
document.addEventListener('keydown', checkKeyPressedDown);
function checkKeyPressedDown(event) {
    var key = event.keyCode;//getting keyCode
    if(key==39) { //39 = right arrow
      submitWord(); //submitting word
    }
    else if(key == 37) {//37 = left arrow
      clearBoard(); //clearing game board
    }
  }
//function called on click of any of the game board buttons
function buttonClicked(dice) {
    if (firstClicked == false) { //if the first button has just been clicked execute the body of the conditional statement
        firstClicked = true;
        //no need to check if it meets criteria becase it is the first letter and can be clicked anywhere
        var letter = document.getElementById(dice).value;
        document.getElementById("word").value += letter;//adding letter value to the word bar
        displayClickable(dice); //changing colors of the surrounding dice to indicate that they cna be clicked
        showClicked(dice); //turning the clicked dice a darker color to indicate it was clicked
    } else if (firstClicked == true) {//if the first dice has already been clicked, further processing is required to make sure this dice is a valid click
        addValue(dice);// calling addValue function to check if the dice meets certain criteria before adding it to the word bar
    }

}
//function that changes the color of surrounding buttons to indicate that they can be validly clicked by the user
function displayClickable(dice1) {//getting value of die clicked
    resetColors();//reseting colors of all dice before to prevent overlap and errors
    resetConfigurations(); //reseting the list that contains the current clickable options, because those values will now chnage

    var dice = dice1 + 1; // creating variable that has the index of dice clicked increased by 1, to make calculations easier
    var row = Math.ceil((dice) / 4);//getting the value of the row the button is on

    //the rest of the function gets the value of the the indecies of the dice surrounding the clicked die, and sends their value to a function called toggleColor, which puts it through further criteria before changing their color
    var left = dice - 1;
    if (Math.ceil(left / 4) == row) {
        left--;
        toggleColor(left);
    }
    var right = dice + 1;
    if (Math.ceil(right / 4) == row) {
        right--;
        toggleColor(right);
    }
    var bottom = dice + 4;
    bottom--;
    toggleColor(bottom);
    var top = dice - 4;
    top--;
    toggleColor(top);
    var topLeft = dice - 5;
    if (Math.ceil(topLeft / 4) == row - 1) {
        topLeft--;
        toggleColor(topLeft);
    }
    var topRight = dice - 3;
    if (Math.ceil(topRight / 4) == row - 1) {
        topRight--;
        toggleColor(topRight);
    }
    var bottomLeft = dice + 3;
    if (Math.ceil(bottomLeft / 4) == row + 1) {
        bottomLeft--;
        toggleColor(bottomLeft);
    }
    var bottomRight = dice + 5;
    if (Math.ceil(bottomRight / 4) == row + 1) {
        bottomRight--;
        toggleColor(bottomRight);
    }
    buttonIndex = 0;
}

//function to change the color of dice which can be clicked (called by the displayClickable function)
function toggleColor(location) {//gets the index of the button which is to have its color changed
  //using try catch statement, becuase sometimes the index does not exist on edge cases. eg. When a button is clicked on the very right edge, there are no buttons to the right, or disgonaly right from it, and so it gives and error.
    try {
        if (clickedChars.includes(location) == false) {//making sure button has not already been clicked before, to help keep track of already clciked buttons
            document.getElementById(location).style.backgroundColor = clickableColor;
            clickable[buttonIndex] = location;//updating values in the list of clickable buttons for processing purposes
            buttonIndex++;

        }
        //if there is such as error, do nothing
    } catch (error) {}

}
//functin to reset the colors of all the buttons on the board
function resetColors() {
    for (i = 0; i < 16; i++) {
        document.getElementById(i).style.backgroundColor = baseBackgroundColor;//reseting all colors to base color
    }
    for (i = 0; i < clickedChars.length; i++) { //setting the values of already clicked buttons to a darker shade to indicate they have aready been clicked
        var char = clickedChars[i];
        document.getElementById(char).style.backgroundColor = clickedColor;
    }
}
//reseting the list of clickable dice...called by the (buttonClicked function)
function resetConfigurations() {
    for (i = 0; i < 8; i++) {
        clickable[i] = "";
    }
}
//function which is called on the click of a button to change the color of the current clicked button to a darker shade, and also add it to the list of dice clicked
function showClicked(dice) {
    document.getElementById(dice).style.backgroundColor = currentColor;
    clickedChars.push(dice);
}
//function called on the click of a button (which is not the first clicked), to make sure it is a valid click before changing the board
function addValue(dice) {
    if (clickable.includes(dice)) {//making sure the list of clickable dice contains the value of the current clicked button
        var character = document.getElementById(dice).value;
        document.getElementById("word").value += character;//adding letter to word bar
        displayClickable(dice); // calling display clickable function to show which button can be clicked next
        showClicked(dice);//changes color of the current button to a darker shade
    }
}
//function called on the click of the "SUBMIT WORD" button or the RIGHT ARROW key. It checks the current word against sets of criteria to make sure it is valid, and then updates score is needed.
function submitWord() {
    word = document.getElementById("word").value.toLowerCase();//getting user's word
    wordLen = word.length;
    //dictionary check occurs here
    if (myDicthold.includes(word) && !userWords.includes(word) && wordLen > 2) {// checks if a) the dictionary includes the user's word, b) the user has not already entered it previously during the game, and c) making sure the word is 3 letters of longer
        userWords.push(word)//adding it to the list of user's valid words list
        //adding the word to the div on screen containing all of the user's valid words
        if(userWords.length == 1) {
          document.getElementById("wordSubmitted").innerHTML += word;
        }
        else {
          document.getElementById("wordSubmitted").innerHTML += ", " + word; // "," is used for formatting purposes
        }
        document.getElementById("word").value = "";//reseting the value of the current word space
        wordScore = word.length; // getting the score value of the current word
        score += wordScore;//adding current word score to the total user score
        document.getElementById("score").value = score;//updataing the value to be displayed on screen
        changeTextBoxColor("mediumseagreen");//making the box breifly flash green to indicate the word was valid
    }
    //if the word was not in the dictionary,  or already entered it goes through the following else if statement
    else if(word.length > 0){//makes sure the word length is greater that 0 letters, so that the user cannot spam the "submit word" button during the game
    changeTextBoxColor("tomato");//breifly flashes the box red to show the word was invalid
    }
    //if the word is valid, or not...the following will always be executed
    document.getElementById("word").value = "";//resetting word
    clickedChars.length = 0;//reseting list of the clicked dice
    firstClicked = false;
    resetColors();//reseting the colors of the dice
    resetConfigurations();//resetting the configurations of the dice

}
function changeTextBoxColor(myColor) {// function to change the background color of the word input box red or green.
  document.getElementById("word").style.backgroundColor = myColor;
  setTimeout(function(){ document.getElementById("word").style.backgroundColor ="#64a8a7";}, 800);// turns it back to original color after 0.8 seconds

}

//the function used to display the time in the timer, this function is called through setInterval(), and is done every 1000ms
function  displayTime(){
  var tempZero = "";//a temporary "0" added at the begining when seconds is less than 10...so that it displays 1:09, rather than 1:9
  if(sec < 11) {
    tempZero = "0";
  }
  else {
    tempZero = ""
  }
sec--;//subtracting 1 from the second value each time the function is called
  document.getElementById("timer").innerHTML = min + " : " + tempZero + sec;//updating the timer

  if (min == 0 && sec==0) { // if time runs out, it calls the gameOver() function
    gameOver()

  }
  if (sec == 00) {//is seconds have reached 0, 1 is subtracted from minutes, and seconds is set back to 60
    min--;
    sec = 59;

  }
}

function clearBoard(){//clear board function called on click of "clear board" button, or left arrwo key
    document.getElementById("word").value = ""//reset word
    clickedChars.length = 0;//reset list of clicked dice
    resetColors();//reset the colors of all the dice
    firstClicked = false;
    resetConfigurations();//resetting all configurations of dice
}
function gameOver() {// executes when the timer reaches 0
  clearInterval(timer);//stops timer from running
  document.getElementById("timer").innerHTML = "Time's Up"; // changes timer to say "times up"
  document.getElementById("timer").style.backgroundColor = "#054c48";
  document.getElementById("submitButton").diabled = true;//disabling buttons so the user can no longer click them
  document.getElementById("clearButton").diabled = true;
  document.getElementById("word").value = ""; // reseting the value of the current entered word

  for(i=0;i<16;i++) {//looping through all the dice to reset them
    document.getElementById(i).disabled = true;
    document.getElementById(i).style.backgroundColor = "#aadddc"

  }
  document.getElementById("timer").classList.add("pulsing");//adds a pusling css keyframe animation to the timer, to make it look like it is pulsing for a cool effect
  document.getElementById("endGameMenu").style.height = "100vh";//opening the end game menu
  document.getElementById("endGameMenu").style.opacity = 0.8;
  //using conditionals to check which difficulty they are currently playing on. (easy, med, or hard)
  if(difficulty == 1) {
    mode = "HARD"
  }
  else if(difficulty == 2) {
    mode = "MEDIUM"
  }
  else if(difficulty == 3) {
    mode = "EASY"
  }
  //checking if the score they got is higher then their current high score...if true, the highscore will be updated
  if(score > highscores[difficulty - 1]) {
    highscores[difficulty - 1] = score;
  }
  //creating the content that the end game menu will display (username, score, high score, words entered, replay game button, and main menu button)
  document.getElementById("txt").innerHTML = "<span class='large'>" + userName + "</span><br><span class='medium'>SCORE</span> <br> <span class='large'>" + score + "</span><br><span class='small'>" + mode + " MODE HIGH SCORE: " + highscores[difficulty - 1] +"</span><br><span class='medium'>Word(s) Entered</span> <br><span class='small'>" + userWords.join(", ") + "</span><br><br>";
}

function returnToMenu() {//the function is executed when the user clicks "Main menu" in the end game menu screen
  document.getElementById("preGameMenu").style.width = "100%"; // opens main menu
    document.getElementById("endGameMenu").style.height = 0;// closes end game menu
    document.getElementById("endGameMenu").style.opacity = 0;
    document.getElementById("menuTitleNameContainer").style.height = "15vh";

}
function quitGame() {// the function is called when the user clicks "quit game", to end the game prematurely
  document.getElementById("preGameMenu").style.width = "100%"; // opens main menu
    document.getElementById("menuTitleNameContainer").style.height = "15vh";
    clearInterval(timer);//sotps timer
    document.getElementById("word").value = "";//resets word
    for(i=0;i<16;i++) {//looping through all dice to reset their properties
      document.getElementById(i).disabled = true;
      document.getElementById(i).style.backgroundColor = "#aadddc"
    }
}