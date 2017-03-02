var rowSize; // check the puzzle size (eg. 4x4 : rowSize = 4)
var imgArray = []; // img array with key(1-16 flattened value) and value (imgId)
var emptyTileRow; // check on which row the empty tile is (the last part of the picture)

var main = function () {
    getRowSize();
    setListenerToImg();
    setTiles();
}
window.addEventListener('load', main);

function getRowSize() {
    var table = document.getElementsByTagName('table')[0];
    var rows = table.getElementsByTagName('tr');
    rowSize = rows.length;
}

function setListenerToImg() {
    var table = document.getElementsByTagName('table')[0];
    var cells = table.getElementsByTagName('img');

    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];

        cell.addEventListener('click', getClickedImgIndexToSwap, false);
    }
}

function getClickedImgIndexToSwap() {

    var clickedImg = document.getElementById(this.id);

    swap(clickedImg);
}

function swap(clickedImg) {
    if (clickedImg.getAttribute('hidden') != true) {
        var emptyTileIndex = findEmptyTile();
        var id = clickedImg.getAttribute('id').split('');
        var emptyTile = document.getElementById(emptyTileIndex);

        //Check up, down, left, right of the clicked img
        var x = [-1, 0, 1, 0];
        var y = [0, 1, 0, -1];

        for (var i = 0; i < 4; i++) {
            var xToCheck = parseInt(id[0]) + x[i];
            var yToCheck = parseInt(id[1]) + y[i];

            if (emptyTileIndex == xToCheck.toString() + yToCheck.toString()) {
                var temp = clickedImg.getAttribute('src');
                clickedImg.setAttribute('src', emptyTile.getAttribute('src'));
                clickedImg.setAttribute('hidden', true);

                emptyTile.setAttribute('src', temp);
                emptyTile.removeAttribute('hidden');
            }
        }
    }
}

function findEmptyTile() {
    //https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
    var emptyTile = document.querySelectorAll('[hidden="true"]')[0];

    return emptyTile.getAttribute('id');
}

function setTiles() {
    var imgIndex = []; // img id in order 00-33

    for (var i = 0; i < rowSize; i++) {
        for (var j = 0; j < rowSize; j++) {
            // convert id into 1-16 value as flattened order
            var flattenedValue = (i + 1) + (j * rowSize);

            imgArray.push({
                "flattenedValue": flattenedValue,
                "imgId": i.toString() + j.toString()
            });

            imgIndex.push(i.toString() + j.toString());
        }
    }


    //shuffle until it is solvable.

    do {
        shuffleList(imgArray);
    } while (!checkSolvability())


    //set the solvable shuffled tiles
    for (var i = 0; i < imgIndex.length; i++) {
        var cell = document.getElementById(imgIndex[i]);

        if (imgArray[i].imgId == (rowSize - 1) * 11) {
            cell.setAttribute('hidden', 'true');
        }
        cell.setAttribute('src', 'img/hall-' + imgArray[i].imgId + '.jpg');
        //or use css
        cell.style.width = "100px";
        cell.style.height = "100px";
    }
}

function shuffleList(array) {
    //https://bost.ocks.org/mike/shuffle/
    var m = array.length,
        t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
}

function checkSolvability() {
    var inversions = 0;
    var listToCheck = convertListOrder(); // flattened order with 1-15 (without empty tile) value

    for (var i = 0; i < listToCheck.length; i++) {
        for (var j = i + 1; j < listToCheck.length; j++) {

            if ((listToCheck[i] > listToCheck[j])) {
                inversions++;
            }
        }
    }

    return checkInversion(inversions);
}

function checkInversion(inversions) {
    if (rowSize % 2 == 1) { // odd numbered row (3x3, 5x5..)
        return (inversions % 2 == 0);
    } else { // even numbered row (4x4...)
        console.log("odd inversion + odd distance/ even inversion - even distance : solvability :" + ((inversions + rowSize - emptyTileRow) % 2 == 0));
        console.log("inversion: " + inversions + ", row distance between empty and bottom: " + (rowSize - emptyTileRow));


        return ((inversions + rowSize - emptyTileRow) % 2 == 0);
    }

}

function convertListOrder() {
    var flattenedOrder = [];
    var listToCheck = [];

    // index written out in a flattened order (0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15) 

    for (var i = 0; i < rowSize; i++) {
        for (var j = 0; j < rowSize; j++) {
            flattenedOrder.push(imgArray[(j * rowSize) + i]);

            for (var k = 0; k < flattenedOrder.length; k++) {

                if (flattenedOrder[k].imgId == (rowSize - 1) * 11) {
                    emptyTileRow = Math.floor(i / 4) + 1;
                    console.log("empty tile row: " + emptyTileRow);
                }
            }
        }
    }
    
    for (var i = 0; i < flattenedOrder.length; i++) {

        if (flattenedOrder[i].flattenedValue != (rowSize * rowSize))
        // value 16 (the last img) should be excluded
            listToCheck.push(flattenedOrder[i].flattenedValue);
    }

    console.log("1-15 without empty tile value to check inversion: " + listToCheck);

    return listToCheck;
}