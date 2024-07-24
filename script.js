var gameDimension = getComputedStyle(document.body).getPropertyValue("--game-dimension")

let grid = document.getElementById('grid');

for (let i = 0; i < gameDimension*gameDimension; i++){
    var cellDiv = document.createElement('div');
    cellDiv.className = "cell";
    cellDiv.addEventListener('click', function(){
        if(this.classList.contains('active')){
            this.classList.remove('active');
        } else {
            this.classList.add("active");
        }
    })

    grid.appendChild(cellDiv);
}

let playBtn = document.getElementById('playBtn');
var timeStepInterval;
playBtn.addEventListener('click', function(){
    if(this.classList.contains("active")){
        clearInterval(timeStepInterval);
        this.classList.remove("active");
        this.innerText="Play";
    } else {
        timeStepInterval = setInterval(executeTimeStep, 100);
        this.classList.add("active");
        this.innerText="Pause";
    }
});

function executeTimeStep(){
    let cells = Array.from(document.getElementsByClassName('cell'));
    var cellsCopy = copyCells(cells);
    for (let row = 0; row<gameDimension; row++){
        for (let col =0; col<gameDimension; col++){
            var activeNeighborCount = getActiveNeighborsCount(cells, row, col, gameDimension);
            if (cells[toOneDimensionIndex(row, col, gameDimension)].classList.contains('active')){
                if(activeNeighborCount < 2){
                    cellsCopy[toOneDimensionIndex(row,col, gameDimension)].classList.remove("active");
                } else if (activeNeighborCount == 2 || activeNeighborCount == 3){
                    cellsCopy[toOneDimensionIndex(row,col, gameDimension)].classList.add("active");
                } else {
                    cellsCopy[toOneDimensionIndex(row,col, gameDimension)].classList.remove("active");
                }
            }
            else if ((!cells[toOneDimensionIndex(row,col, gameDimension)].classList.contains('active')) && activeNeighborCount == 3){
                cellsCopy[toOneDimensionIndex(row,col, gameDimension)].classList.add("active");
            }
        }
    }
    grid.replaceChildren();
    cellsCopy.forEach(element => {
        grid.appendChild(element); 
    });
}

function copyCells(cells){
    var out = [];
    for ( let i = 0; i < cells.length; i++){
        var cellDiv = document.createElement('div');
        cellDiv.className = cells[i].className;
        cellDiv.addEventListener('click', function(){
            if(this.classList.contains('active')){
                this.classList.remove('active');
            } else {
                this.classList.add("active");
            }
        })
        out.push(cellDiv)
    }
    return out;
}

function toOneDimensionIndex(row, col, gameDimension){
    return row*gameDimension+col;
}

function getActiveNeighborsCount(cells, row, col, gameDimension){
    if(row < 0 || row >= gameDimension || col < 0 || col >= gameDimension){
        throw 'row or col values in getActiveNeighbors() out of index';
    }
    cells.forEach(element => {
        if (!element.classList.contains("cell")){
            throw 'getActiveNeighbors(): at least one of the cells does not contain the `cell` class';
        }
    });
    if(cells.length != gameDimension*gameDimension){
        throw 'invalid cells length in getActiveNeighborsCount()';
    }
    var count = 0;

    if(row-1>=0 && cells[toOneDimensionIndex(row-1, col, gameDimension)].classList.contains('active')){
        count += 1;
    }
    if(row-1>=0 && col+1<gameDimension && cells[toOneDimensionIndex(row-1, col+1, gameDimension)].classList.contains('active')){
        count += 1;
    }
    if(col+1<gameDimension && cells[toOneDimensionIndex(row, col+1, gameDimension)].classList.contains('active')){
        count += 1;
    }
    if(row+1<gameDimension && col+1<gameDimension && cells[toOneDimensionIndex(row+1, col+1, gameDimension)].classList.contains('active')){
        count += 1;
    }
    if(row+1<gameDimension && cells[toOneDimensionIndex(row+1, col, gameDimension)].classList.contains('active')){
        count += 1;
    }
    if(row+1<gameDimension && col-1>=0 && cells[toOneDimensionIndex(row+1, col-1, gameDimension)].classList.contains('active')){
        count +=1 ;
    }
    if(col-1>=0 && cells[toOneDimensionIndex(row, col-1, gameDimension)].classList.contains('active')){
        count += 1;
    }
    if(row-1>=0 && col-1>=0 && cells[toOneDimensionIndex(row-1, col-1, gameDimension)].classList.contains('active')){
        count += 1;
    }
    return count;
}
