
let usedQuestionIds = [];

function addQuestion (type, question, wrapper) {
  const eachSearchQuestion = document.createElement('div');
  eachSearchQuestion.classList.add('each-search-question');
  eachSearchQuestion.id = question._id.toString();

  const span = document.createElement('span');
  span.innerHTML = question.name;
  eachSearchQuestion.appendChild(span);

  if (type == 'search') {
    const iAdd = document.createElement('i');
    iAdd.classList.add('fas');
    iAdd.classList.add('fa-plus');
    iAdd.classList.add('add-question-button');
    eachSearchQuestion.appendChild(iAdd);
  } else {
    const iRemove = document.createElement('i');
    iRemove.classList.add('fas');
    iRemove.classList.add('fa-minus');
    iRemove.classList.add('remove-question-button');
    eachSearchQuestion.appendChild(iRemove);
  }

  wrapper.appendChild(eachSearchQuestion);
}


window.onload = () => {
  listenCreateNewContentItemButton(document); // Listen for createNewContent button
  listenCheckedInputs(document); // Listen for checked inputs
  listenDropDownListInputs(document); // Listen for drop down items
  listenImageInputs(document); // Listen for image inputs
  
  // DOM Elements
  const graphTitle = document.getElementById('graph-title');
  const yFilter = document.getElementById('y-filter')
  const xFilter = document.getElementById('x-filter')
  const submitButton = document.getElementById('submit-button');
  const allContentWrapper = document.getElementById('all-content-wrapper');

  document.addEventListener('click', () => {
    if (event.target.classList.contains('add-question-button') && event.target.parentNode.parentNode.previousSibling.previousSibling.classList.contains('questions-wrapper-y')) {
      document.querySelector('.each-question-input-y').style.display = 'none';
      document.querySelector('.search-questions-wrapper-y').style.display = 'none';
      const question = {
        _id: event.target.parentNode.id,
        name: event.target.parentNode.childNodes[0].innerHTML
      };
      usedQuestionIds.push(question._id);
      event.target.parentNode.remove();
      addQuestion('add', question, document.querySelector('.questions-wrapper-y'));
    }

    else if (event.target.classList.contains('add-question-button') && event.target.parentNode.parentNode.previousSibling.previousSibling.classList.contains('questions-wrapper-x')) {
      document.querySelector('.each-question-input-x').style.display = 'none';
      document.querySelector('.search-questions-wrapper-x').style.display = 'none';
      const question = {
        _id: event.target.parentNode.id,
        name: event.target.parentNode.childNodes[0].innerHTML
      };
      usedQuestionIds.push(question._id);
      event.target.parentNode.remove();
      addQuestion('add', question, document.querySelector('.questions-wrapper-x'));
    }

    if (event.target.classList.contains('remove-question-button') && event.target.parentNode.parentNode.nextSibling.classList.contains('each-question-input-y')) {
      document.querySelector('.each-question-input-y').style.display = 'flex';
      document.querySelector('.search-questions-wrapper-y').style.display = 'flex';
      const question = {
        _id: event.target.parentNode.id,
        name: event.target.parentNode.childNodes[0].innerHTML
      };
      usedQuestionIds = usedQuestionIds.filter(id => id != question._id);
      event.target.parentNode.remove();
    }
    else if (event.target.classList.contains('remove-question-button') && event.target.parentNode.parentNode.nextSibling.classList.contains('each-question-input-x')) {
      document.querySelector('.each-question-input-x').style.display = 'flex';
      document.querySelector('.search-questions-wrapper-x').style.display = 'flex';
      const question = {
        _id: event.target.parentNode.id,
        name: event.target.parentNode.childNodes[0].innerHTML
      };
      usedQuestionIds = usedQuestionIds.filter(id => id != question._id);
      event.target.parentNode.remove();
    }
  })

  submitButton.addEventListener('click', () => {
    if (allContentWrapper.childNodes[1]) {
      allContentWrapper.childNodes[1].remove()
    }
    const data = {
      firstQuestionId: document.querySelectorAll('.each-search-question')[0].id,
      secondQuestionId: document.querySelectorAll('.each-search-question')[1].id,
    }
    serverRequest('/comparisons/filters', 'POST', data, (res) => {
      if (!res.error) {
        const xLabels = []
        const xAxisTotalValue = [];
        const eachXAxisYChoices = [];
        Object.entries(res).forEach(item => {
          xLabels.push(item[0]);
          xAxisTotalValue.push(item[1].val);
          eachXAxisYChoices.push(item[1].yChoicesArray);
        })
        const randomColors = []
        eachXAxisYChoices[0].forEach(arr => {
          const randomColor = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
          randomColors.push(randomColor);
        })
        const graphMainWrapper = document.createElement('div');
        graphMainWrapper.classList.add('graph-main-wrapper');
        const eachGraph = document.createElement('div');
        eachGraph.classList.add('each-graph');
        const eachGraphHeader = document.createElement('div');
        eachGraphHeader.classList.add('each-graph-header')
        const eachGraphHeaderTitle = document.createElement('div');
        eachGraphHeaderTitle.classList.add('each-graph-header-title')
        const eachBarGraphContent = document.createElement('div');
        eachBarGraphContent.classList.add('each-bar-graph-content');
        const barGraphBackgroundWrapper = document.createElement('div');
        barGraphBackgroundWrapper.classList.add('bar-graph-background-wrapper')
        const barColumnsWrapper = document.createElement('div');

        const graphLegends = document.createElement('div');
        graphLegends.classList.add('graph-legends');
        
        var j = 0;
        eachXAxisYChoices[0].forEach(choice => {
          const eachLegend = document.createElement('div');
          eachLegend.classList.add('each-legend');
          const eachLegendBox = document.createElement('div')
          eachLegendBox.style.backgroundColor = randomColors[j]
          eachLegendBox.classList.add('each-legend-box');
          const eachLegendSpan = document.createElement('span')
          eachLegend.appendChild(eachLegendBox);
          eachLegend.appendChild(eachLegendSpan);
          eachLegendSpan.innerHTML = Object.keys(choice)[0];
          eachLegendSpan.classList.add('each-legend-span')
          graphLegends.appendChild(eachLegend);
          j++;
        })

        allContentWrapper.appendChild(graphMainWrapper);
        graphMainWrapper.appendChild(eachGraph);
        eachGraph.appendChild(eachGraphHeader);
        graphMainWrapper.appendChild(graphLegends)
        eachGraphHeader.appendChild(eachGraphHeaderTitle);

        eachGraphHeaderTitle.innerHTML = graphTitle.value;
        eachGraph.appendChild(eachBarGraphContent);
        eachBarGraphContent.appendChild(barGraphBackgroundWrapper)

        const rowNumStart = Math.max(...xAxisTotalValue) / 5

        for (let i = 0; i <= Math.max(...xAxisTotalValue); i+=rowNumStart) {
          const eachBackgroundRow = document.createElement('div');
          const eachBackgroundRowSpan = document.createElement('span');
          const eachBackgroundRowHr = document.createElement('hr');

          eachBackgroundRow.appendChild(eachBackgroundRowSpan)
          eachBackgroundRow.classList.add('each-background-row')
          eachBackgroundRowSpan.innerHTML = i.toFixed(1);
          
          eachBackgroundRow.appendChild(eachBackgroundRowHr);
          barGraphBackgroundWrapper.appendChild(eachBackgroundRow)
        }

        eachBarGraphContent.appendChild(barColumnsWrapper);
        barColumnsWrapper.classList.add('bar-graph-columns-wrapper');

        for (let i = 0; i < xLabels.length; i++) {
          const eachLabel = xLabels[i];

          const eachColumnWrapper = document.createElement('div');
          eachColumnWrapper.classList.add('each-column-wrapper');

          const eachBar = document.createElement('div');
          eachBar.classList.add('each-bar')
          const eachBarLabel = document.createElement('div');
          eachBarLabel.classList.add('each-bar-label')
          eachBarLabel.innerHTML = eachLabel;

          eachColumnWrapper.appendChild(eachBar);
          eachColumnWrapper.appendChild(eachBarLabel)
          const barHeight = xAxisTotalValue[i] / Math.max(...xAxisTotalValue) * 91

          eachBar.style.height = barHeight + '%';

          var n = 0;
          eachXAxisYChoices[i].forEach(eachYChoice => {
            const eachBarSection = document.createElement('div');
            eachBarSection.classList.add('bar-each-section');
            
            eachBarSection.style.height = eachYChoice[Object.keys(eachYChoice)[0]] / xAxisTotalValue[i] * 100 + '%'
            eachBarSection.style.backgroundColor = randomColors[n];
            eachBar.appendChild(eachBarSection)

            eachBarSection.addEventListener('mouseover', () => {
              eachBarSection.style.boxShadow = '0 2px 4px 2px ' + eachBarSection.style.backgroundColor
              graphLegends.childNodes.forEach(legend => {
                if (legend.childNodes[0].style.backgroundColor === eachBarSection.style.backgroundColor) {
                  legend.childNodes[0].style.boxShadow = '1px 1px 2px 2px ' + eachBarSection.style.backgroundColor
                  legend.childNodes[1].style.fontWeight = 'bold'
                }
              })
            })

            eachBarSection.addEventListener('mouseleave', () => {
              eachBarSection.style.boxShadow = 'initial'
              graphLegends.childNodes.forEach(legend => {
                if (legend.childNodes[0].style.backgroundColor === eachBarSection.style.backgroundColor) {
                  legend.childNodes[0].style.boxShadow = 'initial'
                  legend.childNodes[1].style.fontWeight = 'initial'
                }
              })
            })

            n++;
          })

          barColumnsWrapper.appendChild(eachColumnWrapper)
        }
      }
    })
  })

  yFilter.oninput = event => {
    const filters = {}, options = {skip: 0, limit: 20};

    if (event.target.value.trim().length)
      filters.name = event.target.value.trim();
    if (usedQuestionIds.length)
      filters.not_id = usedQuestionIds;

    serverRequest('/campaigns/questions' + createQueryFromFiltersAndOptions(filters, options), 'GET', {}, res => {
      if (!res.success) {
        if (res.error)
          return alert('An unknown error occured. Error message: ' + res.error);
        return alert('An unknown error occured.');
      } else {
        if (res.questions.length) {
          yFilter.nextSibling.innerHTML = '';
          res.questions.forEach(question => {
            if (question.choices !== null)
              addQuestion('search', question, yFilter.nextSibling)
          });
        } else {
          yFilter.nextSibling.innerHTML = 'No questions found';
        }
      }
    });
  }
  xFilter.oninput = event => {
    const filters = {}, options = {skip: 0, limit: 20};

    if (event.target.value.trim().length)
      filters.name = event.target.value.trim();
    if (usedQuestionIds.length)
      filters.not_id = usedQuestionIds;

    serverRequest('/campaigns/questions' + createQueryFromFiltersAndOptions(filters, options), 'GET', {}, res => {
      if (!res.success) {
        if (res.error)
          return alert('An unknown error occured. Error message: ' + res.error);
        return alert('An unknown error occured.');
      } else {
        if (res.questions.length) {
          xFilter.nextSibling.innerHTML = '';
          res.questions.forEach(question => {
            if (question.choices !== null)
              addQuestion('search', question, xFilter.nextSibling)
          });
        } else {
          xFilter.nextSibling.innerHTML = 'No questions found';
        }
      }
    });
  }
}