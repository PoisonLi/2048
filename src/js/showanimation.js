function showAnimation(i,j,randNumber){
    var numberCell = $('#number_cell_'+i+"_"+j);

    numberCell.css('backgroundColor',getNumberBackgroundColor(randNumber));
    numberCell.css('color',getNumberColor(randNumber));
    numberCell.css('fontSize',getFontSize(randNumber));
    numberCell.text(randNumber);

    numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop(i),
        left:getPosLeft(j)
    },100);
}

function showMoveAnimation(fromx,fromy,tox,toy){
    var numberCell = $('#number_cell_'+fromx+'_'+fromy);
    numberCell.animate({
        top:getPosTop(tox),
        left:getPosLeft(toy)
    },200)
}

function showMoveAddAnimation(fromx,fromy,tox,toy){
    var numberCell = $('#number_cell_'+fromx+'_'+fromy);
    numberCell.animate({
        top:getPosTop(tox),
        left:getPosLeft(toy)
    },200,function(){
        var numberCell2 = $('#number_cell_'+tox+'_'+toy);
        numberCell2.animate({
            top:getPosTop(tox)-5,
            left:getPosLeft(toy)-5,
            width:cellSideLength * 1.1 + "px",
            height:cellSideLength * 1.1 + "px",
            fontSize:getFontSize2(board[tox][toy]),
            lineHeight:cellSideLength * 1.1 + "px"
        },100,function(){
            numberCell2.animate({
                top:getPosTop(tox),
                left:getPosLeft(toy),
                width:cellSideLength,
                height:cellSideLength,
                fontSize:getFontSize(board[tox][toy]),
                lineHeight:cellSideLength + "px"
            },100)
        })
    })
}

function upScore(score){
    $('#score').text(score);
}