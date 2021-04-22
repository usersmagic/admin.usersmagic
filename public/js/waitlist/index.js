function createEachContentItem (title, value, wrapper) {
  const eachItemContentItem = document.createElement('div');
  eachItemContentItem.classList.add('each-item-content-item');

  const eachItemContentHeader = document.createElement('span');
  eachItemContentHeader.classList.add('each-item-content-item-header');
  eachItemContentHeader.innerHTML = title + ':';
  
  const eachItemContentValue = document.createElement('span');
  eachItemContentValue.classList.add('each-item-content-item-value');
  eachItemContentValue.innerHTML = value;

  eachItemContentItem.appendChild(eachItemContentHeader);
  eachItemContentItem.appendChild(eachItemContentValue);
  wrapper.appendChild(eachItemContentItem);
}

function createAllContentInnerWrapperContent (users) {
  const allContentInnerWrapper = document.querySelector('.all-content-inner-wrapper');
  while (allContentInnerWrapper.childElementCount > 1)
    allContentInnerWrapper.childNodes[1].remove();

  users.forEach(user => {
    const eachItemWrapper = document.createElement('div');
    eachItemWrapper.classList.add('each-item-wrapper');

    const eachItemHeader = document.createElement('div');
    eachItemHeader.classList.add('each-item-header');

    const eachItemTitle = document.createElement('span');
    eachItemTitle.classList.add('each-item-title');
    eachItemTitle.innerHTML = user.name;
    eachItemHeader.appendChild(eachItemTitle);

    const eachItemSubtitle = document.createElement('span');
    eachItemSubtitle.classList.add('each-item-subtitle');
    eachItemSubtitle.innerHTML = '(' + user.email + ')';
    eachItemHeader.appendChild(eachItemSubtitle);
    
    const eachUserDetailsButton = document.createElement('i');
    eachUserDetailsButton.classList.add('fas');
    eachUserDetailsButton.classList.add('fa-chevron-down');
    eachUserDetailsButton.classList.add('each-user-details-button');
    eachItemHeader.appendChild(eachUserDetailsButton);

    const eachUserRemoveButton = document.createElement('i');
    eachUserRemoveButton.classList.add('fas');
    eachUserRemoveButton.classList.add('fa-check');
    eachUserRemoveButton.classList.add('each-user-remove-button');
    eachUserRemoveButton.id = user._id;
    eachItemHeader.appendChild(eachUserRemoveButton);

    eachItemWrapper.appendChild(eachItemHeader);

    const eachItemContent = document.createElement('div');
    eachItemContent.classList.add('each-item-content');

    createEachContentItem(document.getElementById('country').innerHTML, user.country, eachItemContent);
    createEachContentItem(document.getElementById('city').innerHTML, user.city || '-', eachItemContent);
    createEachContentItem(document.getElementById('town').innerHTML, user.town || '-', eachItemContent);
    createEachContentItem(document.getElementById('gender').innerHTML, user.gender, eachItemContent);
    createEachContentItem(document.getElementById('phone').innerHTML, user.phone, eachItemContent);
    createEachContentItem(document.getElementById('birth-year').innerHTML, user.birth_year, eachItemContent);

    eachItemWrapper.appendChild(eachItemContent);

    allContentInnerWrapper.appendChild(eachItemWrapper);
  });
}

window.onload = () => {
  listenCreateNewContentItemButton(document); // Listen for createNewContent button
  listenCheckedInputs(document); // Listen for checked inputs

  const form = document.querySelector('.all-content-create-new-content-item-wrapper');
  const unknownError = document.getElementById('unknown-error');

  form.onsubmit = event => {
    event.preventDefault();
    unknownError.style.display = 'none';

    const email = document.getElementById('email-input').value.trim();
    const name = document.getElementById('name-input').value.trim();
    const city = document.getElementById('city-input').value.trim();
    const town = document.getElementById('town-input').value.trim();
    const countries = JSON.parse(document.getElementById('countries-input').value.trim());
    const genders = JSON.parse(document.getElementById('genders-input').value.trim());
    const max_birth_year = document.getElementById('max-birth-year-input').value.trim();
    const min_birth_year = document.getElementById('min-birth-year-input').value.trim();

    const data = {};

    if (email && email.length)
      data.email = email;

    if (name && name.length)
      data.name = name;

    if (city && city.length)
      data.city = city;

    if (town && town.length)
      data.town = town;

    if (countries && countries.length)
      data.countries = countries;

    if (genders && genders.length)
      data.genders = genders;
    
    if (max_birth_year && max_birth_year.length)
      data.max_birth_year = parseInt(max_birth_year);

    if (min_birth_year && min_birth_year.length)
      data.min_birth_year = parseInt(min_birth_year);

    serverRequest('/waitlist', 'POST', data, res => {
      if (!res.success) {
        return unknownError.style.display = 'block';
      } else {
        document.querySelector('.user-email-content').innerHTML = res.users.map(user => user.email).join(' ');
        createAllContentInnerWrapperContent(res.users);
        if (document.querySelector('.all-content-inner-wrapper'))
          document.querySelector('.all-content-inner-wrapper').style.display = 'flex';
        if (document.querySelector('.all-content-create-new-content-item-wrapper'))
          document.querySelector('.all-content-create-new-content-item-wrapper').style.display = 'none';
      }
    });
  };

  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-user-details-button')) {
      if (event.target.parentNode.parentNode.offsetHeight == 50) {
        event.target.parentNode.parentNode.style.height = 'auto';
      } else {
        event.target.parentNode.parentNode.style.height = '50px';
      }
    }

    if (event.target.classList.contains('each-user-remove-button')) {
      createConfirm({
        title: 'Are you sure?',
        text: 'Please confirm you want to remove this user from the waitlist',
        accept: 'Continue',
        reject: 'Cancel'
      }, res => {
        if (res) {
          serverRequest('/waitlist/remove?id=' + event.target.id, 'GET', {}, res => {
            if (!res.success && res.error)
              return alert(res.error);
            return event.target.parentNode.parentNode.remove();
          });
        };
      });
    }

    if (event.target.classList.contains('see-emails-button') || event.target.parentNode.classList.contains('see-emails-button')) {
      document.querySelector('.email-list-outer-wrapper').style.display = 'flex';
    }

    if (event.target.classList.contains('email-list-outer-wrapper')) {
      document.querySelector('.email-list-outer-wrapper').style.display = 'none';
    }

    if (event.target.classList.contains('approve-all-button') || event.target.parentNode.classList.contains('approve-all-button')) {
      createConfirm({
        title: 'Are you sure you want to approve all the users in this page?',
        text: 'You cannot take this action back. Please wait a few seconds for the process to complete.',
        accept: 'Continue',
        reject: 'Cancel'
      }, res => {
        if (res) {
          const removeButtons = document.querySelectorAll('.each-user-remove-button');
          const removeIds = [];
          for (let i = 0; i < removeButtons.length; i++)
            removeIds.push(removeButtons[i].id);
          
          serverRequest('/waitlist/remove', 'POST', {
            users: removeIds
          }, res => {
            if (!res.success && res.error)
              return alert(res.error);
            return window.location.reload();
          });
        }
      });
    }
  });
}
