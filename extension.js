const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const fsx = require('fs-extra')

function activate(context) {
    let openTestCommand = vscode.commands.registerCommand('extension.sidetest.openTest', openTestForActiveEditor(false));
    context.subscriptions.push(openTestCommand);

    let openTestSplitCommand = vscode.commands.registerCommand('extension.sidetest.openTestSplit', openTestForActiveEditor(true));
    context.subscriptions.push(openTestSplitCommand);

    let openSourceCommand = vscode.commands.registerCommand('extension.sidetest.openSource', openSourceForActiveEditor(false));
    context.subscriptions.push(openSourceCommand);

    let openSourceSplitCommand = vscode.commands.registerCommand('extension.sidetest.openSourceSplit', openSourceForActiveEditor(true));
    context.subscriptions.push(openSourceSplitCommand);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

function openTestForActiveEditor(splitView) {
  return () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      if (!isTestFile(activeEditor.document.fileName)) {
        const testFile = getTestFile(activeEditor.document.fileName);
        if (testFile) {
          if (!fs.existsSync(testFile)) {
            if (shouldCreateTestIfMissing()) {
              fsx.mkdirsSync(path.dirname(testFile));
              fsx.outputFileSync(testFile, '');
              openFile(testFile, splitView);
            }
          } else {
            openFile(testFile, splitView);
          }
        }
      }
    }
  }
}

function openSourceForActiveEditor(splitView) {
  return () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      if (isTestFile(activeEditor.document.fileName)) {
        const sourceFile = getSourceFile(activeEditor.document.fileName);
        if (sourceFile) {
          openFile(sourceFile, splitView);
        }
      }
    }
  }
}

function getTestFile(sourceFile) {
  const sourceFileLocation = path.dirname(sourceFile);
  const sourceFileExtension = path.extname(sourceFile);
  const sourceFileName = path.basename(sourceFile, sourceFileExtension);
  
  const testSubFolder = getUnitTestSubFolder();
  const testFileLocation = testSubFolder ? path.join(sourceFileLocation, testSubFolder) : sourceFileLocation;
  const testPreExtensionSuffix = getUnitTestPreExtensionSuffix();
  const testFileName = testPreExtensionSuffix ?
      sourceFileName + "." + testPreExtensionSuffix + sourceFileExtension : sourceFileName + sourceFileExtension;
  return path.join(testFileLocation, testFileName);
}

function getSourceFile(testFile) {
  const testFileLocation = path.dirname(testFile);
  const testFileExtension = path.extname(testFile);
  const testFileName = path.basename(testFile, testFileExtension);
  
  const testSubFolder = getUnitTestSubFolder();
  const sourceFileLocation = testSubFolder ? 
    testFileLocation.replace(new RegExp(testSubFolder + '$'), "") : testFileLocation;
  const testPreExtensionSuffix = getUnitTestPreExtensionSuffix();
  const sourceFileName = testPreExtensionSuffix ?
      testFileName.replace(new RegExp("\." + testPreExtensionSuffix + '$'), "") + testFileExtension : testFileName + testFileExtension;
  return path.join(sourceFileLocation, sourceFileName);
}

function isTestFile(filename) {
  const testFileLocation = path.dirname(filename);
  const testFileExtension = path.extname(filename);
  const testFileName = path.basename(filename, testFileExtension);
    
  const testPreExtensionSuffix = getUnitTestPreExtensionSuffix();  
  const fileNameMatchesTestFileName = testPreExtensionSuffix ? testFileName.endsWith(testPreExtensionSuffix) : true;
  
  const testSubFolder = getUnitTestSubFolder();
  const fileLocationMatchesTestFileLocation = testSubFolder ?
      testFileLocation.split(path.sep).pop() === testSubFolder : true;
  return fileLocationMatchesTestFileLocation && fileNameMatchesTestFileName;
}

function openFile(filename, splitView) {
  return vscode.workspace.openTextDocument(vscode.Uri.file(filename)).then(
    (document) => vscode.window.showTextDocument(document, 
      splitView ? vscode.ViewColumn.Two : vscode.ViewColumn.One)
  )
}

function getUnitTestSubFolder() {
  return vscode.workspace.getConfiguration('sidetest').get('unitTest.subFolder');
}

function getUnitTestPreExtensionSuffix() {
  return vscode.workspace.getConfiguration('sidetest').get('unitTest.preExtensionSuffix');
}

function shouldCreateTestIfMissing() {
  return vscode.workspace.getConfiguration('sidetest').get('createTestIfMissing');
}