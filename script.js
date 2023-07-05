var draggableElement = document.querySelectorAll('.draggable');	
var dropArea = document.getElementById('canvas');

//adding event handler for all draggable elements
draggableElement.forEach((draggableElement) => {draggableElement.addEventListener('dragstart', dragStart)});
    
function dragStart(event) {
    const draggedData = generateCppCode(this.textContent.trim());
    event.dataTransfer.setData('text/plain', JSON.stringify(draggedData));
}


//add event listeners for drop functionality
dropArea.addEventListener('drop',drop);
dropArea.addEventListener('dragover',dragOver);
dropArea.addEventListener('dragleave', dragLeave); 
// when element is dropped within the target
function drop(event) {
    // prevent the default behavior for dropped elements
    event.preventDefault();
    dropArea.classList.remove('dragover'); // remove the 'dragover' class

    // retrieve dropped element's data
    var { code, properties } = JSON.parse(event.dataTransfer.getData('text/plain'));

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
    // upon click, add function later that would add the code block to the compiler region

    // create the code text
    const codeText = document.createElement('span');
    codeText.textContent = code;

    // create the properties form
    const propertiesForm = document.createElement('form');
    propertiesForm.className = 'properties-list';

    //create input fields for the properties 
    properties.forEach((property) => 
    {
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.placeholder = property;
        inputField.className = 'property-input'; 
        //append the input field to the properties form 
        propertiesForm.appendChild(inputField);
    });


    // const dimensionInput = document.createElement('select');
    // dimensionInput.className = 'dropdown-input';
    // // dimensionInput.name = 'Dimension';

    // //default placeholder option (not selectable)
    // const placeholderOption = document.createElement('option');
    // placeholderOption.disabled = true;
    // placeholderOption.selected = true;
    // placeholderOption.textContent = 'Dimension'; // placeholder text
    // placeholderOption.className = 'placeholder-option'; // add a CSS class
    // dimensionInput.appendChild(placeholderOption);

    // // populate the dimension dropdown with options
    // const dimensionOptions = ['1D','2D', '3D'];
    // dimensionOptions.forEach(function (option) {
    //     const optionElement = document.createElement('option');
    //     optionElement.value = option;
    //     optionElement.textContent = option;
    //     dimensionInput.appendChild(optionElement);
    // });

    // hide properties form by default
    propertiesForm.style.display = 'none';

    // toggle visibility of properties form for code block
    codeBlock.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevents the event from propagating to the document click event
    propertiesForm.style.display = 'block';
    });

    // hide properties form when clicked anywhere outside the code block or properties form
    document.addEventListener('click', function (event) {
        const target = event.target;
        if (!codeBlock.contains(target) && target !== propertiesForm) {
            propertiesForm.style.display = 'none';
        }
    });


    // append the elements to the code block container
    codeBlock.appendChild(codeText);
    codeBlock.appendChild(propertiesForm);
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
    let properties = [];
  
    switch (menuItem) {
      case 'Variable':
        let variableName = `v${vCounter}`;
        cppCode = `dataType ${variableName}`;
        properties = ['Name', 'Initial Value', 'Data Type', 'Dimension'];
        vCounter += 1;
        break;
  
      case 'for':
        cppCode = `for (int i = 0; i < n; i++) { // loop logic }`;
        properties = ['Initial Value \'i' ,'Condition \'n'];
        break;

    case 'while':
        cppCode = `while (condition) { //loop logic }`;
        properties = ['Condition'];
        break;

    case 'do while':
        cppCode = `do { //loop logic } while (condition);`;
        properties = ['Condition'];
        break;
          
    case 'Function':
        let functionName = `func${functionCounter}`;
        cppCode = `returnType ${functionName}(parameters) { // function implementation }`;
        properties = ['Function Name', 'Return Type'];
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
      cppCode = `type ${arrayName}[size];`;
      properties = ['Name', 'Data Type', 'Size', 'Dimension'];
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
      properties = ['Variable Name'];
      break;
    
    default:
        cppCode = '';
        properties = [];
        break;
    }
  


    return { code: cppCode, properties };
  }
