interface Events {
  keypress: (
    key:
      | string
      | {
          ctrl?: boolean;
          meta?: boolean;
          name?: string;
          shift?: boolean;
        }
  ) => void;
  type: (text: string) => void;
}
export const pressEnter = async (events: Events) => {
  events.keypress('enter');
  await Promise.resolve();
};

/** Helper function to clear input text */
export const clearInput = async (events: Events, text: string) => {
  for (let i = 0; i < text.length; i++) {
    events.keypress('backspace');
  }
  await Promise.resolve();
};

export const navigateToOption = async (events: Events, index: number) => {
  for (let i = 0; i < index; i++) {
    events.keypress('down');
  }
  await Promise.resolve();
};
