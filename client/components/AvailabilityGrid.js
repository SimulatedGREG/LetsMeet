import React from 'react';
import cssModules from 'react-css-modules';
import _ from 'lodash';
import moment from 'moment';

import styles from '../styles/availability-grid.css';

class AvailabilityGrid extends React.Component {
  getDaysBetween(start, end) {
    const dates = [start];
    let currentDay = start;

    while (dates[dates.length - 1] < end) {
      currentDay = moment(currentDay).add(1, 'd')._d;
      dates.push(currentDay);
    }

    return dates;
  }

  getNumbersBetween(start, end) {
    const arr = [start];
    let currentNum = start;

    while (arr[arr.length - 1] < end) {
      currentNum++;
      arr.push(currentNum);
    }

    return arr;
  }

  render() {
    const allDates = _.flatten(this.props.dates.map(({ from, to }) =>
      this.getDaysBetween(from, to)
    ));

    const startTime = Number(this.props.times[0]);
    const endTime   = Number(this.props.times[1]);

    const allTimes = this.getNumbersBetween(startTime, endTime);

    console.log(allTimes);

    return (
      <div>
        {allDates.map((date, i) => (
          <div key={i} styleName="row">
            <div styleName="cell">
              {moment(date).format('Do MMM YYYY')}
            </div>
            {allTimes.map((time, i) => (
              <div key={i} styleName="cell">
                {time}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

AvailabilityGrid.propTypes = {
  dates: React.PropTypes.array.isRequired,
  times: React.PropTypes.array.isRequired,
};

export default cssModules(AvailabilityGrid, styles);
