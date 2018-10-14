const { startCoordinate, endCoordinate, blocks } = require('./config');
const {
	END, FREE, BLOCK, VISITED, PATH,
} = require('./constants');

const startY = startCoordinate[1];
const [endX, endY] = endCoordinate;

function pickRandomField(grid, freeFieldsIndexes) {
	const indexes = grid.map((v, i) => i);
	const rowIndexes = indexes.filter(i => i !== startY && i !== endY);
	const colIndexes = indexes.filter(
		i => freeFieldsIndexes[i].length === grid[i].length
	);
	const colI = Math.floor(Math.random() * colIndexes.length);
	const rowI = Math.floor(Math.random() * rowIndexes.length);
	const ranCol = colIndexes[colI];
	const ranRow = rowIndexes[rowI];
	freeFieldsIndexes[ranCol].splice(ranRow, 1);
	rowIndexes.splice(rowIndexes.indexOf(ranRow), 1);
	grid[ranCol][ranRow] = END;
	grid[endX][endY] = FREE;
	return [ranCol, ranRow];
}

function typeOfField(field, grid) {
	const [x, y] = field;
	const len = grid.length;
	if (x >= len || x < 0 || y >= len || y < 0) {
		return null;
	}
	if (grid[x][y] === END) {
		return END;
	} if (grid[x][y] === FREE) {
		return FREE;
	}
	return null;
}

function move(field, direction, grid) {
	const predecessor = field;
	let { x, y } = field;
	if (direction === 'up') {
		y += 1;
	} else if (direction === 'down') {
		y -= 1;
	} else if (direction === 'left') {
		x -= 1;
	} else if (direction === 'right') {
		x += 1;
	}
	const type = typeOfField([x, y], grid);
	if (type === FREE) {
		grid[x][y] = VISITED;
	}
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

function markPath(path, grid) {
	path.forEach(([x, y]) => {
		grid[x][y] = PATH;
	});
}

function markBlocks(matrix, freeFieldsIndexes) {
	let emptyCol;
	for (let i = 0; i < matrix.length; i += 1) {
		if (!freeFieldsIndexes[i].length) {
			emptyCol = i;
			break;
		}
	}
	for (let i = 0, x, y; i < blocks; i += 1) {
		x = Math.floor(Math.random() * matrix.length);
		if (x === emptyCol) x = Math.abs(x - 1);
		y = Math.floor(Math.random() * freeFieldsIndexes[x].length);
		matrix[x][freeFieldsIndexes[x][y]] = BLOCK;
		freeFieldsIndexes[x].splice(y, 1);
	}
}

function logGrid(grid) {
	let str = '';
	for (let i = 0; i < grid.length; i += 1) {
		str += '\n';
		for (let j = 0; j < grid.length; j += 1) {
			str += `${grid[j][i] + Array(9 - grid[j][i].length).join(' ')}`;
		}
	}
	console.log(str);
}

module.exports = {
	pickRandomField,
	move,
	typeOfField,
	buildPath,
	markPath,
	markBlocks,
	logGrid,
};
