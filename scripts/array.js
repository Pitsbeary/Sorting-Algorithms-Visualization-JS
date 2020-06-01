"use strict"

let svg = document.getElementById('array-svg');
let unsortedArray = [], sortedArray = [];

let sortingSteps = [];
let currentStepIndex = 0;

let rectSpacing = 2;

function createArrayManual()
{
	let arrayText = document.getElementById('manual-array-input').value;
	
	unsortedArray = arrayText.split(',');
	
	sortedArray = [...unsortedArray];
	sortArray( sortedArray, SortingAlgorithms.BUBBLE );
	currentStepIndex = 0;
	
	drawArray( unsortedArray, null );
}

function createArrayRandom()
{
	let arrayElementCount = document.getElementById( "array-slider-element-count" ).value;
	let arrayMaxValue = document.getElementById( "array-slider-max-value" ).value;
	let arrayMinValue = 1;
	
	unsortedArray = [];
	
	for( let elementIndex = 0; elementIndex < arrayElementCount; ++elementIndex )
	{
		unsortedArray.push( randomInt( arrayMinValue, arrayMaxValue ) );
	}
	
	sortedArray = [...unsortedArray];
	sortArray( sortedArray, SortingAlgorithms.BUBBLE );
	currentStepIndex = 0;
	
	drawArray( unsortedArray, null );
}

function randomInt( min, max ) {
	return min + Math.floor( ( max - min ) * Math.random() );
}

function drawArray( array, step )
{
	clearDrawing();
	
	let availableWidth = svg.clientWidth;
	let availableHeight = svg.clientHeight;
	
	let arraySize = array.length;
	
	let rectWidth = (availableWidth - rectSpacing * (arraySize + 1) ) / arraySize;
	
	let rectHeightMultiplier = availableHeight / Math.max( ...array );
	
	let rectPosX = rectSpacing;
	
	for( let elementIndex = 0; elementIndex < arraySize; ++elementIndex )
	{
		let rectHeight = array[ elementIndex ] * rectHeightMultiplier - rectSpacing;
		let rectPosY = availableHeight - rectHeight;

		let rect = createRect( rectPosX, rectPosY, rectWidth, rectHeight );
		
		if( step === null || !( elementIndex == step.indexA || elementIndex == step.indexB ) )
		{
			rect.setAttributeNS(null, 'fill', "#FFFFFF" );
		}
		else if( elementIndex == step.indexA || elementIndex == step.indexB )
		{
			rect.setAttributeNS(null, 'fill', "#0000FF" );
		}

		
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
	
	
	return resultRect;
}

function clearDrawing()
{
	svg.innerHTML = ""; //IS THIS THE CORRECT WAY
}

function sliderInputArrayMax()
{
	displaySliderValue( "slider-max-info", "Max value:", event.currentTarget.value );
}

function sliderInputArrayCount()
{
	displaySliderValue( "slider-count-info", "Count: ", event.currentTarget.value );
}

function displaySliderValue( pid, desc, value )
{
	document.getElementById( pid ).innerHTML = desc + " " + value;
}

function prev( needsRender )
{	
	if( needsRender )
	{
		drawArray( unsortedArray, sortingSteps[ currentStepIndex ] );
	}
	
	commitStep( unsortedArray, sortingSteps[ currentStepIndex ] );
	
	--currentStepIndex;
}

function next( needsRender )
{	
	if( needsRender )
	{
		drawArray( unsortedArray, sortingSteps[ currentStepIndex ] );
	}
	
	commitStep( unsortedArray, sortingSteps[ currentStepIndex ] );
	
	++currentStepIndex;
}

function first()
{
	for( let stepIndex = currentStepIndex; stepIndex >= 0; stepIndex-- )
	{
		prev( false );
	}
	
	currentStepIndex = 0;
}

function last()
{
	for( let stepIndex = currentStepIndex; stepIndex < sortingSteps.length; stepIndex++ )
	{
		next( false );
	}
	
	currentStepIndex = sortingSteps.length - 1;
}

function play()
{
	
}

function pause()
{
	
}


const SortingAlgorithms = {
    BUBBLE: "Bubble Sort",
    SELECT: "Select Sort",
    INSERT: "Insert Sort"
};

const SortingSteps = {
    COMPARE: "Compare",
    SWAP: "Swap"
};

function sortArray( array, algorithm )
{
	switch( algorithm )
	{
		case SortingAlgorithms.BUBBLE:
			sortBubble( array );
			break;
			
		case SortingAlgorithms.SELECT:
			sortSelect( array );
			break;
			
		case SortingAlgorithms.INSERT:
			sortInsert( array );
			break;
	}
}

function sortBubble( array )
{
	let sorted = false;
	
	while( !sorted )
	{
		sorted = true;
		
		for( let elementIndex = 0; elementIndex < array.length - 1; ++elementIndex )
		{
			if( compareElements( array, elementIndex, elementIndex + 1 ) )
			{
				swapElements( array, elementIndex, elementIndex + 1 );
				sorted = false;
			}
		}
	}
	
}

function compareElements( array, indexA, indexB, shouldRegister = true )
{
	if( shouldRegister )
	{
		registerStep( SortingSteps.COMPARE, indexA, indexB );
	}
	
	return array[ indexA ] > array[ indexB ];
}

function swapElements( array, indexA, indexB, shouldRegister = true )
{
	if( shouldRegister )
	{
		registerStep( SortingSteps.SWAP, indexA, indexB );
	}
	
	let temp = array[ indexA ];
	array[ indexA ] = array[ indexB ];
	array[ indexB ] = temp;
}

function registerStep( type, A, B )
{
	sortingSteps.push( { stepType: type, indexA: A, indexB: B } );
}

function commitStep( array, step )
{
	if( step.stepType == SortingSteps.SWAP )
	{
		swapElements( array, step.indexA, step.indexB, false );
	}
}

function playStep( array, step )
{
	
}

