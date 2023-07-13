var draggableElement = document.querySelectorAll('.draggable');	
var dropArea = document.getElementById('canvas');

var editor = ace.edit("codeEditor"); //ace editor instance

ace.require("ace/ext/language_tools");  //enable the language tools extension

//set the initial content
editor.setValue("#include <iostream>\nusing namespace std;\n\nint main() {\n\n\n}");

editor.setOptions({
   showLineNumbers: true, 
   theme: "ace/theme/chrome", 
   mode: "ace/mode/c_cpp",
   fontSize: "16px",
   enableBasicAutocompletion: true,
   enableLiveAutocompletion: true,
   showGutter: true,
   highlightActiveLine: true,
   bracketMatching: true
 });

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
// Create a variable to store the properties of the code block
let currentProperties = {};

// when element is dropped within the target
function drop(event) {
  // prevent the default behavior for dropped elements
  event.preventDefault();
  dropArea.classList.remove('dragover'); // remove the 'dragover' class

  // retrieve dropped element's data
  var { code, properties } = JSON.parse(event.dataTransfer.getData('text/plain'));

  // Store the properties in the currentProperties variable
  currentProperties = properties;

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
  plusSign.addEventListener('click', function () {
    // updateCodeEditor(code, currentProperties);

  });

  // create the code text
  const codeText = document.createElement('span');
  codeText.textContent = code;

  // create the properties form
  const propertiesForm = document.createElement('form');
  propertiesForm.className = 'properties-list';

  // create input fields for the properties
  properties.forEach((property) => {
    let inputField;

    if (property === 'Data Type' || property === 'Return Type' || property === 'Dimension') {
      //select input for specific properties
      inputField = document.createElement('select');
      inputField.className = 'dropdown-input';

      //add default placeholder option (not selectable)
      const placeholderOption = document.createElement('option');
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      placeholderOption.textContent = property;
      placeholderOption.className = 'placeholder-option';
      inputField.appendChild(placeholderOption);

      //adding options based on property type
      if (property === 'Data Type') {
        ['int', 'float', 'bool', 'char', 'string'].forEach((option) => {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          inputField.appendChild(optionElement);
        });
      } else if (property === 'Return Type') {
        ['void', 'int'].forEach((option) => {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          inputField.appendChild(optionElement);
        });
      } else if (property === 'Dimension') {
        const dimensionOptions = ['1D', '2D', '3D'];
        dimensionOptions.forEach(function (option) {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          inputField.appendChild(optionElement);
        });
      }
    } else {
      //text input for other properties
      inputField = document.createElement('input');
      inputField.type = 'text';
      inputField.placeholder = property;
      inputField.className = 'property-input';
    }

    propertiesForm.appendChild(inputField);
  });

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

    // case 'switch':
    //   cppCode = 'switch (expression) {\n\tcase value1:\n\t\t// code block\n\t\tbreak;\n\tcase value2:\n\t\t// code block\n\t\tbreak;\n\tdefault:\n\t\t// code block\n\t\tbreak;\n}';
    //   break;

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

  // function updateCodeEditor(code, properties) {
  //   let updatedCode = code;
  
  //   // Iterate over the properties and update the code accordingly
  //   properties.forEach((property) => {
  //     // Retrieve the value of the property from the corresponding input field
  //     const inputField = propertiesForm.querySelector(`[placeholder="${property}"]`);
  //     const propertyValue = inputField.value;
  
  //     // Replace the placeholder in the code with the actual value
  //     updatedCode = updatedCode.replace(property, propertyValue);
  //   });
  
  //   // Concatenate the updated code from all code blocks
  //   const codeBlocks = document.querySelectorAll('.code-block');
  //   let finalCode = '';
    
  //   codeBlocks.forEach((codeBlock) => {
  //     finalCode += codeBlock.querySelector('span').textContent + '\n';
  //   });
  
  //   // Replace the original code with the updated code
  //   finalCode = finalCode.replace(code, updatedCode);
  
  //   // Update CodeMirror editor content
  //   editor.setValue(finalCode);
  // }
  