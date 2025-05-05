export const pressEnter = async (events: any) => {
  events.keypress('enter');
  await Promise.resolve();
};

/** Helper function to clear input text */
export const clearInput = async (events: any, text: string) => {
  for (let i = 0; i < text.length; i++) {
    events.keypress('backspace');
  }
  await Promise.resolve();
};

export const navigateToOption = async (events: any, index: number) => {
  for (let i = 0; i < index; i++) {
    events.keypress('down');
  }
  await Promise.resolve();
};
