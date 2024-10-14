import {
  EventType,
  KeyboardEvents,
  TimeEvents,
  type Action,
  type ReservedWord,
} from "../types/script";

const keyboardEvents = Object.values(KeyboardEvents);
const timeEvents = Object.values(TimeEvents);
const reservedWords = [...keyboardEvents, ...timeEvents];

type Mapping = {
  [key: string]: number;
};

const keyboardMapping: Mapping = {
  KEY_LEFT_CTRL: 0x80,
  KEY_LEFT_SHIFT: 0x81,
  KEY_LEFT_ALT: 0x82,
  KEY_LEFT_GUI: 0x83,
  KEY_RIGHT_CTRL: 0x84,
  KEY_RIGHT_SHIFT: 0x85,
  KEY_RIGHT_ALT: 0x86,
  KEY_RIGHT_GUI: 0x87,
  KEY_TAB: 0xb3,
  KEY_CAPS_LOCK: 0xc1,
  KEY_BACKSPACE: 0xb2,
  KEY_RETURN: 0xb0,
  KEY_MENU: 0xed,
  KEY_INSERT: 0xd1,
  KEY_DELETE: 0xd4,
  KEY_HOME: 0xd2,
  KEY_END: 0xd5,
  KEY_PAGE_UP: 0xd3,
  KEY_PAGE_DOWN: 0xd6,
  KEY_UP_ARROW: 0xda,
  KEY_DOWN_ARROW: 0xd9,
  KEY_LEFT_ARROW: 0xd8,
  KEY_RIGHT_ARROW: 0xd7,
  KEY_ESC: 0xb1,
  KEY_F1: 0xc2,
  KEY_F2: 0xc3,
  KEY_F3: 0xc4,
  KEY_F4: 0xc5,
  KEY_F5: 0xc6,
  KEY_F6: 0xc7,
  KEY_F7: 0xc8,
  KEY_F8: 0xc9,
  KEY_F9: 0xca,
  KEY_F10: 0xcb,
  KEY_F11: 0xcc,
  KEY_F12: 0xcd,
  KEY_F13: 0xf0,
  KEY_F14: 0xf1,
  KEY_F15: 0xf2,
  KEY_F16: 0xf3,
  KEY_F17: 0xf4,
  KEY_F18: 0xf5,
  KEY_F19: 0xf6,
  KEY_F20: 0xf7,
  KEY_F21: 0xf8,
  KEY_F22: 0xf9,
  KEY_F23: 0xfa,
  KEY_F24: 0xfb,
};

interface rawAction {
  name: string;
  parameters: string[];
}

export const compile = (script: string): Action[] => {
  const scriptLines = script.split("\n");
  const actions: Action[] = [];

  scriptLines.forEach((line) => {
    if (line.startsWith("#") || line.trim() === "") {
      return;
    }

    const [name, ...parameters] = line.split(/[\s,]+/);
    if (!reservedWords.includes(name as ReservedWord)) {
      throw new Error(`Invalid action: ${name}`);
    }

    const rawAction = { name, parameters };

    if (keyboardEvents.includes(name as KeyboardEvents)) {
      actions.push(processKeyboardEvent(rawAction));
    } else if (timeEvents.includes(name as TimeEvents)) {
      actions.push(processTimeEvent(rawAction));
    } else {
      actions.push({
        ...rawAction,
        type: EventType.UNKNOWN,
        name: rawAction.name as ReservedWord,
      });
    }
  });

  return actions;
};

const processKeyboardEvent = (action: rawAction): Action => {
  const [key, ...modifiers] = action.parameters;
  let keyCode;

  if (/^[a-zA-Z]$/.test(key)) {
    keyCode = key.toUpperCase().charCodeAt(0);
  } else if (keyboardMapping[`KEY_${key.toUpperCase()}`]) {
    keyCode = keyboardMapping[`KEY_${key.toUpperCase()}`];
  } else {
    throw new Error(`Invalid key: ${key}`);
  }

  return {
    name: action.name as KeyboardEvents,
    type: EventType.KEYBOARD,
    parameters: [keyCode, ...modifiers],
  };
};

const processTimeEvent = (action: rawAction): Action => {
  const [time] = action.parameters;
  const delay = parseInt(time, 10);

  if (isNaN(delay)) {
    throw new Error(`Invalid time: ${time}`);
  }

  return {
    name: action.name as TimeEvents,
    type: EventType.TIME,
    parameters: [delay],
  };
};
