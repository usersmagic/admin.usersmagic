function listenSliderButtons (document) {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('general-slider-button')) {
      if (!event.target.classList.contains('clicked')) {
        event.target.classList.add('clicked');
        event.target.childNodes[0].classList.add('general-slider-button-slide-right-animation-class');
        event.target.childNodes[0].classList.remove('general-slider-button-slide-left-animation-class');
        event.target.style.backgroundColor = 'rgb(46, 197, 206)';
      } else {
        event.target.classList.remove('clicked');
        event.target.childNodes[0].classList.remove('general-slider-button-slide-right-animation-class');
        event.target.childNodes[0].classList.add('general-slider-button-slide-left-animation-class');
        event.target.style.backgroundColor = 'rgb(196, 196, 196)';
      }
    }

    if (event.target.parentNode.classList.contains('general-slider-button')) {
      if (!event.target.parentNode.classList.contains('clicked')) {
        event.target.parentNode.classList.add('clicked');
        event.target.classList.add('general-slider-button-slide-right-animation-class');
        event.target.classList.remove('general-slider-button-slide-left-animation-class');
        event.target.parentNode.style.backgroundColor = 'rgb(46, 197, 206)';
      } else {
        event.target.parentNode.classList.remove('clicked');
        event.target.classList.remove('general-slider-button-slide-right-animation-class');
        event.target.classList.add('general-slider-button-slide-left-animation-class');
        event.target.parentNode.style.backgroundColor = 'rgb(196, 196, 196)';
      }
    }
  });
}
