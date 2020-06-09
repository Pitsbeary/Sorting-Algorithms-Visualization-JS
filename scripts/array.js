"use strict"

let svg = document.getElementById('array-svg');
let currentArray = [], unsortedArray = [], sortedArray = [];

let sortingSteps = [];
let currentStepIndex = 0;

let rectSpacing = 2;

let isPlaying = false;
let playbackIntervalId = null;
let playbackRate = 500;

let arrayAvg = 0;

let algorithm = null;

window.onresize = onWindowResize;

function onWindowResize()
{
	if( currentArray.length > 0 )
	{
		drawArray( currentArray, sortingSteps.length > 0 ? sortingSteps[ currentStepIndex ] : null );
	}
}

function init()
{
	let slider = document.getElementById( "array-slider-max-value" );
	displaySliderValue( "slider-max-info", "Max value:", slider.value );
	
	slider = document.getElementById( "array-slider-element-count" );
	displaySliderValue( "slider-count-info", "Count: ", slider.value );
	
	playbackRate = 1000 - document.getElementById( "playback-speed-slider" ).value;
	
	updateStaticArrayInfo();
	updateDynamicArrayInfo();
}

function updateStaticArrayInfo()
{
	document.getElementById("elements-count").innerHTML = unsortedArray.length;
	document.getElementById("steps-count").innerHTML = sortingSteps.length;
	
	document.getElementById("array-max").innerHTML = getMax( unsortedArray );
	document.getElementById("array-min").innerHTML = getMin( unsortedArray );
	document.getElementById("array-avg").innerHTML = Math.round( avg( unsortedArray ) );
	
	document.getElementById("swaps-count").innerHTML = countSteps( sortingSteps, SortingSteps.SWAP );
	document.getElementById("comp-count").innerHTML = countSteps( sortingSteps, SortingSteps.COMPARE );
}

function getMax( array )
{
	let max = array[ 0 ];
	
	for( let value of array )
	{
		if( value > max )
		{
			max = value;
		}
	}
	
	return max;
}

function getMin( array )
{
	let min = array[ 0 ];
	
	for( let value of array )
	{
		if( value < min )
		{
			min = value;
		}
	}
	
	return min;
}

function updateDynamicArrayInfo()
{
	if( sortingSteps.length == 0 )
	{
		document.getElementById("current-step").innerHTML = 0;
		return;
	}
	
	document.getElementById("current-step").innerHTML = currentStepIndex + 1;
	document.getElementById("current-step-type").innerHTML = sortingSteps[ currentStepIndex ].stepType;
	document.getElementById("current-step-indexes").innerHTML = sortingSteps[ currentStepIndex ].indexA + "[" + currentArray[ sortingSteps[ currentStepIndex ].indexA ] + "] with " + sortingSteps[ currentStepIndex ].indexB  + "[" + currentArray[ sortingSteps[ currentStepIndex ].indexB ] + "]";
}

function createArrayManual()
{
	if( isPlaying )
	{
		stopPlayback();
	}
	
	let arrayText = document.getElementById('manual-array-input').value;
	
	unsortedArray = arrayText.split(',').map( Number );
	currentArray = [...unsortedArray];
	
	if( algorithm != null )
	{
		sortArray( algorithm );
	}
	
	updateStaticArrayInfo();
	drawArray( unsortedArray, null );
}

function createArrayRandom()
{
	if( isPlaying )
	{
		stopPlayback();
	}
	
	let arrayElementCount =  Number( document.getElementById( "array-slider-element-count" ).value );
	let arrayMaxValue = Number( document.getElementById( "array-slider-max-value" ).value );

	let arrayMinValue = 1;
	
	unsortedArray = [];
	
	for( let elementIndex = 0; elementIndex < arrayElementCount; ++elementIndex )
	{
		unsortedArray.push( randomInt( arrayMinValue, arrayMaxValue + 1 ) );
	}
	
	currentArray = [...unsortedArray];
	
	if( algorithm != null )
	{
		sortArray( algorithm );
	}
	
	updateStaticArrayInfo();
	drawArray( unsortedArray, null );
}

function avg( array )
{
	let sum = 0;
	
	for( let value of array )
	{
		sum += value;
	}

	return sum / array.length;
}

function countSteps( stepsArray, stepType )
{
	let sum = 0;
	
	for( let step of stepsArray )
	{
		if( step.stepType == stepType )
		{
			++sum;
		}
	}

	return sum;
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
		
		rect.setAttributeNS(null, 'value', array[ elementIndex ] );
		rect.setAttributeNS(null, 'onmousemove', "showTooltip(evt)" );
		rect.setAttributeNS(null, 'onmouseout', "hideTooltip(evt)" );
		
		svg.appendChild( rect );
		
		rectPosX += rectWidth + rectSpacing;
	}
	
	updateDynamicArrayInfo();
	
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

function showTooltip(evt, text) 
{
	let tooltip = document.getElementById("array-tooltip");
	tooltip.innerHTML = event.currentTarget.getAttributeNS( null, "value" );
	
	tooltip.style.display = "block";

	tooltip.style.left = event.pageX + 15 - document.documentElement.scrollLeft + 'px';
	tooltip.style.top = event.pageY + 15 - document.documentElement.scrollTop + 'px';
}

function hideTooltip() 
{
  var tooltip = document.getElementById("array-tooltip");
  tooltip.style.display = "none";
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

function pickAlgorithm( alg )
{
	algorithm = alg;
	document.getElementById( "algorithm-pick" ).innerHTML = algorithm;
	
	if( unsortedArray.length > 0 )
	{
		if( isPlaying )
		{
			stopPlayback();
		}

		sortArray( algorithm );		
		drawArray( unsortedArray, null );
		
		updateStaticArrayInfo();
	}
}

function displaySliderValue( pid, desc, value )
{
	document.getElementById( pid ).innerHTML = desc + " " + value;
}

function prev()
{	
	if( currentStepIndex <= 0 )
	{
		return;
	}
	
	if( currentStepIndex >= sortingSteps.length )
	{
		last();
	}
	
	drawArray( currentArray, sortingSteps[ currentStepIndex ] );
	goPrev();
}

function goPrev()
{
	if( currentStepIndex == 0 )
	{
		return;
	}
	
	--currentStepIndex;
	commitStep( currentArray, sortingSteps[ currentStepIndex ] );
}

function next()
{	
	if( currentStepIndex >= sortingSteps.length - 1 )
	{
		return;
	}
	
	if( currentStepIndex < 0 )
	{
		first();
	}
	
	drawArray( currentArray, sortingSteps[ currentStepIndex ] );
	goNext();
}

function goNext()
{
	if( currentStepIndex == sortingSteps.length - 1 )
	{
		return;
	}
	
	++currentStepIndex;
	commitStep( currentArray, sortingSteps[ currentStepIndex ] );
}

function first()
{
	if( unsortedArray.length == 0 )
	{
		return;
	}
	
	currentArray = [...unsortedArray];
	currentStepIndex = 0;
	
	drawArray( currentArray, sortingSteps[ currentStepIndex ] );
}

function last()
{
	if( sortedArray.length == 0 )
	{
		return;
	}
	
	currentArray = [...sortedArray];
	currentStepIndex = sortingSteps.length - 1;
	
	drawArray( currentArray, sortingSteps[ currentStepIndex ] );
}

function play()
{
	if( sortingSteps.length == 0 )
	{
		return;
	}
	
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
	
	if( currentStepIndex == sortingSteps.length - 1 )
	{
		stopPlayback();
		return;
	}
	
	goNext();
}

const SortingAlgorithms = {
    BUBBLE: "Bubble Sort",
    SELECT: "Select Sort",
    INSERT: "Insert Sort",
	MERGE: "Merge Sort",
	QUICK: "Quick Sort"
};

const SortingSteps = {
    COMPARE: 	"Compare",
    SWAP: 		"Swap"
};

function sortArray( algorithm )
{	
	sortInit();
	
	switch( algorithm )
	{
		case SortingAlgorithms.BUBBLE:
			sortBubble( sortedArray );
			break;
			
		case SortingAlgorithms.SELECT:
			sortSelect( sortedArray );
			break;
			
		case SortingAlgorithms.INSERT:
			sortInsert( sortedArray );
			break;
			
		case SortingAlgorithms.MERGE:
			sortMerge( sortedArray, 0, sortedArray.length - 1 );
			break;
			
		case SortingAlgorithms.QUICK:
		
			break;
	}
}

function sortInit()
{
	sortedArray = [...unsortedArray];
	currentArray = [...unsortedArray];
	
	currentStepIndex = 0;
	sortingSteps = [];
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

function sortSelect( array )
{
	for( let sortIndex = 0; sortIndex < array.length - 1; ++sortIndex )
	{
		let minIndex = sortIndex;
		
		for( let elementIndex = sortIndex + 1; elementIndex < array.length; ++elementIndex )
		{
			if( compareElements( array, minIndex, elementIndex ) )
			{
				minIndex = elementIndex;
			}
		}
		
		if( minIndex != sortIndex )
		{
			swapElements( array, sortIndex, minIndex );
		}
	}
}

function sortInsert( array )
{
	for( let sortIndex = 0; sortIndex < array.length - 1; ++sortIndex )
	{
		let elementIndex = sortIndex + 1;
		
		while( compareElements( array, elementIndex - 1, elementIndex ) )
		{
			swapElements( array, elementIndex - 1, elementIndex );
			
			elementIndex--;
			
			if( elementIndex == 0 )
			{
				break;
			}
		}
	}
}

function sortMerge( array, left, right )
{
	
	if ( left < right )
	{ 
        let middle = left + Math.floor( ( right - left ) / 2 ); 

        sortMerge( array, left, middle ); 
        sortMerge( array, middle + 1, right ); 
  
        merge( array, left, middle, right ); 
    } 
}

function merge( array, start, middle, end ) 
{
	let index1 = start;
	let index2 = middle + 1;
	
	if( !compareElements( array, middle, index2 ) )
	{
		return;
	}
	
	while( index1 <= middle && index2 <= end )
	{
		if( !compareElements( array, index1, index2 ) )
		{
			++index1;	
		}
		else
		{
			let index = index2;
			
			while( index != index1 )
			{
				swapElements( array, index, index - 1 );
				index--;
			}
					
            index1++;
			middle++;
			index2++;
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