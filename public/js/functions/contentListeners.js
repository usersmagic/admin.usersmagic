function listenCreateNewContentItemButton(document) {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('header-create-new-content-item-button') || event.target.parentNode.classList.contains('header-create-new-content-item-button')) {
      if (document.querySelector('.all-content-inner-wrapper'))
        document.querySelector('.all-content-inner-wrapper').style.display = 'none';
      if (document.querySelector('.all-content-create-new-content-item-wrapper'))
        document.querySelector('.all-content-create-new-content-item-wrapper').style.display = 'flex';
    }

    if (event.target.classList.contains('header-create-new-content-item-back-button') || event.target.parentNode.classList.contains('header-create-new-content-item-back-button')) {
      if (document.querySelector('.all-content-inner-wrapper'))
        document.querySelector('.all-content-inner-wrapper').style.display = 'flex';
      if (document.querySelector('.all-content-create-new-content-item-wrapper'))
        document.querySelector('.all-content-create-new-content-item-wrapper').style.display = 'none';
    }
  });
}
