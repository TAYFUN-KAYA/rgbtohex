import * as vscode from "vscode";
import { SidebarProvider } from "./sideBarProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "rgbtohex" is now active!');

  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "myextension-sidebar",
      sidebarProvider
    )
  );

  let disposable = vscode.commands.registerCommand(
    "rgbtohex.helloWorld",
    () => {
      vscode.window.showInformationMessage(
        "RGBTOHEX! Open Left Side Bar Panel and enjoy use !!!"
      );
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
