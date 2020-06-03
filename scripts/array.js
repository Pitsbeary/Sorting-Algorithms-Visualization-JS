"use strict"

let svg = document.getElementById('array-svg');
let currentArray = [], unsortedArray = [], sortedArray = [];

let sortingSteps = [];
let currentStepIndex = 0;

let rectSpacing = 2;

let isPlaying = false;
let playbackIntervalId = null;
let playbackRate = 500;

function init()
{
	let slider = document.getElementById( "array-slider-max-value" );
	displaySliderValue( "slider-max-info", "Max value:", slider.value );
	
	slider = document.getElementById( "array-slider-element-count" );
	displaySliderValue( "slider-count-info", "Count: ", slider.value );
	
	playbackRate = 1000 - document.getElementById( "playback-speed-slider" ).value;
	
	updateArrayInfo();
}

function updateArrayInfo()
{
	document.getElementById("elements-count").innerHTML = unsortedArray.length;
	document.getElementById("steps-count").innerHTML = sortingSteps.length;
	document.getElementById("current-step").innerHTML = currentStepIndex;
}

function createArrayManual()
{
	let arrayText = document.getElementById('manual-array-input').value;
	
	unsortedArray = arrayText.split(',');
	
	sortedArray = [...unsortedArray];
	sortArray( sortedArray, SortingAlgorithms.BUBBLE );
	currentStepIndex = 0;
	
	currentArray = [...unsortedArray];
	drawArray( currentArray, null );
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
	
	currentArray = [...unsortedArray];
	drawArray( currentArray, null );
}

function randomInt( min, max ) {
	return min + Math.floor( ( max - min ) * Math.random() );
}

function initSorting()
{
	sortingSteps = [];
	currentStepIndex = 0;
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
			rect.setAttributeNS(null, 'class', 'array-element default' );
		}
		else if( elementIndex == step.indexA || elementIndex == step.indexB )
		{
			switch( step.stepType )
			{
				case SortingSteps.COMPARE:
					rect.setAttributeNS(null, 'class', 'array-element compared' );
				break;
				
				case SortingSteps.SWAP:
					rect.setAttributeNS(null, 'class', 'array-element swapped' );
				break;
			}
			
		}

		
		svg.appendChild( rect );
		
		rectPosX += rectWidth + rectSpacing;
	}
	
	updateArrayInfo();
	
}

function createRect( rectPosX, rectPosY, rectWidth, rectHeight )
{
	let resultRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	
	resultRect.setAttributeNS(null, 'x', rectPosX);
    resultRect.setAttributeNS(null, 'y', rectPosY);
	resultRect.setAttributeNS(null, 'width', rectWidth + "px" );
    resultRect.setAttributeNS(null, 'height', rectHeight + "px" );
	resultRect.setAttributeNS(null, 'class', "array-element" );
	
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

function sliderInputPlaybackSpeed()
{
	playbackRate = 1000 - event.currentTarget.value;
	
	if( isPlaying )
	{
		clearInterval( playbackIntervalId );
		playbackIntervalId = setInterval( playback, playbackRate );
	}
}

function displaySliderValue( pid, desc, value )
{
	document.getElementById( pid ).innerHTML = desc + " " + value;
}

function prev()
{	
	if( currentStepIndex < 0 )
	{
		return;
	}
	
	if( currentStepIndex >= sortingSteps.length )
	{
		currentStepIndex = sortingSteps.length - 1;
	}
	
	drawArray( currentArray, sortingSteps[ currentStepIndex ] );
	goPrev();
}

function goPrev()
{
	if( currentStepIndex >= 0 )
	{
		commitStep( currentArray, sortingSteps[ currentStepIndex ] );
		--currentStepIndex;
	}
}

function next()
{	
	if( currentStepIndex >= sortingSteps.length )
	{
		return;
	}
	
	if( currentStepIndex < 0 )
	{
		currentStepIndex = 0;
	}
	
	drawArray( currentArray, sortingSteps[ currentStepIndex ] );
	goNext();
	
}

function goNext()
{
	if( currentStepIndex < sortingSteps.length )
	{
		commitStep( currentArray, sortingSteps[ currentStepIndex ] );
		++currentStepIndex;
	}
}

function first()
{
	currentArray = [...unsortedArray];
	currentStepIndex = 0;
	
	drawArray( currentArray, sortingSteps[ currentStepIndex ] );
}

function last()
{
	currentArray = [...sortedArray];
	currentStepIndex = sortingSteps.length - 1;
	
	drawArray( currentArray, sortingSteps[ currentStepIndex ] );
}

function play()
{
	if( currentStepIndex < 0 )
	{
		currentStepIndex = 0;
	}
	
	if( currentStepIndex >= sortingSteps.length )
	{
		currentStepIndex = sortingSteps.length - 1;
	}
		
	if( !isPlaying )
	{
		startPlayback();
	}
	else
	{		
		stopPlayback();
	}
}

function startPlayback()
{
	playbackIntervalId = setInterval( playback, playbackRate );
	
	let playButton = document.querySelector("#nav-play .shape.arrow-left");
	playButton.className = "shape rect";
		
	isPlaying = true;
}

function stopPlayback()
{
	clearInterval( playbackIntervalId );
	
	let playButton = document.querySelector("#nav-play .shape.rect");
	playButton.className = "shape arrow-left";
	
	isPlaying = false;
}

function playback()
{
	drawArray( currentArray, sortingSteps[ currentStepIndex ] );
	
	if( currentStepIndex >= sortingSteps.length - 1 )
	{
		stopPlayback();
		return;
	}
	
	goNext();
}

const SortingAlgorithms = {
    BUBBLE: "Bubble Sort",
    SELECT: "Select Sort",
    INSERT: "Insert Sort"
};

const SortingSteps = {
    COMPARE: 	"Compare",
    SWAP: 		"Swap"
};

function sortArray( array, algorithm )
{
	initSorting();
	
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

function isSorted( array )
{
	if( array.length != sortedArray.length )
	{
		return false;
	}
	
	for( let elementIndex = 0; elementIndex < array.length; ++elementIndex )
	{
		if( array[ elementIndex ] != sortedArray[ elementIndex ] )
		{
			return false;
		}
	}
	
	return true;
}