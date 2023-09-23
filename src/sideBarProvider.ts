import * as vscode from "vscode";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Listen for messages from the Sidebar component and execute action
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        // case "onSomething: {
        //     // code here...
        //     break;
        // }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    );

    // Use a nonce to only allow a specific script to be run.
    // const nonce = getNonce();

    return `<!DOCTYPE html>
  			<html lang="en">
  			<head>
  				<meta charset="UTF-8">
  				
  				<meta name="viewport" content="width=device-width, initial-scale=1.0">
  				<link href="${styleResetUri}" rel="stylesheet">
  				<link href="${styleVSCodeUri}" rel="stylesheet">
                  <link href="${styleMainUri}" rel="stylesheet">
                <style>
                  body {
                    height: 99.6vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    align-content: center;
                    border-top: 0.2px solid rgb(255, 68, 0);
                    border-bottom: 0.2px solid rgb(0, 247, 255);
                    border-left: 0.2px solid yellow;
                    border-right: 0.2px solid rgb(0, 255, 102);
                }
                ::placeholder {
                    
                    
                  }
                  #convertBtn:hover {
                    background-color: rgb(159, 42, 0) !important;
                  }
                  #inputRGB:focus {
                    outline: none;
                  }
                </style>
                <style>
                    #snackbar {
                        visibility: hidden;
                        min-width: 250px;
                        margin-left: -140px;
                        background-color: #5300d8;
                        color: #fff;
                        text-align: center;
                        border-radius: 2px;
                        padding: 16px;
                        position: fixed;
                        z-index: 1;
                        left: 50%;
                        bottom: 30px;
                        font-size: 17px;
                    }

                    #snackbar.show {
                        visibility: visible;
                        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
                        animation: fadein 0.5s, fadeout 0.5s 2.5s;
                    }
                </style>
  			</head>
              <body>
              <script>
                window.onload = () => {
                    const button = document.getElementById("convertBtn");
                    const input = document.getElementById("inputRGB");
                    const container = document.getElementById("showHex");
                    button.addEventListener("click", function () {
                        container.innerHTML = "";
                            const value = input.value;
                            if (value) {
                                const rgbText = value.split(",");
                                let r = rgbText[0] ? Number(rgbText[0]) : 0;
                                let g = rgbText[1] ? Number(rgbText[1]) : 0;
                                let b = rgbText[2] ? Number(rgbText[2]) : 0;
                                const result = hex(r, g, b);
                                if (result) {
                                console.log(result);
                                const Pelement = document.createElement("p");
                                const node = document.createTextNode(result);
                                Pelement.appendChild(node);
                                Pelement.style.color = "white";
                                Pelement.style.marginRight = "10px";
                                Pelement.style.padding = "10px";
                                Pelement.style.backgroundColor = "rgb(43, 43, 43)";
                                container.appendChild(Pelement);
                                // Create a button element
                                const ButtonNew = document.createElement("button");
                                ButtonNew.innerText = "Copy";
                                ButtonNew.style.backgroundColor = "yellow";
                                ButtonNew.style.height = "35px";
                                ButtonNew.style.width = "60px";
                                ButtonNew.style.border = "none";
                                ButtonNew.style.borderRadius = "5px";
                                container.appendChild(ButtonNew);
                                ButtonNew.addEventListener("click", () => {
                                    navigator.clipboard.writeText(result);
                                    myFunction();
                                });
                                }
                            }
                        });
                        function myFunction() {
                            var x = document.getElementById("snackbar");
                            x.className = "show";
                            setTimeout(function () {
                                x.className = x.className.replace("show", "");
                            }, 3000);
                            }
                            const hex = (r, g, b) => {
                            return (
                                "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
                        );
                    };
                };
            </script>

            <div
                style="
                    border-top: 2px solid rgb(255, 68, 0);
                    border-bottom: 2px solid rgb(0, 247, 255);
                    border-left: 2px solid yellow;
                    border-right: 2px solid rgb(0, 255, 102);
                    border-top-left-radius: 100px;
                    border-bottom-right-radius: 100px;
                    width: 200px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 20px;
                "
                >
                <p
                    style="
                    color: white;
                    font-weight: 700;
                    font-family: Arial, Helvetica, sans-serif;
                    "
                >
                    RGB TO HEX
                </p>
            </div>
          <div>
            <img
              style="height: 60px; width: 60px"
              src="https://cdn-icons-png.flaticon.com/512/458/458842.png"
            />
          </div>
          <input
            id="inputRGB"
            style="
              height: 35px;
              width: 160px;
              border-radius: 8px;
              border: none;
              padding-left: 10px;
              margin-top: 5px;
            "
            placeholder="rgb"
            type="text"
          />
          <button
            id="convertBtn"
            style="
              margin-top: 30px;
              width: 140px;
              height: 40px;
              border-radius: 8px;
              border: none;
              background-color: rgb(216, 58, 0);
              color: white;
              font-weight: 700;
              transition: 0.3s;
              text-align: center;
              justify-content: center;
              align-items: center;
            "
          >
            Conver To Hex
          </button>
          <div
            id="showHex"
            style="
              display: flex;
              flex-direction: row;
              margin-top: 20px;
              justify-content: center;
              align-items: center;
            "
          ></div>
          <div id="snackbar">Copied</div>
            
             
  			</body>
  			</html>`;
  }
}
