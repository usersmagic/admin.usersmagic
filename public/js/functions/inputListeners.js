// Deletes the image with the given url from the server, returns an error it is exists
function deleteImage (url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/image/delete');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify({ url }));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      if (!response.success && response.error)
        return callback(response.error);

      return callback(null);
    }
  };
}

// Uploads the file as image, returns its url or an error if it exists
function uploadImage (file, callback) {
  const formdata = new FormData();
  formdata.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/image/upload');
  xhr.send(formdata);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      if (!response.success)
        return callback(response.error);

      callback(null, response.url);
    }
  };
}

function listenDropDownListInputs (document) {
  // Listen for drop down input focus in event
  document.addEventListener('focusin', event => {
    if (event.target.classList.contains('general-drop-down-list-input')) {
      event.target.parentNode.classList.add('general-drop-down-list-open-bottom-animation-class');
      event.target.parentNode.classList.remove('general-drop-down-list-close-up-animation-class');
      event.target.parentNode.style.outlineColor = 'rgba(46, 197, 206, 0.6)';
      event.target.parentNode.style.outlineWidth = '5px';
      event.target.parentNode.style.outlineStyle = 'auto';
    }
  });

  // Listen for drop down input focus out event
  document.addEventListener('focusout', event => {
    if (event.target.classList.contains('general-drop-down-list-input')) {
      event.target.parentNode.classList.remove('general-drop-down-list-open-bottom-animation-class');
      event.target.parentNode.classList.add('general-drop-down-list-close-up-animation-class');
      event.target.parentNode.style.outline = 'none';
    }
  });

  // Listen for drop down input event, search the values with the given input
  document.addEventListener('input', event => {
    if (event.target.classList.contains('general-drop-down-list-input')) {
      event.target.parentNode.parentNode.querySelector('.general-drop-down-list-input-not-visible').value = '';
      const values = JSON.parse(event.target.parentNode.querySelector('.general-drop-down-list-items-json').value);
      const wrapper = event.target.parentNode.querySelector('.general-drop-down-choices-wrapper');

      wrapper.innerHTML = ''; // Reset content of the wrapper
      const inputValue = event.target.value.toLowerCase().trim();

      values.forEach(value => {
        if (inputValue.length) { // If there is a search text
          if (value.name.toLowerCase().trim().includes(inputValue)) { // Take documents that include the given text
            const newValue = document.createElement('span');
            newValue.classList.add('general-drop-down-list-each-item');
            newValue.id = value.id;
            newValue.innerHTML = value.name;
            wrapper.appendChild(newValue);
            // while (newValue.previousElementSibling && value.name.toLowerCase().trim().indexOf(inputValue) < newValue.previousElementSibling.innerHTML.toLowerCase().trim().indexOf(inputValue))
            //   wrapper.insertBefore(newValue, newValue.previousElementSibling);
          }
          if (value.name.toLowerCase().trim() == inputValue) { // If the name exactly matches the value, take this value
            event.target.parentNode.parentNode.querySelector('.general-drop-down-list-input-not-visible').value = value.id;
          }
        } else { // Select all elements
          const newValue = document.createElement('span');
          newValue.classList.add('general-drop-down-list-each-item');
          newValue.id = value.id;
          newValue.innerHTML = value.name;
          wrapper.appendChild(newValue);
        }
      });
    }
  });

  // Listen for click events
  document.addEventListener('click', event => {
    // Click on a list item, change value and id accordingly
    if (event.target.classList.contains('general-drop-down-list-each-item')) {
      event.target.parentNode.parentNode.querySelector('.general-drop-down-list-input').value = event.target.innerHTML;
      event.target.parentNode.parentNode.querySelector('.general-drop-down-list-input-not-visible').value = event.target.id;
    }
  });
}

function listenCheckedInputs (document) {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('general-each-checked-input') || event.target.parentNode.classList.contains('general-each-checked-input') || event.target.parentNode.parentNode.classList.contains('general-each-checked-input')) {
      let target = event.target;
      if (event.target.parentNode.classList.contains('general-each-checked-input'))
        target = event.target.parentNode;
      if (event.target.parentNode.parentNode.classList.contains('general-each-checked-input'))
        target = event.target.parentNode.parentNode;
        
      let values = JSON.parse(target.parentNode.childNodes[0].value.length ? target.parentNode.childNodes[0].value : "[]"); // Parse the array of old values or an empty array

      if (values.includes(target.childNodes[1].id)) {
        values = values.filter(value => value != target.childNodes[1].id);
        target.childNodes[0].style.backgroundColor = 'rgb(254, 254, 254)';
        target.childNodes[0].style.border = '1px solid rgb(196, 196, 196)';
      } else {
        values.push(target.childNodes[1].id);
        target.childNodes[0].style.backgroundColor = 'rgb(46, 197, 206)';
        target.childNodes[0].style.border = 'none';
      }

      target.parentNode.childNodes[0].value = JSON.stringify(values);
    }
  })
}

function listenImageInputs (document) {
  document.addEventListener('input', event => {
    if (event.target.classList.contains('upload-image-input')) {
      const imageInput = event.target;
      const file = imageInput.files[0];
      imageInput.parentNode.childNodes[0].style.display = 'none';
      imageInput.parentNode.childNodes[1].style.display = 'block';
      imageInput.type = 'text';
      imageInput.parentNode.style.cursor = 'progress';
  
      uploadImage(file, (err, url) => {
        if (err)
          return alert("An error occured. Error Message: " + err);
  
        event.target.parentNode.parentNode.childNodes[0].value = url;
        event.target.parentNode.style.display = 'none';
        event.target.parentNode.parentNode.childNodes[2].style.display = 'flex';
        event.target.parentNode.parentNode.childNodes[2].childNodes[0].childNodes[0].src = url;
      });
    }
  });

  document.addEventListener('click', event => {
    if (event.target.classList.contains('delete-image-button')) {
      deleteImage(event.target.parentNode.childNodes[0].childNodes[0].src, err => {
        if (err)
          return alert("An error occured. Error Message: " + err);

        event.target.parentNode.parentNode.childNodes[0].value = '';
        event.target.parentNode.style.display = 'none';
        event.target.parentNode.childNodes[0].childNodes[0].src = '';
        event.target.parentNode.parentNode.childNodes[1].style.display = 'flex';
        event.target.parentNode.parentNode.childNodes[1].childNodes[0].style.display = 'block';
        event.target.parentNode.parentNode.childNodes[1].childNodes[1].style.display = 'none';
        event.target.parentNode.parentNode.childNodes[1].childNodes[2].type = 'file';
        event.target.parentNode.parentNode.childNodes[1].style.cursor = 'pointer';
      });
    }
  })
}
