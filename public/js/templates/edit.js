// Data of questions and welcome block
const blockData = {
  welcome: {
    opening: '',
    details: '',
    image: ''
  }
};
let template; // The Project object taken from the pug file

// String names for types
const typeNames = {
  'yes_no': 'Yes/No',
  'multiple_choice': 'Multiple Choice',
  'opinion_scale': 'Opinion Scale',
  'open_answer': 'Open Answer',
  'single': 'Single Select',
  'multiple': 'Multiple Select'
};

let currentlyClickedBlock = 'welcome'; // Id or keyword of currently selected block

// Create the content of the preview page
function createPreviewPageContent () {
  const previewContent = document.querySelector('.block-preview-content');
  previewContent.innerHTML = "";
  const block = blockData[currentlyClickedBlock];

  const text = document.createElement('span');
  text.classList.add('block-preview-question-text');
  text.innerHTML = currentlyClickedBlock == 'welcome' ? block.opening : block.text;
  previewContent.appendChild(text);

  const notes = document.createElement('span');
  notes.classList.add('block-preview-question-notes');
  notes.innerHTML = block.details;
  previewContent.appendChild(notes);

  if (block.image) {
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('block-preview-image-wrapper');
    const image = document.createElement('img');
    image.classList.add('block-preview-image');
    image.src = block.image;
    image.alt = 'usersmagic preview';
    imageWrapper.appendChild(image);
    previewContent.appendChild(imageWrapper);
  }

  if (currentlyClickedBlock == 'welcome') return;

  if (block.type == 'yes_no') {
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.classList.add('block-preview-yesno-buttons-wrapper');

    const noButton = document.createElement('block-preview-no-button');
    noButton.classList.add('block-preview-no-button');
    const noI = document.createElement('i');
    noI.classList.add('fas');
    noI.classList.add('fa-times');
    noButton.appendChild(noI);
    const noText = document.createElement('span');
    noText.innerHTML = 'NO';
    noButton.appendChild(noText);
    buttonsWrapper.appendChild(noButton);

    const yesButton = document.createElement('block-preview-yes-button');
    yesButton.classList.add('block-preview-yes-button');
    const yesI = document.createElement('i');
    yesI.classList.add('fas');
    yesI.classList.add('fa-check');
    yesButton.appendChild(yesI);
    const yesText = document.createElement('span');
    yesText.innerHTML = 'YES';
    yesButton.appendChild(yesText);
    buttonsWrapper.appendChild(yesButton);

    previewContent.appendChild(buttonsWrapper);
  } else if (block.type == 'multiple_choice') {
    for (let i = 0; i < block.choices.length; i++) {
      const newChoiceWrapper = document.createElement('div');
      newChoiceWrapper.classList.add('block-preview-each-choice');
      if (block.subtype == 'single') {
        const choiceIcon = document.createElement('div');
        choiceIcon.classList.add('block-preview-each-shape-circle');
        newChoiceWrapper.appendChild(choiceIcon);
      } else {
        const choiceIcon = document.createElement('div');
        choiceIcon.classList.add('block-preview-each-shape-square');
        newChoiceWrapper.appendChild(choiceIcon);
      }
      const choiceText = document.createElement('span');
      choiceText.classList.add('block-preview-each-choice-text');
      choiceText.innerHTML = block.choices[i];
      newChoiceWrapper.appendChild(choiceText);
      previewContent.appendChild(newChoiceWrapper);
    }
    if (block.choiceInputValue && block.choiceInputValue.length) {
      const newChoiceWrapper = document.createElement('div');
      newChoiceWrapper.classList.add('block-preview-each-choice');
      if (block.subtype == 'single') {
        const choiceIcon = document.createElement('div');
        choiceIcon.classList.add('block-preview-each-shape-circle');
        newChoiceWrapper.appendChild(choiceIcon);
      } else {
        const choiceIcon = document.createElement('div');
        choiceIcon.classList.add('block-preview-each-shape-square');
        newChoiceWrapper.appendChild(choiceIcon);
      }
      const choiceText = document.createElement('span');
      choiceText.classList.add('block-preview-each-choice-text');
      choiceText.innerHTML = block.choiceInputValue;
      newChoiceWrapper.appendChild(choiceText);
      previewContent.appendChild(newChoiceWrapper);
    }
  } else if (block.type == 'opinion_scale' && block.range.min && block.range.max) {
    const opinionScaleWrapper = document.createElement('div');
    opinionScaleWrapper.classList.add('block-preview-opinion-scale-wrapper');
    for (let i = Math.max(1, Math.min(parseInt(block.range.min), parseInt(block.range.max))); i <= Math.min(10, Math.max(parseInt(block.range.min), parseInt(block.range.max))); i++) {
      if (i != Math.max(1, Math.min(parseInt(block.range.min), parseInt(block.range.max)))) {
        const eachEmptyScale = document.createElement('div');
        eachEmptyScale.classList.add('block-preview-empty-scale');
        opinionScaleWrapper.appendChild(eachEmptyScale);
      }
      const eachScale = document.createElement('span');
      eachScale.classList.add('block-preview-each-scale');
      eachScale.innerHTML = i;
      opinionScaleWrapper.appendChild(eachScale);
    }
    previewContent.appendChild(opinionScaleWrapper);

    const opinionLine = document.createElement('div');
    opinionLine.classList.add('block-preview-opinion-line');
    for (let i = 0; i < 3; i++) {
      const eachOpinionLine = document.createElement('div');
      eachOpinionLine.classList.add('block-preview-opinion-line-item');
      opinionLine.appendChild(eachOpinionLine);
    }
    previewContent.appendChild(opinionLine);

    const opinionTextWrapper = document.createElement('div');
    opinionTextWrapper.classList.add('block-preview-opinion-text-wrapper');
    const leftOpinionText = document.createElement('span');
    leftOpinionText.classList.add('block-preview-opinion-text-left');
    leftOpinionText.innerHTML = block.labels.left;
    opinionTextWrapper.appendChild(leftOpinionText);
    const middleOpinionText = document.createElement('span');
    middleOpinionText.classList.add('block-preview-opinion-text-middle');
    middleOpinionText.innerHTML = block.labels.middle;
    opinionTextWrapper.appendChild(middleOpinionText);
    const rightOpinionText = document.createElement('span');
    rightOpinionText.classList.add('block-preview-opinion-text-right');
    rightOpinionText.innerHTML = block.labels.right;
    opinionTextWrapper.appendChild(rightOpinionText);
    previewContent.appendChild(opinionTextWrapper);
  } else if (block.type == 'open_answer') {
    const textInput = document.createElement('span');
    textInput.classList.add('block-preview-input');
    textInput.innerHTML = 'Type your answer here';
  } 
}

// Get questions data from the blockData object
function getQuestionsData () {
  const questionsWrapper = document.querySelector('.custom-blocks-wrapper');
  const questions = [];

  questionsWrapper.childNodes.forEach(question => {
    blockData[question.id]._id = question.id;
    questions.push(blockData[question.id]);
  });

  return questions;
}

// Save template
function saveProject (callback) {
  const data = {
    welcome_screen: {
      opening: blockData['welcome'].opening,
      details: blockData['welcome'].details,
      image: blockData['welcome'].image,
    },
    questions: getQuestionsData()
  };
  
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `/templates/edit/save?id=${template._id}`);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status != 200) {
      createConfirm({
        title: 'An error occured while saving',
        text: 'Please reload the page',
        accept: 'Continue'
      }, res => {
        return callback(true);
      });
    } else if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      if (!response.success && response.error) {
        console.log(response.error);
        createConfirm({
          title: 'An error occured while saving',
          text: 'Please reload the page',
          accept: 'Continue'
        }, res => {
          return callback(true);
        });
      } else {
        createPreviewPageContent();
        return callback(false);
      }
    }
  };
}

// Initialize the block data with the template informations
function getBlockData () {
  blockData['welcome'].opening = template.welcome_screen_update.opening;
  blockData['welcome'].details = template.welcome_screen_update.details;
  blockData['welcome'].image = template.welcome_screen_update.image;

  template.questions_update.forEach(question => {
    blockData[question._id] = question;
  });

  createSettingsPageContent(currentlyClickedBlock);
}

// Automatically call save template every second
function autoSave () {
  saveProject(err => {
    if (err) return location.reload();

    setTimeout(() => {
      autoSave();
    }, 1000);
  });
}

// Deletes the image with the given url from the server
function deleteImage (url) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/image/delete');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify({ url }));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      if (!response.success && response.error)
        return console.log(response.error);
    }
  };
}

// Uploads the file as image and sets the image input value accordingly, deletes the old image if there is any
function uploadImage (file) {
  document.querySelector('.general-choose-image-input-text').childNodes[0].innerHTML = 'Uploading...';
  document.querySelector('.general-choose-image-input-text').childNodes[1].type = 'text';
  document.querySelector('.general-choose-image-input-text').style.cursor = 'progress';

  const formdata = new FormData();
  formdata.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/image/upload');
  xhr.send(formdata);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      document.querySelector('.general-choose-image-input-text').style.display = 'none';

      if (!response.success)
        return alert(`An unknown error occured, please try again later. Error Message: ${response.error}`);

      blockData[currentlyClickedBlock].image = response.url;
      createSettingsPageContent(currentlyClickedBlock);
    }
  };
}

// Add required item sign on an item
function addRequiredItemSign (item) {
  const newSign = document.createElement('span');
  newSign.classList.add('general-input-required-sign');
  newSign.innerHTML = '*';
  item.appendChild(newSign);
}

// Create a new block with id
function createNewEachBlockWrapper (id) {
  const clickedBlock = document.querySelector('.clicked-each-block');
  if (clickedBlock)
    clickedBlock.classList.remove('clicked-each-block');

  const eachBlockWrapper = document.createElement('div');
  eachBlockWrapper.classList.add('each-block-wrapper');
  eachBlockWrapper.classList.add('clicked-each-block');
  eachBlockWrapper.id = id;

  const eachTypeImage = document.createElement('img');
  eachTypeImage.classList.add('each-type-image');
  eachTypeImage.src = '/res/images/block_icons/' + blockData[id].type + '.png';
  eachBlockWrapper.appendChild(eachTypeImage);

  const eachBlockTextWrapper = document.createElement('div');
  eachBlockTextWrapper.classList.add('each-block-text-wrapper');

  const eachTypeTitle = document.createElement('span');
  eachTypeTitle.classList.add('each-type-title');
  eachTypeTitle.classList.add('custom-block-type-title');
  eachTypeTitle.innerHTML = blockData[id].text.length ? blockData[id].text : 'New question';
  eachBlockTextWrapper.appendChild(eachTypeTitle);

  const eachTypeSubtitle = document.createElement('span');
  eachTypeSubtitle.classList.add('each-type-subtitle');
  eachTypeSubtitle.innerHTML = typeNames[blockData[id].type];
  eachBlockTextWrapper.appendChild(eachTypeSubtitle);

  eachBlockWrapper.appendChild(eachBlockTextWrapper);

  document.querySelector('.custom-blocks-wrapper').appendChild(eachBlockWrapper);
}

// Create an input title on the settings-content-wrapper
function createSettingsInputTitle (text, isRequired) {
  const settingsInputTitle = document.createElement('span');
  settingsInputTitle.classList.add('general-input-title');
  settingsInputTitle.innerHTML = text;
  if (isRequired)
    addRequiredItemSign(settingsInputTitle);
  document.querySelector('.block-settings-content-wrapper').appendChild(settingsInputTitle);
}

// Create a text on the settings-content-wrapper
function createSettingsInputInfoText (text) {
  const span = document.createElement('span');
  span.classList.add('general-input-info-text');
  span.innerHTML = text;
  document.querySelector('.block-settings-content-wrapper').appendChild(span);
}

// Create a short input on the settings-content-wrapper
function createSettingsShortInput (value, placeholder, name) {
  const settingsShortInput = document.createElement('input');
  settingsShortInput.classList.add('general-input-with-border');
  settingsShortInput.type = "text";
  settingsShortInput.value = value;
  settingsShortInput.placeholder = placeholder;
  settingsShortInput.name = name;
  document.querySelector('.block-settings-content-wrapper').appendChild(settingsShortInput);
}

// Create a long input on the settings-content-wrapper
function createSettingsLongInput (value, placeholder, name) {
  const settingsLongInput = document.createElement('textarea');
  settingsLongInput.classList.add('general-input-with-border-long');
  settingsLongInput.value = value;
  settingsLongInput.placeholder = placeholder;
  settingsLongInput.name = name;
  document.querySelector('.block-settings-content-wrapper').appendChild(settingsLongInput);
}

// Create an image picker on the settings-content-wrapper
function createSettingsImagePicker (text) {
  const settingsImagePicker = document.createElement('label');
  settingsImagePicker.classList.add('general-choose-image-input-text');

  const span = document.createElement('span');
  span.innerHTML = text;
  settingsImagePicker.appendChild(span);

  const input = document.createElement('input');
  input.classList.add('display-none');
  input.id = 'image-input';
  input.accept = 'image/*';
  input.type = 'file';

  settingsImagePicker.appendChild(input);

  document.querySelector('.block-settings-content-wrapper').appendChild(settingsImagePicker);
}

// Create the uploaded image
function createUploadedImage (url) {
  const imageInputWrapper = document.createElement('div');
  imageInputWrapper.classList.add('general-image-input-wrapper');

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('general-image-input-wrapper-image');
  const image = document.createElement('img');
  image.src = url;
  image.alt = 'usersmagic';
  imageWrapper.appendChild(image);
  imageInputWrapper.appendChild(imageWrapper);

  const i = document.createElement('i');
  i.classList.add('fas');
  i.classList.add('fa-times');
  i.classList.add('delete-image-button');
  imageInputWrapper.appendChild(i);
  document.querySelector('.block-settings-content-wrapper').appendChild(imageInputWrapper);
}

// Create settings choices wrapper on the settings-content-wrapper
function createSettingsChoicesWrapper () {
  const choicesWrapper = document.createElement('div');
  choicesWrapper.classList.add('block-settings-choices-wrapper');
  choicesWrapper.classList.add('drag-and-drop-wrapper');
  document.querySelector('.block-settings-content-wrapper').appendChild(choicesWrapper);
}

// Create a new choice on the settings-choices-wrapper
function createSettingsEachChoice (text) {
  const wrapper = document.querySelector('.block-settings-choices-wrapper');

  if (!wrapper)
    return;

  const eachChoice = document.createElement('div');
  eachChoice.classList.add('block-settings-each-choice');

  const span = document.createElement('span');
  span.innerHTML = text;
  eachChoice.appendChild(span);

  const i = document.createElement('i');
  i.classList.add('far');
  i.classList.add('fa-trash-alt');
  i.classList.add('choice-delete-button');
  eachChoice.appendChild(i);

  wrapper.appendChild(eachChoice);
}

// Create a settings choice input on the settings-content-wrapper
function createSettingsChoiceInput (value, placeholder, name) {
  const choiceInput = document.createElement('input');
  choiceInput.classList.add('block-settings-each-choice-input');
  choiceInput.type = "text"
  choiceInput.value = value;
  choiceInput.placeholder = placeholder;
  choiceInput.name = name;
  document.querySelector('.block-settings-content-wrapper').appendChild(choiceInput);
}

// Create multiple type wrapper and its content on the settings-content-wrapper
function createSettingsMultipleTypeWrapperAndContent (selected) {
  const multipleWrapper = document.createElement('div');
  multipleWrapper.classList.add('block-settings-multiple-type-wrapper');

  const eachTypeSingle = document.createElement('div');
  eachTypeSingle.classList.add('block-settings-multiple-each-type');
  eachTypeSingle.id = 'single';

  if (selected == 'single')
    eachTypeSingle.classList.add('clicked-multiple-type');
  
  const iSingle = document.createElement('i');
  iSingle.classList.add('far');
  iSingle.classList.add('fa-check-circle');
  const spanSingle = document.createElement('span');
  spanSingle.innerHTML = 'Single Select';
  eachTypeSingle.appendChild(iSingle);
  eachTypeSingle.appendChild(spanSingle);
  multipleWrapper.appendChild(eachTypeSingle);

  const eachTypeMultiple = document.createElement('div');
  eachTypeMultiple.classList.add('block-settings-multiple-each-type');
  eachTypeMultiple.id = 'multiple';

  if (selected == 'multiple')
    eachTypeMultiple.classList.add('clicked-multiple-type');
  
  const iMultiple = document.createElement('i');
  iMultiple.classList.add('far');
  iMultiple.classList.add('fa-check-circle');
  const spanMultiple = document.createElement('span');
  spanMultiple.innerHTML = 'Multiple Select';
  eachTypeMultiple.appendChild(iMultiple);
  eachTypeMultiple.appendChild(spanMultiple);
  multipleWrapper.appendChild(eachTypeMultiple);

  document.querySelector('.block-settings-content-wrapper').appendChild(multipleWrapper);
}

// Create one line inputs for opinion scale question on the settings-content-wrapper
function createSettingsOneLineInputs (inputs, type) {
  const inputsWrapper = document.createElement('div');
  inputsWrapper.classList.add('block-settings-one-line-inputs-wrapper');

  inputs.forEach(input => {
    const newInput = document.createElement('input');
    newInput.classList.add('block-settings-one-line-input');
    newInput.type = type;
    newInput.value = input.value;
    newInput.name = input.name;
    newInput.placeholder = input.placeholder;
    inputsWrapper.appendChild(newInput);
  });

  for (let i = 3; i > inputs.length; i--) {
    const emptyInput = document.createElement('div');
    emptyInput.classList.add('block-settings-one-line-input-empty-space');
    inputsWrapper.appendChild(emptyInput);
  }

  document.querySelector('.block-settings-content-wrapper').appendChild(inputsWrapper);
}

// Changes the selected block using currentlySelectedBlock
function changeSelectedBlock () {
  const clickedBlock = document.querySelector('.clicked-each-block');
  if (clickedBlock)
    clickedBlock.classList.remove('clicked-each-block');
  if (currentlyClickedBlock != 'welcome')
    document.getElementById(currentlyClickedBlock).classList.add('clicked-each-block');
}

// Create new content of the settings-content-wrapper
function createSettingsPageContent (id) {
  currentlyClickedBlock = id;

  const blockSettingsHeaderWrapper = document.querySelector('.block-settings-header-wrapper');
  document.querySelector('.block-settings-content-wrapper').innerHTML = "";

  if (id == 'welcome') {
    blockSettingsHeaderWrapper.childNodes[0].src = "/res/images/block_icons/welcome.png";
    blockSettingsHeaderWrapper.childNodes[1].innerHTML = "Welcome Screen";
    blockSettingsHeaderWrapper.childNodes[2].style.display = 'none';
    blockSettingsHeaderWrapper.childNodes[3].style.display = 'none';
    blockSettingsHeaderWrapper.childNodes[4].style.display = 'none';
    blockSettingsHeaderWrapper.childNodes[5].style.display = 'none';

    createSettingsInputTitle('Opening Message', true);
    createSettingsShortInput(blockData['welcome'].opening, 'Welcome your testers', 'opening');
    createSettingsInputTitle('Task & Details', true);
    createSettingsLongInput(blockData['welcome'].details, 'This is where you give your testers a task. Guide them on what they need to do before answering the questions.', 'details');
    createSettingsInputTitle('Image', false);
    if (!blockData[id].image || !blockData[id].image.length)
      createSettingsImagePicker('Add an image to explain the task.');
    else
      createUploadedImage(blockData[id].image);
  } else if (blockData[id]) {
    blockSettingsHeaderWrapper.childNodes[0].src = "/res/images/block_icons/" + blockData[id].type + ".png";
    blockSettingsHeaderWrapper.childNodes[1].innerHTML = typeNames[blockData[id].type];
    blockSettingsHeaderWrapper.childNodes[2].style.display = 'block';
    blockSettingsHeaderWrapper.childNodes[3].style.display = 'block';
    blockSettingsHeaderWrapper.childNodes[4].style.display = 'block';
    blockSettingsHeaderWrapper.childNodes[5].style.display = 'block';

    if (blockData[id].required) {
      blockSettingsHeaderWrapper.childNodes[3].classList.add('clicked');
      blockSettingsHeaderWrapper.childNodes[3].style.backgroundColor = 'rgb(46, 197, 206)';
      blockSettingsHeaderWrapper.childNodes[3].childNodes[0].classList.add('general-slider-button-slide-right-animation-class');
      blockSettingsHeaderWrapper.childNodes[3].childNodes[0].classList.remove('general-slider-button-slide-left-animation-class');
    } else {
      blockSettingsHeaderWrapper.childNodes[3].classList.remove('clicked');
      blockSettingsHeaderWrapper.childNodes[3].style.backgroundColor = 'rgb(196, 196, 196)';
      blockSettingsHeaderWrapper.childNodes[3].childNodes[0].classList.remove('general-slider-button-slide-right-animation-class');
      blockSettingsHeaderWrapper.childNodes[3].childNodes[0].classList.add('general-slider-button-slide-left-animation-class');
    }

    createSettingsInputTitle('Question', true);
    createSettingsShortInput(blockData[id].text, 'Type your question here', 'question');
    createSettingsInputTitle('Add Notes', false);
    createSettingsShortInput(blockData[id].details, 'Type your details here.', 'details');
    createSettingsInputTitle('Image', false);
    if (!blockData[id].image || !blockData[id].image.length)
      createSettingsImagePicker('Add an image to show while asking the question.');
    else
      createUploadedImage(blockData[id].image);

    if (blockData[id].type == 'multiple_choice') {
      createSettingsInputTitle('Choices', true);
      createSettingsChoicesWrapper();
      createSettingsChoiceInput(blockData[id].choiceInputValue, 'Choice 1', 'choice');
      blockData[id].choices.forEach(choice => {
        createSettingsEachChoice(choice);
      });
      createSettingsInputInfoText('Press enter to add a new choice');
      createSettingsInputTitle('Type', true)
      createSettingsMultipleTypeWrapperAndContent(blockData[id].subtype);
    } else if (blockData[id].type == 'opinion_scale') {
      createSettingsInputTitle('Scale', true);
      createSettingsOneLineInputs([
        {name: 'rangeMin', value: blockData[id].range.min, placeholder: 'Min'},
        {name: 'rangeMax', value: blockData[id].range.max, placeholder: 'Max'}
      ], 'number');
      createSettingsInputInfoText('Your range must be in between 1 and 10, inclusive');
      createSettingsInputTitle('Label', false);
      createSettingsOneLineInputs([
        {name: 'labelLeft', value: blockData[id].labels.left, placeholder: 'Left'},
        {name: 'labelMiddle', value: blockData[id].labels.middle, placeholder: 'Middle'},
        {name: 'labelRight', value: blockData[id].labels.right, placeholder: 'Right'}
      ], 'text');
    }
  }
}

// Save reorder of choices which are below settings-choices-wrapper
function getChoices () {
  const wrapper = document.querySelector('.block-settings-choices-wrapper');

  if (!wrapper) return;

  blockData[currentlyClickedBlock].choices = [];

  wrapper.childNodes.forEach(node => {
    blockData[currentlyClickedBlock].choices.push(node.childNodes[0].innerHTML);
  });
}

// Duplicates the block using the currentlySelectedBlock with a new id, opens the new block
function duplicateBlock () {
  const block = blockData[currentlyClickedBlock];
  const newData = {
    _id: Math.random().toString(36).substr(2, 12),
    type: block.type,
    text: block.text,
    details: block.details,
    image: null,
    required: block.required,
  };

  if (block.type == 'multiple_choice') {
    newData.choices = block.choices;
    newData.choiceInputValue = block.choiceInputValue;
    newData.subtype = block.subtype;
  } else if (block.type == 'opinion_scale') {
    newData.labels = block.labels;
    newData.range = block.range;
  }

  blockData[newData._id] = newData;
  createNewEachBlockWrapper(newData._id);
  const newBlock = document.getElementById(newData._id);
  while (newBlock.previousElementSibling && newBlock.previousElementSibling.id != currentlyClickedBlock)
    newBlock.parentNode.insertBefore(newBlock, newBlock.previousElementSibling);
  createSettingsPageContent(newData._id);
}

// Create an error message after the given element with the given error message
function createErrorMessage (element, message) {
  const errorText = document.createElement('span');
  errorText.classList.add('finish-error-text');
  errorText.innerHTML = message;
  element.after(errorText);
  errorText.classList.add('blink-red-animation-class');
}

// Check the current data before finishing the template
function checkDataBeforeFinish (callback) {
  if (!blockData['welcome'].opening || !blockData['welcome'].opening.length) {
    createSettingsPageContent('welcome');
    changeSelectedBlock();
    createErrorMessage(document.getElementsByName('opening')[0], 'Please enter an opening message.');
    return callback(false);
  } else if (blockData['welcome'].opening.length > 1000) {
    createSettingsPageContent('welcome');
    changeSelectedBlock();
    createErrorMessage(document.getElementsByName('opening')[0], 'Your opening message should be less than 1000 characters.');
    return callback(false);
  } else if (!blockData['welcome'].details || !blockData['welcome'].details.length) {
    createSettingsPageContent('welcome');
    changeSelectedBlock();
    createErrorMessage(document.getElementsByName('details')[0], 'Please enter your task.');
    return callback(false);
  } else if (blockData['welcome'].details.length > 1000) {
    createSettingsPageContent('welcome');
    changeSelectedBlock();
    createErrorMessage(document.getElementsByName('details')[0], 'Your task & details should be less than 1000 characters.');
    return callback(false);
  } else {
    const questions = getQuestionsData();
    const maxQuestionTextLength = 1000, maxQuestionLongTextLength = 5000, maxQuestionAnswerLength = 5000;
    const rangeMinValue = 1, rangeMaxValue = 10;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (!question || !question._id) {
        alert("An unknown error occured, please refresh the page and then try again.");
        return callback(false);
      } else if (!question.text || !question.text.length) {
        createSettingsPageContent(question._id);
        changeSelectedBlock();
        createErrorMessage(document.getElementsByName('question')[0], 'Please enter a question.');
        return callback(false);
      } else if (question.text.length > maxQuestionTextLength) {
        createSettingsPageContent(question._id);
        changeSelectedBlock();
        createErrorMessage(document.getElementsByName('question')[0], 'Your question should be less than 1000 characters.');
        return callback(false);
      } else if (question.details && question.details.length > maxQuestionLongTextLength) {
        createSettingsPageContent(question._id);
        changeSelectedBlock();
        createErrorMessage(document.getElementsByName('details')[0], 'Your question details should be less than 5000 characters.');
        return callback(false);
      } else if (question.type == 'multiple_choice') {
        if ((!question.choices || !question.choices.length) && (!question.choiceInputValue || !question.choiceInputValue.length)) {
          createSettingsPageContent(question._id);
          changeSelectedBlock();
          createErrorMessage(document.getElementsByName('choice')[0].nextElementSibling, 'Please enter at least one choice for your question.');
          return callback(false);
        } else if (question.choices && question.choices.filter(choice => choice.length > maxQuestionTextLength).length) {
          createSettingsPageContent(question._id);
          changeSelectedBlock();
          createErrorMessage(document.getElementsByName('choice')[0].nextElementSibling, 'All of your choices should be shorter than 1000 characters.');
          return callback(false);
        } else if (i == questions.length - 1) {
          return callback(true);
        }
      } else if (question.type == 'opinion_scale') {
        const range = {
          min: (question.range && question.range.min && !isNaN(parseInt(question.range.min))) ? parseInt(question.range.min) : '',
          max: (question.range && question.range.max && !isNaN(parseInt(question.range.max))) ? parseInt(question.range.max) : ''
        };

        const labels = {
          left: question.labels && question.labels.left ? question.labels.left : '',
          middle: question.labels && question.labels.middle ? question.labels.middle : '',
          right: question.labels && question.labels.right ? question.labels.right : ''
        };

        if (isNaN(parseInt(question.range.min)) || isNaN(parseInt(question.range.max))) {
          createSettingsPageContent(question._id);
          changeSelectedBlock();
          createErrorMessage(document.getElementsByName('rangeMin')[0].parentNode.nextElementSibling, 'Please enter a minimum and maximum value.');
          return callback(false);
        } else if (parseInt(range.min) < rangeMinValue || parseInt(range.max) > rangeMaxValue) {
          createSettingsPageContent(question._id);
          changeSelectedBlock();
          createErrorMessage(document.getElementsByName('rangeMin')[0].parentNode.nextElementSibling, 'Your range must be in between 1 and 10, inclusive.');
          return callback(false);
        } else if (range.min >= range.max) {
          createSettingsPageContent(question._id);
          changeSelectedBlock();
          createErrorMessage(document.getElementsByName('rangeMin')[0].parentNode.nextElementSibling, 'Your range minimum must be smaller than your range maximum.');
          return callback(false);
        } else if (labels.left.length > maxQuestionTextLength || labels.middle.length > maxQuestionTextLength || labels.right.length > maxQuestionTextLength) {
          createSettingsPageContent(question._id);
          changeSelectedBlock();
          createErrorMessage(document.getElementsByName('labelLeft')[0].parentNode, 'Your labels can be maximum 1000 characters.');
          return callback(false);
        } else if (i == questions.length - 1) {
          return callback(true);
        }
      } else if (i == questions.length - 1) {
        return callback(true);
      }
    }
  }
}

// Finish the current template, show the error or redirect user to details page
function finishProject () {
  saveProject(err => {
    if (err) return;

    checkDataBeforeFinish(res => {
      if (res) {
        createConfirm({
          title: 'Are you sure you want to publish this template?',
          text: 'The users will see this version of the template from now on.',
          reject: 'Cancel',
          accept: 'Continue'
        }, res => {
          if (res) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `/templates/edit/finish?id=${template._id}`);
            xhr.send();
  
            xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.responseText) {
                const response = JSON.parse(xhr.responseText);
  
                if (!response.success && response.error)
                  return alert("An error occured while finishing the template. Error message: " + (response.error.message ? response.error.message : response.error));
                return window.location = `/templates`;
              }
            };
          }
        });
      }
    });
  });
}

window.onload = () => {
  template = JSON.parse(document.getElementById('json-template-data').value); // Get template data
  getBlockData(); // Initialize block data using template

  dragAndDrop(document); // Listen for drag-and-drop wrappers
  listenSliderButtons(document); // Listen slider buttons
  setTimeout(() => {
    autoSave(); // Automatically save template
  }, 1000); // Wait for everything on the page to be uploaded

  const addBlockWrapper = document.querySelector('.add-block-wrapper');
  const addBlockButton = document.querySelector('.add-block-button');
  let isAddBlockClicked = false;

  document.addEventListener('click', event => {
    // Open/Close add a new block menu
    if (event.target.classList.contains('add-block-button') || event.target.parentNode.classList.contains('add-block-button') || event.target.parentNode.parentNode.classList.contains('add-block-button')) {
      if (isAddBlockClicked) {
        isAddBlockClicked = false;
        addBlockWrapper.classList.add('close-up-animation-class');
        addBlockWrapper.classList.remove('open-bottom-animation-class');
        setTimeout(() => {
          if (!isAddBlockClicked) {
            addBlockButton.childNodes[0].childNodes[0].classList.remove('fa-times');
            addBlockButton.childNodes[0].childNodes[0].classList.add('fa-plus');
            addBlockButton.childNodes[1].childNodes[0].innerHTML = 'Add a Block';
            addBlockButton.childNodes[1].childNodes[1].innerHTML = 'Rating, question...';
            addBlockWrapper.style.border = '0.4px dashed rgb(46, 197, 206)';
          }
        }, 600);
      } else {
        isAddBlockClicked = true;
        addBlockButton.childNodes[0].childNodes[0].classList.remove('fa-plus');
        addBlockButton.childNodes[0].childNodes[0].classList.add('fa-times');
        addBlockButton.childNodes[1].childNodes[0].innerHTML = 'Choose a block type';
        addBlockButton.childNodes[1].childNodes[1].innerHTML = 'Pick the next type you need';
        addBlockWrapper.style.border = '0.4px solid rgb(196, 196, 196)';
        addBlockWrapper.classList.add('open-bottom-animation-class');
        addBlockWrapper.classList.remove('close-up-animation-class');
        setTimeout(() => {
          addBlockWrapper.scrollIntoView(false);
        }, 600);
      }
    }

    // Add a new block
    if (event.target.classList.contains('each-add-block-wrapper') || event.target.parentNode.classList.contains('each-add-block-wrapper') || event.target.parentNode.parentNode.classList.contains('each-add-block-wrapper')) {
      let type;

      if (event.target.classList.contains('each-add-block-wrapper'))
        type = event.target.id;
      else if (event.target.parentNode.classList.contains('each-add-block-wrapper'))
        type = event.target.parentNode.id;
      else if (event.target.parentNode.parentNode.classList.contains('each-add-block-wrapper'))
        type = event.target.parentNode.parentNode.id;

      const newData = {
        type,
        text: '',
        details: '',
        image: null,
        required: true
      };
      const id = Math.random().toString(36).substr(2, 12);

      if (type == 'multiple_choice') {
        newData.type = 'multiple_choice';
        newData.choices = [];
        newData.choiceInputValue = '';
        newData.subtype = 'single';
      } else if (type == 'opinion_scale') {
        newData.labels = {
          left: '',
          middle: '',
          right: ''
        };
        newData.range = {
          min: '',
          max: ''
        };
      }

      blockData[id] = newData;
      createNewEachBlockWrapper(id);
      createSettingsPageContent(id);

      isAddBlockClicked = false;
      addBlockWrapper.classList.add('close-up-animation-class');
      addBlockWrapper.classList.remove('open-bottom-animation-class');
      setTimeout(() => {
        if (!isAddBlockClicked) {
          addBlockButton.childNodes[0].childNodes[0].classList.remove('fa-times');
          addBlockButton.childNodes[0].childNodes[0].classList.add('fa-plus');
          addBlockButton.childNodes[1].childNodes[0].innerHTML = 'Add a Block';
          addBlockButton.childNodes[1].childNodes[1].innerHTML = 'Rating, question...';
          addBlockWrapper.style.border = '0.4px dashed rgb(46, 197, 206)';
        }
      }, 600);
    }

    // Change to the welcome block
    if (event.target.classList.contains('welcome-block-wrapper') || event.target.parentNode.classList.contains('welcome-block-wrapper')) {
      createSettingsPageContent('welcome');
      changeSelectedBlock();
    }

    // Change block
    if (event.target.classList.contains('each-block-wrapper')) {
      createSettingsPageContent(event.target.id);
      changeSelectedBlock();
    } else if (event.target.parentNode.classList.contains('each-block-wrapper')) {
      createSettingsPageContent(event.target.parentNode.id);
      changeSelectedBlock();
    } else if (event.target.parentNode.parentNode.classList.contains('each-block-wrapper')) {
      createSettingsPageContent(event.target.parentNode.parentNode.id);
      changeSelectedBlock();
    }

    // Change required option
    if (event.target.classList.contains('required-slide-button') || event.target.parentNode.classList.contains('required-slide-button')) {
      blockData[currentlyClickedBlock].required = !blockData[currentlyClickedBlock].required;
    }

    // Delete block
    if (event.target.classList.contains('settings-delete-button')) {
      createConfirm({
        title: 'Are you sure you want to delete this question?',
        text: 'You cannot take this action back.',
        reject: 'Cancel',
        accept: 'Continue'
      }, res => {
        if (res) {
          const selectedDocument = document.getElementById(currentlyClickedBlock);
          
          if (selectedDocument.previousElementSibling) {
            selectedDocument.previousElementSibling.classList.add('clicked-each-block');
            createSettingsPageContent(selectedDocument.previousElementSibling.id);
            selectedDocument.remove();
          } else {
            createSettingsPageContent('welcome');
            selectedDocument.remove();
          }
        }
      });
    }

    // Duplicate block
    if (event.target.classList.contains('settings-duplicate-button')) {
      duplicateBlock();
    }

    // Delete Choice
    if (event.target.classList.contains('choice-delete-button')) {
      event.target.parentNode.remove();
      getChoices();
    }

    // Change multiple choice subtype
    if (event.target.classList.contains('block-settings-multiple-each-type')) {
      document.querySelector('.clicked-multiple-type').classList.remove('clicked-multiple-type');
      event.target.classList.add('clicked-multiple-type');
      blockData[currentlyClickedBlock].subtype = event.target.id;
    } else if (event.target.parentNode.classList.contains('block-settings-multiple-each-type')) {
      document.querySelector('.clicked-multiple-type').classList.remove('clicked-multiple-type');
      event.target.parentNode.classList.add('clicked-multiple-type');
      blockData[currentlyClickedBlock].subtype = event.target.parentNode.id;
    }

    // Delete image
    if (event.target.classList.contains('delete-image-button')) {
      event.target.parentNode.remove();
      deleteImage(blockData[currentlyClickedBlock].image);
      blockData[currentlyClickedBlock].image = null;
      createSettingsPageContent(currentlyClickedBlock);
    }

    // Finish template
    if (event.target.classList.contains('finish-template-button') || event.target.parentNode.classList.contains('finish-template-button')) {
      finishProject();
    }
  });

  document.addEventListener('change', event => {
    // Upload an image
    if (event.target.id == 'image-input' && event.target.files && event.target.files.length && event.target.files[0]) {
      uploadImage(event.target.files[0]);
    }
  });

  document.addEventListener('input', event => {
    if (event.target.name == 'opening') { // Welcome opening text input
      blockData['welcome'].opening = event.target.value;
    } else if (event.target.name == 'question') { // Question text input
      blockData[currentlyClickedBlock].text = event.target.value;
      document.getElementById(currentlyClickedBlock).childNodes[1].childNodes[0].innerHTML = event.target.value.length ? event.target.value : 'New question';
    } else if (event.target.name == 'details') { // Question details input
      blockData[currentlyClickedBlock].details = event.target.value;
    } else if (event.target.name == 'choice') { // New choice input
      blockData[currentlyClickedBlock].choiceInputValue = event.target.value;
    } else if (event.target.name == 'labelLeft') { // Left label input
      blockData[currentlyClickedBlock].labels.left = event.target.value;
    } else if (event.target.name == 'labelMiddle') { // Middle label input
      blockData[currentlyClickedBlock].labels.middle = event.target.value;
    } else if (event.target.name == 'labelRight') { // Right label input
      blockData[currentlyClickedBlock].labels.right = event.target.value;
    } else if (event.target.name == 'rangeMin') { // Min range input
      blockData[currentlyClickedBlock].range.min = event.target.value;
    } else if (event.target.name == 'rangeMax') { // Max range input
      blockData[currentlyClickedBlock].range.max = event.target.value;
    }
  });

  document.addEventListener('keydown', event => {
    // Create new choice
    if (event.target.name == 'choice' && event.key == 'Enter' && event.target.value.length) { // New choice input Enter clicked
      createSettingsEachChoice(event.target.value);
      blockData[currentlyClickedBlock].choices.push(event.target.value);
      blockData[currentlyClickedBlock].choiceInputValue = '';
      event.target.value = '';
      event.target.placeholder = 'Choice ' + (document.querySelector('.block-settings-choices-wrapper').childNodes.length + 1);
    }
  });

  document.addEventListener('mouseup', event => {
    // Reorder choices
    if (event.target.classList.contains('block-settings-each-choice'))
      getChoices();
  });
}
