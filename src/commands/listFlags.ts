import Table from 'cli-table3';

import { EnvironmentEntry, Environments, FlagsState } from '../types';

/**
 * Displays all flags and their enabled status across environments
 *
 * @param flagsState The current state of all flags
 * @param environments The available environments
 */
export function listFlags(flagsState: FlagsState, environments: Environments): void {
  const flagNames = Object.keys(flagsState);

  if (flagNames.length === 0) {
    console.log('No flags defined yet.');
    return;
  }

  console.log('\nFeature Flags:');

  // Create the table
  const table = new Table({
    head: ['FLAG', ...Object.values(environments)],
    style: {
      border: ['gray'],
      head: ['cyan'],
    },
  });

  // Add rows for each flag
  flagNames.forEach((flagName) => {
    const flag = flagsState[flagName];
    const row = [flagName];

    Object.values(environments).forEach((env) => {
      const enabled = (flag[env] as EnvironmentEntry)?.enabled;
      const status = enabled ? '✅ ENABLED' : '❌ DISABLED';
      row.push(status);
    });

    table.push(row);
  });

  // Print the table
  console.log(table.toString());
  console.log(''); // Empty line at the end
}
