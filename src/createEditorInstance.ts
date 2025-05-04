import { FlagEditor } from './FlagEditor';
import * as prompts from './prompts';

export async function createEditorInstance() {
  // Use the static factory method to create and initialize the editor with all dependencies
  // The type is now directly inferred from the prompts module
  const editorInstance = await FlagEditor.create({ prompts });

  console.log(editorInstance);
  // Run the editor flow
  await editorInstance.run();

  return editorInstance;
}
