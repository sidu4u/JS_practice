let  webworkerSort,createInputArray, insertionSort,pushElement,printArray,addShiftElementsToQueue,isSortFinished ; 

onmessage = function(e){
    if(e.data.start){
        webworkerSort = WebworkerSort();
        createInputArray=webworkerSort.createInputArray;
        insertionSort = webworkerSort.insertionSort;
        pushElement = webworkerSort.pushElement;
        isSortFinished = webworkerSort.isSortFinished;
        addShiftElementsToQueue = webworkerSort.addShiftElementsToQueue;
        printArray = webworkerSort.printArray;
        createInputArray(e.data.input);
        insertionSort();
    }
    else{

        pushElement(e.data);
        if(!isSortFinished()){
          addShiftElementsToQueue(0);
        }
        postMessage({value:e.data,isFinished:false});
    }
}

function WebworkerSort() {
    let sortFinished =false;
    let sortPosition=1;
    let inputArray;
    let sortedElementCount = 0;
    function createInputArray(input) {
  
      if (input) {
        inputArray = input;
        return;
      }
  
      for (i = 0; i < 100000000; i++) {
        input.push(Math.random());
      }
  
      inputArray = input;
    }

    function isSortFinished(){
      return sortFinished;
    }

    function addShiftElementsToQueue(timeout){
      const shiftPosition = sortPosition - 1;
      callback = (shiftPosition)=>()=>shiftElements(shiftPosition);
      setTimeout(callback(shiftPosition),timeout);
      sortPosition++;
    }
  
    function insertionSort() {
      
      while (sortPosition < inputArray.length) {
        addShiftElementsToQueue(0);
      }
    }
  
    function shiftElements(shiftPosition) {
      sortedElementCount++;
      while (shiftPosition>-1 && inputArray[shiftPosition] > inputArray[shiftPosition+1] ) {
        const temp = inputArray[shiftPosition];  
        inputArray[shiftPosition] = inputArray[shiftPosition+1];
        inputArray[shiftPosition+1] = temp;
        shiftPosition--;
      } 
      if(sortedElementCount===inputArray.length-1){
        sortFinished = true;
        //printArray();
        postMessage({isFinished:true,value:inputArray});
      }
    }
  
    function pushElement(element){
        inputArray.push(element);
    }

    function printArray() {
      inputArray && console.log(inputArray);
    }
  
    return {
      createInputArray,
      isSortFinished,
      addShiftElementsToQueue,
      insertionSort,
      printArray,
      pushElement
    };
  }
  
 
  