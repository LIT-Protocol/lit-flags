import type { EnvironmentEntry, Environments, FlagEntry } from '../../src/types';

import { FlagEditor } from '../../src/FlagEditor';

describe('FlagEditor.flagEntry', () => {
  // Mock for Date constructor to control timestamps
  const mockDate = new Date('2023-01-01T00:00:00.000Z');
  const mockDateISOString = mockDate.toISOString();

  // Save the original Date implementation
  const originalDate = global.Date;

  beforeEach(() => {
    // Mock Date constructor and toISOString method
    global.Date = jest.fn(() => mockDate) as unknown as DateConstructor;
    global.Date.now = jest.fn(() => mockDate.getTime());
    mockDate.toISOString = jest.fn(() => mockDateISOString);
  });

  afterEach(() => {
    // Restore the original Date implementation
    global.Date = originalDate;
  });

  test('should create a new flag entry with environments enabled as specified', () => {
    // Arrange
    const environments: Environments = {
      DEV: 'dev',
      PROD: 'prod',
      STAGING: 'staging',
    };

    const flagEditor = new FlagEditor({
      commands: {} as any,
      environments,
      flagsState: {},
      userEditing: 'testUser',
    });

    const environmentsEnabledIn = ['dev', 'prod']; // Enable in dev and prod, not in staging

    // Act
    const result = flagEditor.flagEntry({
      environmentsEnabledIn,
      flagEntry: undefined,
      userEditing: 'testUser',
    });

    // Assert
    // Check result structure
    expect(result).toMatchObject({
      createdAt: mockDateISOString,
      createdBy: 'testUser',
      dev: {
        enabled: true,
        lastEditedAt: mockDateISOString,
        lastEditedBy: 'testUser',
      },
      prod: {
        enabled: true,
        lastEditedAt: mockDateISOString,
        lastEditedBy: 'testUser',
      },
      staging: {
        enabled: false,
        lastEditedAt: mockDateISOString,
        lastEditedBy: 'testUser',
      },
    });
  });

  test('should update an existing flag entry with new environment settings', () => {
    // Arrange
    const environments: Environments = {
      DEV: 'dev',
      PROD: 'prod',
      STAGING: 'staging',
    };

    const existingFlagEntry: FlagEntry = {
      createdAt: '2022-12-01T00:00:00.000Z',
      createdBy: 'originalUser',
      dev: {
        enabled: false,
        lastEditedAt: '2022-12-01T00:00:00.000Z',
        lastEditedBy: 'originalUser',
      },
      prod: {
        enabled: false,
        lastEditedAt: '2022-12-01T00:00:00.000Z',
        lastEditedBy: 'originalUser',
      },
      staging: {
        enabled: true,
        lastEditedAt: '2022-12-01T00:00:00.000Z',
        lastEditedBy: 'originalUser',
      },
    };

    const flagEditor = new FlagEditor({
      commands: {} as any,
      environments,
      flagsState: {},
      userEditing: 'testUser',
    });

    const environmentsEnabledIn = ['dev', 'staging']; // Change dev to true, keep staging true, keep prod false

    // Act
    const result = flagEditor.flagEntry({
      environmentsEnabledIn,
      flagEntry: existingFlagEntry,
      userEditing: 'testUser',
    });

    // Assert
    // Original creation metadata should be preserved
    expect(result.createdAt).toBe('2022-12-01T00:00:00.000Z');
    expect(result.createdBy).toBe('originalUser');

    // Check environment entries
    // Dev changed from false to true - should update timestamps and user
    expect(result.dev).toEqual({
      enabled: true,
      lastEditedAt: mockDateISOString,
      lastEditedBy: 'testUser',
    });

    // Staging unchanged (still true) - should keep original timestamps and user
    expect(result.staging).toEqual({
      enabled: true,
      lastEditedAt: '2022-12-01T00:00:00.000Z',
      lastEditedBy: 'originalUser',
    });

    // Prod unchanged (still false) - should keep original timestamps and user
    expect(result.prod).toEqual({
      enabled: false,
      lastEditedAt: '2022-12-01T00:00:00.000Z',
      lastEditedBy: 'originalUser',
    });
  });

  test('should handle undefined userEditing by using "unknown"', () => {
    // Arrange
    const environments: Environments = {
      DEV: 'dev',
    };

    const flagEditor = new FlagEditor({
      commands: {} as any,
      environments,
      flagsState: {},
      userEditing: null,
    });

    // Act
    const result = flagEditor.flagEntry({
      environmentsEnabledIn: ['dev'],
      flagEntry: undefined,
      userEditing: null,
    });

    // Assert
    expect(result.createdBy).toBe('unknown');
    expect((result.dev as EnvironmentEntry).lastEditedBy).toBe('unknown');
  });

  test('should handle existing entries with missing environment properties', () => {
    // Arrange
    const environments: Environments = {
      DEV: 'dev',
      STAGING: 'staging',
    };

    // Create an incomplete flag entry (missing staging property)
    const incompleteFlagEntry = {
      createdAt: '2022-12-01T00:00:00.000Z',
      createdBy: 'originalUser',
      dev: {
        enabled: true,
        lastEditedAt: '2022-12-01T00:00:00.000Z',
        lastEditedBy: 'originalUser',
      },
      // staging is missing
    } as FlagEntry;

    const flagEditor = new FlagEditor({
      commands: {} as any,
      environments,
      flagsState: {},
      userEditing: 'testUser',
    });

    // Act
    const result = flagEditor.flagEntry({
      environmentsEnabledIn: ['dev', 'staging'],
      flagEntry: incompleteFlagEntry,
      userEditing: 'testUser',
    });

    // Assert
    // Dev should remain unchanged since enabled status didn't change
    expect(result.dev).toEqual({
      enabled: true,
      lastEditedAt: '2022-12-01T00:00:00.000Z',
      lastEditedBy: 'originalUser',
    });

    // Staging should be created with current timestamp and user
    expect(result.staging).toEqual({
      enabled: true,
      lastEditedAt: mockDateISOString,
      lastEditedBy: 'testUser',
    });
  });

  test('should preserve additional properties from existing flag entry', () => {
    // Arrange
    const environments: Environments = {
      DEV: 'dev',
    };

    // Flag entry with an additional property (notes)
    const flagEntryWithNotes = {
      createdAt: '2022-12-01T00:00:00.000Z',
      createdBy: 'originalUser',
      dev: {
        enabled: true,
        lastEditedAt: '2022-12-01T00:00:00.000Z',
        lastEditedBy: 'originalUser',
        notes: 'Important flag for feature X',
      } as EnvironmentEntry & { notes: string },
    };

    const flagEditor = new FlagEditor({
      commands: {} as any,
      environments,
      flagsState: {},
      userEditing: 'testUser',
    });

    // Act
    const result = flagEditor.flagEntry({
      environmentsEnabledIn: ['dev'],
      flagEntry: flagEntryWithNotes,
      userEditing: 'testUser',
    });

    // Assert
    // Check if notes property is preserved
    expect((result.dev as any).notes).toBe('Important flag for feature X');
  });
});
