"use strict"

const SortingAlgorithms = {
	NONE: { name: "None", link: "", desc: "" },
	
    BUBBLE: {	name: "Bubble Sort", 
					link: "https://en.wikipedia.org/wiki/Bubble_sort",
					desc: "Bubble sort, sometimes referred to as sinking sort, is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted"
	},
				
    SELECT: {	name: "Select Sort", 
					link: "https://en.wikipedia.org/wiki/Selection_sort",
					desc: "The algorithm divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items that occupy the rest of the list. Initially, the sorted sublist is empty and the unsorted sublist is the entire input list. The algorithm proceeds by finding the smallest (or largest, depending on sorting order) element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element (putting it in sorted order), and moving the sublist boundaries one element to the right."
	},
	
    INSERT: {	name: "Insert Sort", 
					link: "https://en.wikipedia.org/wiki/Insertion_sort", 
					desc: "Insertion sort iterates, consuming one input element each repetition, and growing a sorted output list. At each iteration, insertion sort removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there. It repeats until no input elements remain." },
	
	MERGE: {	name: "Merge Sort", 
					link: "https://en.wikipedia.org/wiki/Merge_sort",
					desc: "Like QuickSort, Merge Sort is a Divide and Conquer algorithm. It divides input array in two halves, calls itself for the two halves and then merges the two sorted halves." },
	
	QUICK: {	name: "Quick Sort", 
					link: "https://en.wikipedia.org/wiki/Quicksort", 
					desc: "Quicksort is a divide-and-conquer algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively. This can be done in-place, requiring small additional amounts of memory to perform the sorting." }
};

const SortingSteps = {
    COMPARE: 	"Compare",
    SWAP: 		"Swap"
};

let svg = document.getElementById('array-svg');
let currentArray = [], unsortedArray = [], sortedArray = [];

let sortingSteps = [];
let currentStepIndex = 0;

let rectSpacing = 2;

let isPlaying = false;
let playbackIntervalId = null;
let playbackRate = 500;

let arrayAvg = 0;

let algorithm = SortingAlgorithms.NONE

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
	
	updateAlgorithmInfo();
}

function updateAlgorithmInfo()
{
	updateAlgorithmName();
	
	document.getElementById("algorithm-desc").innerHTML = algorithm.desc;
	
	document.getElementById( "algorithm-wiki-link" ).innerHTML = "";
	document.getElementById( "algorithm-wiki-link" ).appendChild( createLink( algorithm.link ) );
}

function createLink( linkText )
{
	let link = document.createElement( "a" );
	
	link.href = linkText;
	link.target = "_blank";

	link.innerHTML = linkText;
	
	return link;
	
}

function updateAlgorithmName()
{
	document.getElementById("algorithm-type").innerHTML = algorithm.name;
	document.getElementById( "algorithm-pick" ).innerHTML = algorithm.name;
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
	
	if( algorithm != SortingAlgorithms.NONE )
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
	
	if( algorithm != SortingAlgorithms.NONE )
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
	hideTooltip();
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
		rect.setAttributeNS(null, 'onmouseout', "hideTooltip()" );
		
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
	updateAlgorithmInfo();
	
	if( unsortedArray.length > 0 )
	{
		if( isPlaying )
		{
			stopPlayback();
		}

		sortArray( algorithm );
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

function sortArray( algorithm )
{	
	sortInit();
	
	showLoadScreen();
	
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
			sortQuick( sortedArray, 0, sortedArray.length - 1 );
			break;
	}
	
	drawArray( unsortedArray, null );
	setTimeout( hideLoadScreen, 1000 );
	setTimeout( updateStaticArrayInfo, 1000 );
	setTimeout( play, 1250 );
	
}

function sortInit()
{
	sortedArray = [...unsortedArray];
	currentArray = [...unsortedArray];
	
	currentStepIndex = 0;
	sortingSteps = [];
}

function showLoadScreen()
{
	document.getElementById("array-load-screen").style.display = "flex";
}

function hideLoadScreen()
{
	document.getElementById("array-load-screen").style.display = "none";
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

function sortQuick( array, left, right )
{
	let pivotIndex, lowerIndex, upperIndex;
	
    if( left < right )
    {
        pivotIndex = left;
        lowerIndex = left;
        upperIndex = right;
		
        while( lowerIndex < upperIndex )
        {
            while( !compareElements( array, lowerIndex, pivotIndex ) && lowerIndex < right)
			{
				 lowerIndex++;
			}
               
            while( compareElements( array, upperIndex, pivotIndex ) )
			{
				 upperIndex--;
			}
               
            if( lowerIndex < upperIndex )
            {
                swapElements( array, lowerIndex, upperIndex );
            }
        }

        swapElements( array, upperIndex, pivotIndex );
		
        sortQuick( array, left, upperIndex - 1 );
        sortQuick( array, upperIndex + 1, right );
		
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