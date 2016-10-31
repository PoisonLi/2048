/**
 * Created by Administrator on 16-10-26.
 */

var board = new Array();
var hasConflicted = new Array();
var score = 0;

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

$(document).ready(function(){
    prepareForMobile();
    newGame();
    $('#newgamebutton').click(newGame);
});

function prepareForMobile(){

    if(documentWidth > 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $('#grid_container').css({
        'width':gridContainerWidth - 2 * cellSpace,
        'height':gridContainerWidth - 2 * cellSpace,
        'padding':cellSpace
    });
    $('.grid-cell').css({
        'width':cellSideLength,
        'height':cellSideLength
    });
}

function newGame(){
    init();
    generateOneNumber();
    generateOneNumber();
}

//初始化棋盘格
function init(){
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            var gridCell = $("#grid_cell_"+i+"_"+j);
            gridCell.css("top",getPosTop(i));
            gridCell.css("left",getPosLeft(j));
        }
    }
    for(var i = 0; i < 4; i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(var j = 0; j < 4; j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    updateBoardView();
    score = 0;
    upScore(score);
}

function updateBoardView(){
    $(".number-cell").remove();
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            $("#grid_container").append("<div class='number-cell' id='number_cell_"+i+"_"+j+"'></div>");
            var theNumberCell = $('#number_cell_'+i+'_'+j);
            if(board[i][j] == 0){
                theNumberCell.css('width','0');
                theNumberCell.css('height','0');
                theNumberCell.css('top',getPosTop(i) + cellSideLength/2);
                theNumberCell.css('left',getPosLeft(j) + cellSideLength/2);
            }else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i));
                theNumberCell.css('left',getPosLeft(j));
                theNumberCell.css('backgroundColor',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.css('fontSize',getFontSize(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j] = false;
        }
    }
    $('.number-cell').css('lineHeight',cellSideLength + "px");
    $('.number-cell').css('fontSize',cellSideLength * 0.6 + "px");
}

//随机格子生成数字
function generateOneNumber(){
    if(nospace(board)){
        return false;
    }

    //随机一个位置
    var randx = Math.floor(Math.random() * 4);
    var randy = Math.floor(Math.random() * 4);

    var times = 0;
    while (times < 50){
        if(board[randx][randy] == 0){
            break;
        }
        randx = Math.floor(Math.random() * 4);
        randy = Math.floor(Math.random() * 4);

        times++;
    }
    if(times >= 50){
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4;j++){
                if(board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示数字
    board[randx][randy] = randNumber;
    showAnimation(randx,randy,randNumber);

    return true;
}

$(document).keydown(function(event){
    var event = event || window.event;
    switch (event.keyCode){
        case 37:  //←
            event.preventDefault();
            if(moveLeft()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameOver()",500);
            }
            break;
        case 38:  //↑
            event.preventDefault();
            if(moveUp()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameOver()",500);
            }
            break;
        case 39:  //→
            event.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameOver()",500);
            }
            break;
        case 40:  //↓
            event.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameOver()",500);
            }
            break;
    }
});

document.addEventListener('touchstart',function(event){
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
});

document.addEventListener('touchmove',function(event){
    event.preventDefault();
})

document.addEventListener('touchend',function(event){
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;

    var deltaX = endX - startX;
    var deltaY = endY - startY;

    if(Math.abs(deltaX) < 0.08 * documentWidth && Math.abs(deltaY) < 0.08 * documentWidth){
        return;
    }

    //x
    if(Math.abs(deltaX) >= Math.abs(deltaY)){
        if(deltaX > 0){
            //move right
            if(moveRight()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameOver()",500);
            }
        }else{
            //move left
            if(moveLeft()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameOver()",500);
            }
        }
    }else{   //y
        if(deltaY > 0){
            //move down
            if(moveDown()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameOver()",500);
            }
        }else{
            //move up
            if(moveUp()){
                setTimeout("generateOneNumber()",220);
                setTimeout("isGameOver()",500);
            }
        }
    }
});

function isGameOver(){
    if(nospace(board) && nomove(board)){
        gameOver();
    }
}

function gameOver(){
    $.alertable.alert('GameOver!');
}

function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }
    for(var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {

                for(var k = 0; k < j; k++){
                    if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                        showMoveAnimation(i,j,i,k);

                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                    }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        showMoveAddAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j]= 0;

                        score += board[i][k];
                        upScore(score);

                        hasConflicted[i][k] = true;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}


function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }
    for(var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {

                for(var k = 0; k < i; k++){
                    if(board[k][j] == 0 && noBlockVertical(j,k,i,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                    }else if(board[k][j] == board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
                        showMoveAddAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        upScore(score);

                        hasConflicted[k][j] = true;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }
    for(var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {

                for(var k = 3; k > j; k--){
                    if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                    }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        showMoveAddAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j]= 0;

                        score += board[i][k];
                        upScore(score);

                        hasConflicted[i][k] = true;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }
    for(var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {

                for(var k = 3; k > i; k--){
                    if(board[k][j] == 0 && noBlockVertical(j,i,k,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                    }else if(board[k][j] == board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j]){
                        showMoveAddAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        upScore(score);

                        hasConflicted[k][j] = true;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}
