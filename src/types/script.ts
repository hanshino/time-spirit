export enum KeyboardEvents {
  KEY_PRESS = "KeyPress",
  KEY_UP = "KeyUp",
  KEY_DOWN = "KeyDown",
}

export enum TimeEvents {
  DELAY = "Delay",
}

export type ReservedWord = KeyboardEvents | TimeEvents;

export enum EventType {
  KEYBOARD = "Keyboard",
  TIME = "Time",
  UNKNOWN = "Unknown",
}

export interface Action {
  name: ReservedWord;
  type: EventType;
  parameters: (string | number)[];
}
