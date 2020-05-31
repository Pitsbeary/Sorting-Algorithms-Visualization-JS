"use strict"

let svg = document.getElementById('array-svg');
let unsortedArray = [], sortedArray = [];

let rectSpacing = 2;

function createArrayManual()
{
	let arrayText = document.getElementById('manual-array-input').value;
	
	unsortedArray = arrayText.split(',');
	
	drawArray( unsortedArray );
}

function createArrayRandom()
{
	
}

function drawArray( array )
{
	clearDrawing();
	
	let availableWidth = svg.clientWidth;
	let availableHeight = svg.clientHeight;
	
	let arraySize = array.length;
	
	let rectWidth = (availableWidth - rectSpacing * (arraySize + 1) ) / arraySize;
	
	let rectHeightMultiplier = availableHeight / Math.max( ...array );
	
	let rectPosX = rectSpacing;
	
	for( let value of array )
	{
		let rectHeight = value * rectHeightMultiplier - rectSpacing;
		let rectPosY = availableHeight - rectHeight;

		let rect = createRect( rectPosX, rectPosY, rectWidth, rectHeight );
		svg.appendChild( rect );
		
		rectPosX += rectWidth + rectSpacing;
	}
	
}

function createRect( rectPosX, rectPosY, rectWidth, rectHeight )
{
	let resultRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	
	resultRect.setAttributeNS(null, 'x', rectPosX);
    resultRect.setAttributeNS(null, 'y', rectPosY);
	resultRect.setAttributeNS(null, 'width', rectWidth + "px" );
    resultRect.setAttributeNS(null, 'height', rectHeight + "px" );
	resultRect.setAttributeNS(null, 'fill', "#FFFFFF" );
	
	return resultRect;
}

function clearDrawing()
{
	svg.innerHTML = ""; //IS THIS THE CORRECT WAY
}

function prev()
{
	
}

function next()
{
	
}

function first()
{
	
}

function last()
{
	
}

function play()
{
	
}

function pause()
{
	
}