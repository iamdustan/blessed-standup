/**
 * This file is *extremely* sloppy and could use a full refactor/cleanup
 * It's quite stateful and depends on global values internally, lacking any
 * sense of encapsulation or flow control.
 */
import Spreadsheet from 'edit-google-spreadsheet';
import google from 'googleapis';
import * as cache from './utils/cache';

const OPTIONS = {};
if (cache.get('SHEET_ID')) {
  OPTIONS.spreadsheetId = cache.get('SHEET_ID');
} else {
  OPTIONS.spreadsheetName = 'Blessed Standup';
}

const PULSE_TIME = 60 * 1000 * 5; // 5 minutes

const today = new Date();
const formattedDate = today.toLocaleDateString();
let spreadsheet;
let rawData = {};
let data = [];
let teamMembers = [];

const API = {
  _status: 'NULL',
  _timeout: null,

  _events: {
    load: [],
    change: [],
  },

  on(event, fn) {
    if (!API._events[event]) {
      console.warn(
        'WARNING: Attempting to add an unsupported API listener: `%s`',
        event
      );
      return;
    }
    if (event === 'load' && API._status === 'LOADED') {
      process.nextTick(() => (data));
    } else {
      API._events[event].push(fn);
    }
  },

  fire(event, data) {
    API._events[event].forEach(fn => fn(data));
  },

  load(credentials) {
    if (API._status !== 'NULL') return;

    OPTIONS.oauth2 = credentials;
    API._status = 'INITIALIZING';

    let teamLoaded = false;
    const TEAM_OPTIONS = Object.assign({}, OPTIONS, {worksheetName: 'Team'});
    if (cache.get('TEAM_WORKSHEET_ID')) {
      TEAM_OPTIONS.worksheetId = cache.get('TEAM_WORKSHEET_ID');
      delete TEAM_OPTIONS.worksheetName;
    }
    Spreadsheet.load(TEAM_OPTIONS, (err, sheet) => {
      if (err) throw err;
      cache.set('TEAM_WORKSHEET_ID', sheet.worksheetId);

      sheet.receive((err, rows, info) => {
        if (err) throw err;
        const team = toArray(rows, 1);

        teamMembers = team;
        teamLoaded = true;
      });
    });

    const STATUS_OPTIONS = Object.assign({}, OPTIONS, {worksheetName: 'Status'});
    if (cache.get('STATUS_WORKSHEET_ID')) {
      STATUS_OPTIONS.worksheetId = cache.get('STATUS_WORKSHEET_ID');
      delete STATUS_OPTIONS.worksheetName;
    }

    Spreadsheet.load(STATUS_OPTIONS, (err, sheet) => {
      if (err) throw err;
      cache.set('STATUS_WORKSHEET_ID', sheet.worksheetId);
      spreadsheet = sheet;

      API._timeout = setTimeout(API.update, PULSE_TIME);

      spreadsheet.receive((err, rows, info) => {
        if (err) throw err;

        rawData = rows;
        data = toArray(rows, 1).filter(d => d[0] === 'Date' || d[0] === formattedDate);

        // stupid arbitrary number to give the teams a chance to load
        let timeout = teamLoaded ? 0 : 1000;
        setTimeout(() => {
          API._status = 'LOADED';
          API.fire('load', data);
          API._ensureTodayIsTheDay();
        }, timeout);
      });
    });
  },

  _ensureTodayIsTheDay() {
    const PEOPLE = teamMembers.length;
    const newData = rawData
    const findToday = Object.keys(rawData).findIndex(k => (
      rawData[k][1] === formattedDate
    ));

    if (findToday !== -1) {
      return;
    }

    console.warn('Creating an entry for %s in the Sheet', formattedDate);
    const startingIndex = Math.max.apply(null, Object.keys(rawData).map(Number)) + 1;
    const names = Object.keys(rawData).slice(1, 15).reduce((names, d) => {
      if (names.indexOf(rawData[d][2]) === -1) {
        names.push(rawData[d][2]);
      }

      return names;
    }, []);

    spreadsheet.add({
      [startingIndex]: names.map(n => [formattedDate, n])
    });

    spreadsheet.send((err) => {
      if (err) console.warn(err);

      API.update()
    });
  },

  update() {
    clearTimeout(API._timeout);

    spreadsheet.receive((err, rows, info) => {
      if (err) throw err;

      rawData = rows;
      data = toArray(rows, 1).filter(d => d[0] === 'Date' || d[0] === formattedDate);
      API.fire('change', data);

      API._timeout = setTimeout(API.update, PULSE_TIME);
    });
  },

  set(human, props) {
    const activeIndex = data.findIndex(d => d[1] === human) + 1;
    const realIndex = activeIndex + Object.keys(rawData).length - 11;
    spreadsheet.add({
      [realIndex]: {
        3: props.yesterday,
        4: props.today,
        5: props.blockers,
      }
    });

    const clone = data.slice(0);
    const target = data[activeIndex - 1];
    clone[activeIndex - 1] = [target[0], target[1], 'Loading...', 'Loading...', 'Loading...'];
    API.fire('change', clone);

    spreadsheet.send((err) => {
      if (err) console.warn(err);

      API.update()
    });
  }
};

const toArray = (o, depth) => {
  const arr = [];
  for (const key in o) {
    arr[key - 1] = depth ? toArray(o[key], depth - 1) : o[key];
  }
  return arr;
};

export default API;

