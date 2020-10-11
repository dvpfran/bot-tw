let table = {
	column_width: [],
};

let columns = [];

let data = [];

/*let data = [
	[
		1, 1211364, 17, 'Jony Man'
	],
	[
		2, 119765, 21, 'Camon Brah'
	],
	[
		3, 114819, 17, 'Mike'
	],
	[
		4, 106123, 18, 'Clarke'
	],
	[
		5, 94365, 15, 'Goku',
	]
];*/

function setInfoTable(infoData, infoColumns) {
	columns = infoColumns;
	data = infoData;	
}

function setColumnName() {
	columns = ['Rank', 'Points', 'Wins', 'Name'];
}

function generateColumnsSize() {
	console.log(columns);
	console.log(data);
	for(let indexColumn = 0; indexColumn < columns.length; indexColumn++) {	
		let column_width = columns[indexColumn].length;
		for(let indexData = 0; indexData < data.length; indexData++) {
			if (data[indexData][indexColumn].length > column_width) {
				column_width = data[indexData][indexColumn].length;
			}		
		}
		table.column_width[indexColumn] = column_width + 5;
	}
}

function generateBorder() {
	let border = '';
	for (let indexColumn = 0; indexColumn < columns.length; indexColumn++) {
		for(let indexLengthColumn = 0; indexLengthColumn < table.column_width[indexColumn]; indexLengthColumn++) {
			if (indexLengthColumn == 0) {
				border += '+';
			}
			else {
				border += '-';
			}
		}
	}
	return border + '+\n';
}

function generateRows() {
	let generatedTable  = '';
	for (let indexDataRow = 0; indexDataRow < data.length; indexDataRow++) {
		generatedTable += generateBorder();

		if (indexDataRow == 0) {
			for(let indexColumnName = 0; indexColumnName < columns.length; indexColumnName++) {
				generatedTable += alignCenterWord(columns[indexColumnName], indexColumnName);
			}
			generatedTable += '|\n';
			generatedTable += generateBorder();
		}

		for(let indexDataColumn = 0; indexDataColumn < columns.length; indexDataColumn++) {
			const word = data[indexDataRow][indexDataColumn];
			if (isNaN(word)) {
				generatedTable += alignCenterWord(word, indexDataColumn);
			}
			else {
				generatedTable += alignLeftWord(word, indexDataColumn);
			}
		}

		generatedTable += '|\n';

		if (indexDataRow == data.length - 1) {
			generatedTable += generateBorder();
		}
	}
	return generatedTable;
}

function alignCenterWord(word, indexColumn) {
	const lengthColumn = table.column_width[indexColumn];
	const restColumnSize = lengthColumn - word.length;
	const wordPosition = Math.round(restColumnSize / 2);

	let content = '';
	let index = 0;
	do {
		if (index == 0) {
			content += '|';
		}
		else if (index == wordPosition) {
			content += word;
		}
		else {
			content += ' ';
		}
		index++;
	} while(content.length != lengthColumn);	
	return content;
}

function alignLeftWord(word, indexColumn) {
	const lengthColumn = table.column_width[indexColumn];
	
	let content = '';
	do {
		if (content.length == 0) {
			content += '|';
		}
		else if (content.length == 2) {
			content += word;
		}
		else {
			content += ' ';
		}
	} while (content.length != lengthColumn);
	return content;
}

function generateTable() {
	// setColumnName();
	generateColumnsSize();
	return generateRows();
}

module.exports.setInfoTable = setInfoTable;
module.exports.generateTable = generateTable;
