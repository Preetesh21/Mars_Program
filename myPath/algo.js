// Here we are creating a class for queues.
function Queue() {
    this.stack = new Array();
    this.dequeue = function() {
        return this.stack.pop();
    }
    this.enqueue = function(item) {
        this.stack.unshift(item);
        return;
    }
    this.empty = function() {
        return (this.stack.length == 0);
    }
    this.clear = function() {
        this.stack = new Array();
        return;
    }
}


// Here we are creating a class for min heap.
function minHeap() {
    this.heap = [];
    this.isEmpty = function() {
        return (this.heap.length == 0);
    }
    this.clear = function() {
        this.heap = [];
        return;
    }
    this.getMin = function() {
        if (this.isEmpty()) {
            return null;
        }
        var min = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap[this.heap.length - 1] = min;
        this.heap.pop();
        if (!this.isEmpty()) {
            this.siftDown(0);
        }
        return min;
    }
    this.push = function(item) {
        this.heap.push(item);
        this.siftUp(this.heap.length - 1);
        return;
    }
    this.parent = function(index) {
        if (index == 0) {
            return null;
        }
        return Math.floor((index - 1) / 2);
    }
    this.children = function(index) {
        return [(index * 2) + 1, (index * 2) + 2];
    }
    this.siftDown = function(index) {
        var children = this.children(index);
        var leftChildValid = (children[0] <= (this.heap.length - 1));
        var rightChildValid = (children[1] <= (this.heap.length - 1));
        var newIndex = index;
        if (leftChildValid && this.heap[newIndex][0] > this.heap[children[0]][0]) {
            newIndex = children[0];
        }
        if (rightChildValid && this.heap[newIndex][0] > this.heap[children[1]][0]) {
            newIndex = children[1];
        }
        // No sifting down needed
        if (newIndex === index) { return; }
        var val = this.heap[index];
        this.heap[index] = this.heap[newIndex];
        this.heap[newIndex] = val;
        this.siftDown(newIndex);
        return;
    }
    this.siftUp = function(index) {
        var parent = this.parent(index);
        if (parent !== null && this.heap[index][0] < this.heap[parent][0]) {
            var val = this.heap[index];
            this.heap[index] = this.heap[parent];
            this.heap[parent] = val;
            this.siftUp(parent);
        }
        return;
    }
}

// helper functions

function createVisited() {
    var visited = [];
    var cells = document.getElementsByTagName('td');
    for (var i = 0; i < totalRows; i++) {
        var row = [];
        for (var j = 0; j < totalCols; j++) {
            if (cellIsAWall(i, j, cells)) {
                row.push(true);
            } else {
                row.push(false);
            }
        }
        visited.push(row);
    }
    return visited;
}

function cellIsAWall(i, j, cells) {
    var cellNum = (i * (totalCols)) + j;
    return (cells[cellNum]).classList.contains("wall");
}


function createDistances() {
    var distances = [];
    for (var i = 0; i < totalRows; i++) {
        var row = [];
        for (var j = 0; j < totalCols; j++) {
            row.push(Number.POSITIVE_INFINITY);
        }
        distances.push(row);
    }
    return distances;
}

function createPrev() {
    var prev = [];
    for (var i = 0; i < totalRows; i++) {
        var row = [];
        for (var j = 0; j < totalCols; j++) {
            row.push(null);
        }
        prev.push(row);
    }
    return prev;
}

function getNeighbors(i, j) {
    var neighbors = [];
    if (i > 0) { neighbors.push([i - 1, j]); }
    if (j > 0) { neighbors.push([i, j - 1]); }
    if (i < (totalRows - 1)) { neighbors.push([i + 1, j]); }
    if (j < (totalCols - 1)) { neighbors.push([i, j + 1]); }
    return neighbors;
}

// Searching algorithms

function DFS(i, j, visited) {
    if (i == endCell[0] && j == endCell[1]) {
        cellsToAnimate.push([
            [i, j], "success"
        ]);
        return true;
    }
    visited[i][j] = true;
    cellsToAnimate.push([
        [i, j], "searching"
    ]);
    var neighbors = getNeighbors(i, j);
    for (var k = 0; k < neighbors.length; k++) {
        var m = neighbors[k][0];
        var n = neighbors[k][1];
        if (!visited[m][n]) {
            var pathFound = DFS(m, n, visited);
            if (pathFound) {
                cellsToAnimate.push([
                    [i, j], "success"
                ]);
                return true;
            }
        }
    }
    cellsToAnimate.push([
        [i, j], "visited"
    ]);
    return false;
}

function BFS() {
    var pathFound = false;
    var myQueue = new Queue();
    var prev = createPrev();
    var visited = createVisited();
    myQueue.enqueue(startCell);
    cellsToAnimate.push([startCell, "searching"]);
    visited[startCell[0]][startCell[1]] = true;
    while (!myQueue.empty()) {
        var cell = myQueue.dequeue();
        var r = cell[0];
        var c = cell[1];
        cellsToAnimate.push([cell, "visited"]);
        if (r == endCell[0] && c == endCell[1]) {
            pathFound = true;
            break;
        }
        // Put neighboring cells in queue
        var neighbors = getNeighbors(r, c);
        for (var k = 0; k < neighbors.length; k++) {
            var m = neighbors[k][0];
            var n = neighbors[k][1];
            if (visited[m][n]) { continue; }
            visited[m][n] = true;
            prev[m][n] = [r, c];
            cellsToAnimate.push([neighbors[k], "searching"]);
            myQueue.enqueue(neighbors[k]);
        }
    }
    // Make any nodes still in the queue "visited"
    while (!myQueue.empty()) {
        var cell = myQueue.dequeue();
        var r = cell[0];
        var c = cell[1];
        cellsToAnimate.push([cell, "visited"]);
    }
    // If a path was found, illuminate it
    if (pathFound) {
        var r = endCell[0];
        var c = endCell[1];
        cellsToAnimate.push([
            [r, c], "success"
        ]);
        while (prev[r][c] != null) {
            var prevCell = prev[r][c];
            r = prevCell[0];
            c = prevCell[1];
            cellsToAnimate.push([
                [r, c], "success"
            ]);
        }
    }
    return pathFound;
}

function dijkstra() {
    var pathFound = false;
    var myHeap = new minHeap();
    var prev = createPrev();
    var distances = createDistances();
    var visited = createVisited();
    distances[startCell[0]][startCell[1]] = 0;
    myHeap.push([0, [startCell[0], startCell[1]]]);
    cellsToAnimate.push([
        [startCell[0], startCell[1]], "searching"
    ]);
    while (!myHeap.isEmpty()) {
        var cell = myHeap.getMin();
        var i = cell[1][0];
        var j = cell[1][1];
        if (visited[i][j]) { continue; }
        visited[i][j] = true;
        cellsToAnimate.push([
            [i, j], "visited"
        ]);
        if (i == endCell[0] && j == endCell[1]) {
            pathFound = true;
            break;
        }
        var neighbors = getNeighbors(i, j);
        for (var k = 0; k < neighbors.length; k++) {
            var m = neighbors[k][0];
            var n = neighbors[k][1];
            if (visited[m][n]) { continue; }
            var newDistance = distances[i][j] + 1;
            if (newDistance < distances[m][n]) {
                distances[m][n] = newDistance;
                prev[m][n] = [i, j];
                myHeap.push([newDistance, [m, n]]);
                cellsToAnimate.push([
                    [m, n], "searching"
                ]);
            }
        }
    }
    // Make any nodes still in the heap "visited"
    while (!myHeap.isEmpty()) {
        var cell = myHeap.getMin();
        var i = cell[1][0];
        var j = cell[1][1];
        if (visited[i][j]) { continue; }
        visited[i][j] = true;
        cellsToAnimate.push([
            [i, j], "visited"
        ]);
    }
    // If a path was found, illuminate it
    if (pathFound) {
        var i = endCell[0];
        var j = endCell[1];
        cellsToAnimate.push([endCell, "success"]);
        while (prev[i][j] != null) {
            var prevCell = prev[i][j];
            i = prevCell[0];
            j = prevCell[1];
            cellsToAnimate.push([
                [i, j], "success"
            ]);
        }
    }
    return pathFound;
}

function AStar() {
    var pathFound = false;
    var myHeap = new minHeap();
    var prev = createPrev();
    var distances = createDistances();
    var costs = createDistances();
    var visited = createVisited();
    distances[startCell[0]][startCell[1]] = 0;
    costs[startCell[0]][startCell[1]] = 0;
    myHeap.push([0, [startCell[0], startCell[1]]]);
    cellsToAnimate.push([
        [startCell[0], startCell[1]], "searching"
    ]);
    while (!myHeap.isEmpty()) {
        var cell = myHeap.getMin();
        var i = cell[1][0];
        var j = cell[1][1];
        if (visited[i][j]) { continue; }
        visited[i][j] = true;
        cellsToAnimate.push([
            [i, j], "visited"
        ]);
        if (i == endCell[0] && j == endCell[1]) {
            pathFound = true;
            break;
        }
        var neighbors = getNeighbors(i, j);
        for (var k = 0; k < neighbors.length; k++) {
            var m = neighbors[k][0];
            var n = neighbors[k][1];
            if (visited[m][n]) { continue; }
            var newDistance = distances[i][j] + 1;
            if (newDistance < distances[m][n]) {
                distances[m][n] = newDistance;
                prev[m][n] = [i, j];
                cellsToAnimate.push([
                    [m, n], "searching"
                ]);
            }
            var newCost = distances[i][j] + Math.abs(endCell[0] - m) + Math.abs(endCell[1] - n);
            if (newCost < costs[m][n]) {
                costs[m][n] = newCost;
                myHeap.push([newCost, [m, n]]);
            }
        }
    }
    // Make any nodes still in the heap "visited"
    while (!myHeap.isEmpty()) {
        var cell = myHeap.getMin();
        var i = cell[1][0];
        var j = cell[1][1];
        if (visited[i][j]) { continue; }
        visited[i][j] = true;
        cellsToAnimate.push([
            [i, j], "visited"
        ]);
    }
    // If a path was found, illuminate it
    if (pathFound) {
        var i = endCell[0];
        var j = endCell[1];
        cellsToAnimate.push([endCell, "success"]);
        while (prev[i][j] != null) {
            var prevCell = prev[i][j];
            i = prevCell[0];
            j = prevCell[1];
            cellsToAnimate.push([
                [i, j], "success"
            ]);
        }
    }
    return pathFound;
}


function greedyBestFirstSearch() {
    var pathFound = false;
    var myHeap = new minHeap();
    var prev = createPrev();
    var costs = createDistances();
    var visited = createVisited();
    costs[startCell[0]][startCell[1]] = 0;
    myHeap.push([0, [startCell[0], startCell[1]]]);
    cellsToAnimate.push([
        [startCell[0], startCell[1]], "searching"
    ]);
    while (!myHeap.isEmpty()) {
        var cell = myHeap.getMin();
        var i = cell[1][0];
        var j = cell[1][1];
        if (visited[i][j]) { continue; }
        visited[i][j] = true;
        cellsToAnimate.push([
            [i, j], "visited"
        ]);
        if (i == endCell[0] && j == endCell[1]) {
            pathFound = true;
            break;
        }
        var neighbors = getNeighbors(i, j);
        for (var k = 0; k < neighbors.length; k++) {
            var m = neighbors[k][0];
            var n = neighbors[k][1];
            if (visited[m][n]) { continue; }
            var newCost = Math.abs(endCell[0] - m) + Math.abs(endCell[1] - n);
            if (newCost < costs[m][n]) {
                prev[m][n] = [i, j];
                costs[m][n] = newCost;
                myHeap.push([newCost, [m, n]]);
                cellsToAnimate.push([
                    [m, n], "searching"
                ]);
            }
        }
    }
    // Make any nodes still in the heap "visited"
    while (!myHeap.isEmpty()) {
        var cell = myHeap.getMin();
        var i = cell[1][0];
        var j = cell[1][1];
        if (visited[i][j]) { continue; }
        visited[i][j] = true;
        cellsToAnimate.push([
            [i, j], "visited"
        ]);
    }
    // If a path was found, illuminate it
    if (pathFound) {
        var i = endCell[0];
        var j = endCell[1];
        cellsToAnimate.push([endCell, "success"]);
        while (prev[i][j] != null) {
            var prevCell = prev[i][j];
            i = prevCell[0];
            j = prevCell[1];
            cellsToAnimate.push([
                [i, j], "success"
            ]);
        }
    }
    return pathFound;
}