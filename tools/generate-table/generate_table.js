let table = {
	column_width: [],
};

let columns = [];
let data = [];

function setInfoTable(infoData, infoColumns) {
	columns = infoColumns;
	data = infoData;	
}

function generateColumnsSize() {
//	try {
		for(let indexColumn = 0; indexColumn < columns.length; indexColumn++) {	
			let column_width = columns[indexColumn].length;
			for(let indexData = 0; indexData < data.length; indexData++) {
				if (data[indexData][indexColumn].length > column_width) {
					column_width = data[indexData][indexColumn].length;
				}		
			}
			table.column_width[indexColumn] = column_width + 5;
		}
/*	}
	catch(error) {
		console.log('ERROR:', error);
	}*/
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
	// splitedTable because the max chars === 2000
	let splitedTable = [];
	let generatedTable  = '';
	
	const total_column_width = table.column_width.reduce((accumulator, currentValue) => accumulator + currentValue);

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
			splitedTable.push(generatedTable);
		}		
		else if (total_column_width + generatedTable.length >= 1800) {
			splitedTable.push(generatedTable);
			generatedTable = '';
		}
	}
	return splitedTable;
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
	let table = undefined;
	try {
		generateColumnsSize();
		table = generateRows();
	}
	catch(error) {
		console.log('[ERROR]', error);
		table = undefined;
	}
	console.log(table);
	return table;
}

module.exports.setInfoTable = setInfoTable;
module.exports.generateTable = generateTable;
