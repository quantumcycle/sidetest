# VSCode Side Test

Side test is a VSCode extension that make it easy to navigate to a test file from your source file. You can either just open the test file when in a source file, or make it open in a side by side, very useful when doing TDD.

## Extension Settings

If you test files are located in the same source folder as the matching source files:

- `sidetest.unitTest.subFolder`: the subfolder to look in to find the test file for a source file. **default is null, meaning the test file is in the same folder as the source file.**

If your test files are located in a separate root folder:

- `sidetest.unitTest.rootFolder`: the root folder containing the test files (relative to workspace folder)
- `sidetest.source.rootFolder`: the root folder containing the source files (relative to workspace folder)

In either mode, you can specify the following options:

- `sidetest.unitTest.preExtensionSuffix`: the suffix to add before the file extension to find the matching test. Common suffix are 'test' and 'spec'. **Default is [spec]**
- `sidetest.createTestIfMissing`: When set to true, the test file will be created if you try to open it and it doesn't exist. **false by default**

## Commands

### Open test file

This will open the test file for the currently open source file in a new tab.

### Open test file side by side

This is the same as 'Open test file' but the test file is opened in a side-by-side view using VSCode split editor.

### Open source file

This will open the source file for the currently open test file in a new tab.

### Open source file side by side

This is the same as 'Open source file' but the source file is opened in a side-by-side view using VSCode split editor.

## Release Notes

### 1.0.0

Initial release
