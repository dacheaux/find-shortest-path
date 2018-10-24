const { startCoordinate, endCoordinate, blocks } = require('./config');
const {
	START, END, FREE, BLOCK, UP, DOWN, LEFT, RIGHT,
} = require('./constants');

function genMatrix(startCoord, endCoord) {
	const matrix = [];
	const [sX, sY] = startCoord;
	const [eX, eY] = endCoord;
	for (let i = 0; i < 10; i += 1) {
		matrix[i] = [];
		for (let j = 0; j < 10; j += 1) {
			matrix[i][j] = FREE;
		}
	}
	matrix[sX][sY] = START;
	matrix[eX][eY] = END;
	return matrix;
}

function logMatrix(matrix) {
	let str = '';
	for (let i = 0; i < matrix.length; i += 1) {
		str += '\n';
		for (let j = 0; j < matrix.length; j += 1) {
			str += `${matrix[j][i] + Array(9 - matrix[j][i].length).join(' ')}`;
		}
	}
	return str;
}

function typeOfField(field, matrix) {
	const [x, y] = field;
	const len = matrix.length;
	if (x >= len || x < 0 || y >= len || y < 0) {
		return null;
	}
	if (matrix[x][y] === END) {
		return END;
	} if (matrix[x][y] === FREE) {
		return FREE;
	}
	return null;
}

function move(matrix, field, direction) {
	const predecessor = field;
	let { x, y } = field;
	if (direction === UP) {
		y += 1;
	} else if (direction === DOWN) {
		y -= 1;
	} else if (direction === LEFT) {
		x -= 1;
	} else if (direction === RIGHT) {
		x += 1;
	}
	const type = typeOfField([x, y], matrix);
	return {
		x,
		y,
		type,
		predecessor,
	};
}

function buildPath(endField) {
	const path = [];
	let field = endField;
	while (field.predecessor) {
		const { x, y } = field;
		path.push([x, y]);
		field = field.predecessor;
	}
	return path.reverse();
}


function findShortestPath(matrix, startCoord) {
	const [sX, sY] = startCoord;
	const startField = {
		x: sX,
		y: sY,
		predecessor: null,
		type: START,
	};
	const queue = [startField];
	const directions = [UP, DOWN, LEFT, RIGHT];
	const dirlen = directions.length;
	const visited = [];
	for (let i = 0; i < 10; i += 1) {
		visited.push([]);
	}
	let shortestPath = null;

	while (queue.length) {
		const current = queue.shift();
		for (let i = 0; i < dirlen; i += 1) {
			const field = move(matrix, current, directions[i]);
			if (field.type === END) {
				shortestPath = buildPath(field);
				return shortestPath;
			}
			if (field.type === FREE) {
				const { x, y } = field;
				if (!visited[x][y]) {
					visited[x][y] = true;
					queue.push(field);
				}
			}
		}
	}
	return shortestPath;
}

function genBlocks(startCoord, endCoord, numBlocks) {
	const matrix = genMatrix(startCoord, endCoord);
	const matrixIndexes = matrix.map(v => v.map((val, i) => i));
	const freeFieldsIndexes = matrixIndexes.map((col, iCol) => (
		col.filter(iRow => matrix[iCol][iRow] === FREE)
	));
	let row;
	let indexInRow;
	for (let i = 0, x, y; i < numBlocks; i += 1) {
		x = Math.floor(Math.random() * matrix.length);
		row = freeFieldsIndexes[x];
		indexInRow = Math.floor(Math.random() * row.length);
		y = row[indexInRow];
		matrix[x][y] = BLOCK;
		const path = findShortestPath(matrix, startCoord);
		if (!path) {
			matrix[x][y] = FREE;
			i -= 1;
		}
		row.splice(indexInRow, 1);
	}
	return matrix;
}

const matrix = genBlocks(startCoordinate, endCoordinate, blocks);
const shortestPath = findShortestPath(matrix, startCoordinate);
console.log(shortestPath, 'is shortest path');
console.log(logMatrix(matrix));
