const { startCoordinate, endCoordinate } = require('./config');
const {
	pickRandomField, move, buildPath, markPath, markBlocks, logGrid,
} = require('./functions');
const {
	START, END, FREE, VISITED, PATH,
} = require('./constants');

const matrix = [];
const [startX, startY] = startCoordinate;
const [endX, endY] = endCoordinate;

for (let i = 0; i < 10; i += 1) {
	matrix[i] = [];
	for (let j = 0; j < 10; j += 1) {
		matrix[i][j] = FREE;
	}
}
matrix[startX][startY] = START;
matrix[endX][endY] = END;

function findShortestPath(grid, startCoord, endCoord) {
	const [sX, sY] = startCoord;
	const [eX, eY] = endCoord;
	grid[eX][eY] = END;
	const startField = {
		x: sX,
		y: sY,
		predecessor: null,
		type: START,
	};
	const queue = [startField];
	let shortestPath = null;

	while (queue.length) {
		const current = queue.shift();
		const directions = ['up', 'down', 'left', 'right'];
		const len = directions.length;
		for (let i = 0; i < len; i += 1) {
			const field = move(current, directions[i], grid);
			if (field.type === END) {
				shortestPath = buildPath(field);
				return shortestPath;
			}
			if (field.type === FREE) {
				queue.push(field);
			}
		}
	}
	return shortestPath;
}

const mapIndexes = (val, i) => i;
const matrixIndexes = matrix.map(v => v.map(mapIndexes));
let freeFieldsIndexes = matrixIndexes.map((col, iCol) => (
	col.filter(iRow => matrix[iCol][iRow] === FREE)
));

let matrixClone = matrix.map(x => [...x]);
function buildTempPath(startCoord, endCoord) {
	const [sX, sY] = startCoord;
	const [eX, eY] = endCoord || pickRandomField(matrixClone, freeFieldsIndexes);
	const path = findShortestPath(matrixClone, [sX, sY], [eX, eY]);
	markPath(path, matrixClone);
	matrixClone[eX][eY] = START;
	matrixClone[sX][sY] = PATH;
	matrixClone = matrixClone.map(col => col.map((field) => {
		if (field === VISITED) return FREE;
		return field;
	}));
	return path;
}

const pathOne = buildTempPath(startCoordinate, null);
const pathTwo = buildTempPath(pathOne[pathOne.length - 1], null);
const pathOneTwo = pathOne.concat(pathTwo);
matrixClone = matrixClone.map(col => col.map((field) => {
	if (field === PATH) return FREE;
	return field;
}));
buildTempPath(pathOneTwo[pathOneTwo.length - 1], endCoordinate);

markPath(pathOneTwo, matrixClone);
matrixClone[startX][startY] = PATH;
freeFieldsIndexes = freeFieldsIndexes.map((col, iCol) => (
	col.filter(iRow => matrixClone[iCol][iRow] !== PATH)
));
markBlocks(matrix, freeFieldsIndexes);

const path = findShortestPath(matrix, startCoordinate, endCoordinate);
console.log(path, 'is shortest path');
markPath(path, matrix);
logGrid(matrix);
