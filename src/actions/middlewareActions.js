import Color from 'color';

import range from 'lodash/range';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import has from 'lodash/has';

export const getPercentage = (num, amount) => {
  if (!num) {
    return 0;
  }

  return (num / amount) * 100;
};

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateQuestionPollData = (question) => {
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

    optionsArr.forEach((option, key) => {
      polls.push({
        key: key + 1,
        label: option,
        value: getRandomInt(1, 100) // dynamic
      });
    });

    if (polls.length > 0) {
      resolve(polls);
    } else {
      reject();
    }
  });
};

export const generateChartData = (polls, label) => {

  return new Promise((resolve, reject) => {
    let labels = [];
    let datasets = {
      data: []
    };

    polls.forEach((item) => {
      labels.push(item.label);
      datasets.data.push(item.value);
    });

    // rest of the options
    datasets = [{
      ...datasets,
      label,
      backgroundColor: polls.map((item) => item.style.backgroundColor),
      borderColor: polls.map((item) => item.style.borderColor),
      borderWidth: 1,
      hoverBackgroundColor: polls.map((item) => item.style.hoverBackgroundColor),
      hoverBorderColor: polls.map((item) => item.style.hoverBorderColor)
    }];

    // console.log(labels, datasets);
    if (labels.length > 0) {
      resolve({labels, datasets});
    } else {
      reject();
    }
  });
};

// results converter for old and new chart schema
export const ConvertOptions = (options, style) => {

  return new Promise((resolve, reject) => {
    if (!isObject(options)) {
      reject();
    }

    // old options has the two props
    if (has(options, 'common.scale') && has(options, 'common.marker')) {
      let newOptions = {...options};
      // old options, we need to convert it
      // merge with default items
      newOptions.bars = newOptions.bars.map((bar) => {
        if (bar) {
          return {
            ...style,
            backgroundColor: bar.bgcolor,
            hoverBackgroundColor: Color(bar.bgcolor).lighten(0.1).hexString(),
            borderColor: bar.bgcolor,
            hoverBorderColor: Color(bar.bgcolor).lighten(0.1).hexString()
          };
        }
      });

      // remove the common props
      delete newOptions.common;

      // convert the chart to horizantal bar by default
      newOptions.type = 'horizontalBar';

      // resolve
      resolve(newOptions);
    } else {
      // probably new options, no need
      resolve(options);
    }
  });
};
