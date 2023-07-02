var draggableElement = document.querySelectorAll('.draggable');	
var dropArea = document.getElementById('canvas');

//adding event handler for all draggable elements
draggableElement.forEach((draggableElement) => {draggableElement.addEventListener('dragstart', dragStart)});
    
//defining dragStart event handler
function dragStart(event)
{
    const draggedData = generateCppCode(this.textContent); //using the dragged element's text content instead of assigning IDs
    event.dataTransfer.setData('text/plain', draggedData) //generated cpp code is set as data to be transferred 
}

//add event listeners for drop functionality
dropArea.addEventListener('drop',drop);
dropArea.addEventListener('dragover',dragOver);
dropArea.addEventListener('dragleave', dragLeave); 

//when element is dropped within the target
function drop(event) 
{
    //prevent the default behaviour for dropped elements
    event.preventDefault();
    dropArea.classList.remove('dragover'); //remove the 'dragover' class
    //retrieve dropped element's data
    var droppedData = event.dataTransfer.getData('text/plain');
    
    // create the code block container
    const codeBlock = document.createElement('div');
    codeBlock.className = 'code-block';

    // create the delete icon
    const deleteIcon = document.createElement('span');
    deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteIcon.className = 'delete-icon';
    deleteIcon.addEventListener('click', function () {
        codeBlock.remove();
    });

    // create the plus sign
    const plusSign = document.createElement('span');
    plusSign.innerHTML = '&#43;'; // Unicode for plus symbol
    plusSign.className = 'plus-sign';
    //upon click add function later that would add the code block to compiler region

    // create the code text
    const codeText = document.createElement('span');
    codeText.textContent = droppedData;

    //create the properties dropdown
    const propertiesList = document.createElement('ul');
    propertiesList.className = 'properties-list';

    //create list items for the properties
    const nameItem = document.createElement('li');
    nameItem.textContent = 'Name';
    nameItem.className = 'property-item';

    const initialValueItem = document.createElement('li');
    initialValueItem.textContent = 'Initial Value';
    initialValueItem.className = 'property-item';

    const dataTypeItem = document.createElement('li');
    dataTypeItem.textContent = 'Data Type';
    dataTypeItem.className = 'property-item';

    const dimensionItem = document.createElement('li');
    dimensionItem.textContent = 'Dimension';
    dimensionItem.className = 'property-item';
    

    //hide properties list by default
    propertiesList.style.display = 'none';

    //toggle visibility of properties list for code block
    codeBlock.addEventListener('click',function()
    {
        propertiesList.style.display=propertiesList.style.display === 'none' ? 'block' : 'none';
    }); 

    //append list items to proprties list
    propertiesList.appendChild(nameItem);
    propertiesList.appendChild(initialValueItem);
    propertiesList.appendChild(dataTypeItem);
    propertiesList.appendChild(dimensionItem);

    // append the elements to the code block container
    codeBlock.appendChild(codeText);
    codeBlock.appendChild(propertiesList);
    codeBlock.appendChild(deleteIcon);
    codeBlock.appendChild(plusSign);
    

    // append the code block to the drop target
    dropArea.appendChild(codeBlock);

}
 
//when the element is being dragged within the boundary of the drop target
function dragOver(event)
{
    event.preventDefault();
    dropArea.classList.add('dragover')
}

//when the element is dragged away from the drop target
function dragLeave(event) 
{
    dropArea.classList.remove('dragover'); //remove the 'dragover' class
}

let vCounter = 1;
let functionCounter = 1;
let arrayCounter = 1;
function generateCppCode(menuItem) {
  let cppCode = '';

  switch (menuItem) {
    case 'int':
    case 'float':
    case 'bool':
    case 'char':
    case 'string':

        let variableName = `v${vCounter}`; //string interpolation to embed variables to create strings
        cppCode = `${menuItem} ${variableName}`
        //update the counter for the variable name
        vCounter += 1;

        break;

    case 'for':
        cppCode = `for (int i = 0; i < n; i++) { //loop logic }`;
        break;

    case 'while':
        cppCode = `while (condition) { //loop logic }`;
        break;

    case 'do while':
        cppCode = `do { //loop logic } while (condition);`;
        break;

    case 'Function':
        let functionName = `func${functionCounter}`;
        cppCode = `returnType ${functionName}(parameters) { // function implementation }`; // replace "returnType" and "parameters" with actual values
        functionCounter += 1;
        break;

    //arithmetic operators
    case '+':
    case '-':
    case 'x':
    case '/':
    case '%':
    case '++':
    case '--':    
    //relational operators
    case '==':
    case '!=':
    case '>':
    case '<':
    case '>=':
    case '<=':
    //logical operators
    case '&&':
    case '||':
    case '!':
    case '<':
    case '>=':
    case '<=':
    //miscellaneous operators
    case '=':
    case '&':
    case '.':
    case '->':
    case '<<':
    case '>>':
    case '*':
        cppCode = `${menuItem}`;
        break;

    case 'if':
      cppCode = 'if (condition) {\n\t// code block\n}';
      break;

    case 'else if':
      cppCode = 'else if (condition) {\n\t// code block\n}';
      break;

    case 'else':
      cppCode = 'else {\n\t// code block\n}';
      break;

    case 'switch':
      cppCode = 'switch (expression) {\n\tcase value1:\n\t\t// code block\n\t\tbreak;\n\tcase value2:\n\t\t// code block\n\t\tbreak;\n\tdefault:\n\t\t// code block\n\t\tbreak;\n}';
      break;

    case 'break':
      cppCode = 'break;';
      break;

    case 'continue':
      cppCode = 'continue;';
      break;

    case 'Array':
        let arrayName = `arr${arrayCounter}`;
        cppCode = `type ${arrayName}[size];`; // replace "type" with the actual array data type
        arrayCounter += 1;
        break;
    
    case 'cout':
        cppCode = 'cout';
        break;

    case 'cin':
        cppCode = 'cin';
        break;

    case 'getline':
        cppCode = 'getline(cin, variableName);';
        break;    

    // Add more cases for other menu items

    default:
      cppCode = ''; //if the menuItem doesn't match any case, cppCode remains an empty string
      break;
  }

  return cppCode;
}
