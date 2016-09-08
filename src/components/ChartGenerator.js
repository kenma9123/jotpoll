import range from 'lodash/range';
import isEmpty from 'lodash/isEmpty';

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getQuestionPollData = (question) => {
  // console.log("Current selected", selected);
  let polls = [];

  return new Promise((resolve, reject) => {
    // generate the poll bars, based on the options
    let optionsArr = [];
    if (question.type === 'control_dropdown' || question.type === 'control_radio') {
      optionsArr = question.options.split('|');
    } else if (question.type === 'control_rating' || question.type === 'control_scale') {
      let count = ('stars' in question) ? question.stars : question.scaleAmount;
      let label = ('stars' in question) ? 'Star': 'Rate';
      optionsArr = range(Number(count)).reduce((valueArr, index) => {
        let val = `${index + 1} ${label + ((index > 0) ? 's' : '')}`;
        valueArr.push(val);
        return valueArr;
      }, []);
    }

    optionsArr.forEach((option, index) => {
      polls.push({
        // ...poll.defaultItem,
        label: option,
        value: getRandomInt(1, 100) // dynamic
      });
    });

    resolve(polls);
  });
};

const ChartGenerator = (chart, poll, questions, options = {}) => {

  return new Promise((resolve, reject) => {
    let labels = [];
    let datasets = {
      data: []
    };

    poll.items.forEach((item) => {
      labels.push(item.label);
      datasets.data.push(item.value);
    });

    // rest of the options
    datasets = [{
      ...datasets,
      label: questions.selected.text,
      backgroundColor: poll.items.map((item) => item.style.backgroundColor),
      // borderColor: poll.items.map((item) => item.style.borderColor),
      // borderWidth: poll.items.map((item) => item.style.borderWidth),
      hoverBackgroundColor: poll.items.map((item) => item.style.hoverBackgroundColor),
      // hoverBorderColor: poll.items.map((item) => item.style.hoverBorderColor)
    }];

    // global options
    if (isEmpty(options)) {
      options = {
        legend: { display: false },
        scales: {
          xAxes: [{
            ticks: {
              min: 0,
              max: 100
            },
            scaleLabel: {
              display: true,
              labelString: 'Percentage (%)'
            }
          }]
        }
      };
    }

    // console.log(labels, datasets, options);
    resolve({labels, datasets, options});
  });
};

export default ChartGenerator;
