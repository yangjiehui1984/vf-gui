// whoa, no typescript and no compilation!

const LibManager = {
    libs: {},

    coreLibPath: `https://cdn.jsdelivr.net/npm/typescript@${window.CONFIG.TSVersion}/lib/`,

    getReferencePaths(input) {
        const rx = /<reference path="([^"]+)"\s\/>/;
        return (input.match(new RegExp(rx.source, "g")) || []).map(s => {
            const match = s.match(rx);
            if (match && match.length >= 2) {
                return match[1];
            } else {
                throw new Error(`Error parsing: "${s}".`);
            }
        });
    },

    basename(url) {
        const parts = url.split("/");
        if (parts.length === 0) {
            throw new Error(`Bad url: "${url}"`);
        }
        return parts[parts.length - 1];
    },

    addLib: async function (path, ...args) {
        if (path.indexOf("http") === 0) {
            return this._addRemoteLib(path, ...args);
        }
        return this._addCoreLib(path, ...args);
    },

    _addCoreLib: async function (fileName, ...args) {
        return this._addRemoteLib(`${this.coreLibPath}${fileName}`, ...args);
    },

    _addRemoteLib: async function (
        url,
        stripNoDefaultLib = true,
        followReferences = true,
    ) {
        const fileName = this.basename(url);
        console.log("addRemoteLib", fileName, url);
        if (this.libs[fileName]) {
            return;
        }

        UI.toggleSpinner(true);
        const res = await fetch(url);
        if (res.status === 404) {
            console.log(
                `Check https://cdn.jsdelivr.net/npm/typescript@${window.CONFIG.TSVersion}/lib/`,
            );
        }
        const rawText = await res.text();

        UI.toggleSpinner(false);

        const text = stripNoDefaultLib
            ? rawText.replace('/// <reference no-default-lib="true"/>', "")
            : rawText;

        if (followReferences) {
            const paths = this.getReferencePaths(text);
            if (paths.length > 0) {
                console.log(`${fileName} depends on ${paths.join(", ")}`);
                for (const path of paths) {
                    await this._addCoreLib(path, stripNoDefaultLib, followReferences);
                }
            }
        }

        const lib = monaco.languages.typescript.typescriptDefaults.addExtraLib(
            text,
            fileName,
        );

        console.groupCollapsed(`Added '${fileName}'`);
        console.log(text);
        console.groupEnd();

        this.libs[fileName] = lib;

        return lib;
    },
};

async function main() {
    //默认编译参数
    const defaultCompilerOptions = {
        noImplicitAny: true,
        strictNullChecks: true,
        strictFunctionTypes: true,
        strictPropertyInitialization: true,
        noImplicitThis: true,
        noImplicitReturns: true,

        alwaysStrict: true,
        allowUnreachableCode: false,
        allowUnusedLabels: false,

        downlevelIteration: false,
        noEmitHelpers: false,
        noLib: false,
        noStrictGenericChecks: false,
        noUnusedLocals: false,
        noUnusedParameters: false,

        esModuleInterop: true,
        preserveConstEnums: false,
        removeComments: false,
        skipLibCheck: false,

        experimentalDecorators: false,
        emitDecoratorMetadata: false,

        target: monaco.languages.typescript.ScriptTarget.ES2016,
        jsx: monaco.languages.typescript.JsxEmit.None,
    };
    //参数值转换
    const urlDefaults = Object.entries(defaultCompilerOptions).reduce(
        (acc, [key, value]) => {
            if (params.has(key)) {
                const urlValue = params.get(key);

                if (urlValue === "true") {
                    acc[key] = true;
                } else if (urlValue === "false") {
                    acc[key] = false;
                } else if (!isNaN(parseInt(urlValue, 10))) {
                    acc[key] = parseInt(params.get(key), 10);
                }
            }

            return acc;
        },
        {},
    );

    console.log("Url defaults", urlDefaults);

    const compilerOptions = Object.assign(
        {},
        defaultCompilerOptions,
        urlDefaults,
    );

    const sharedEditorOptions = {
        minimap: { enabled: false },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        lineNumbers:window.CONFIG.lineNumbers
    };

    const State = {
        inputModel: null,
        initWorker: true,
        jsScriptContent: ""
    };

    let inputEditor;


    function createFile(compilerOptions) {
        return monaco.Uri.file(
            "input." +
            (compilerOptions.jsx === monaco.languages.typescript.JsxEmit.None
                ? "ts"
                : "tsx")
        )
    }

    window.UI = {
        tooltips: {},

        shouldUpdateHash: false,
        //弹出提示
        showFlashMessage(message) {
            const node = document.querySelector(".flash");
            const messageNode = node.querySelector(".flash__message");

            messageNode.textContent = message;

            node.classList.toggle("flash--hidden", false);
            setTimeout(() => {
                node.classList.toggle("flash--hidden", true);
            }, 1000);
        },

        fetchTooltips: async function () {
            try {
                this.toggleSpinner(true);
                const res = await fetch(`${window.CONFIG.baseUrl}schema/tsconfig.json`);
                const json = await res.json();
                this.toggleSpinner(false);

                for (const [propertyName, property] of Object.entries(
                    json.definitions.compilerOptionsDefinition.properties.compilerOptions
                        .properties,
                )) {
                    this.tooltips[propertyName] = property.description;
                }
            } catch (e) {
                console.error(e);
                // not critical
            }
        },

        renderVersion() {
            const node = document.querySelector("#version");
            const childNode = node.querySelector("#version-current");

            childNode.textContent = `${window.CONFIG.VFUIVersion}`;

            node.style.opacity = 1;
            node.classList.toggle("popup-on-hover", true);

            this.toggleSpinner(false);
        },

        toggleSpinner(shouldShow) {
            document
                .querySelector(".spinner")
                .classList.toggle("spinner--hidden", !shouldShow);
        },

        console() {
            if (!window.ts) {
                return;
            }

            console.log(`Using TypeScript ${window.ts.version}`);

            console.log("Available globals:");
            console.log("\twindow.ts", window.ts);
            console.log("\twindow.client", window.client);
        },

        selectExample: async function (exampleName) {
            try {
                const res = await fetch(
                    `${window.CONFIG.baseUrl}examples/${exampleName}.ts`,
                );
                const code = await res.text();
                location.hash = `example/${exampleName}`;
                window.CONFIG.CurExampleName = exampleName;
                UI.shouldUpdateHash = false;
                UI.setValue(window.CONFIG.CurExampleName, code);
                UI.shouldUpdateHash = true;
            } catch (e) {
                console.log(e);
            }
        },

        setValue(className, classStr) {

            //ES6+ 强行删除首行import
            classStr = classStr.trim();
            if (classStr.substr(0, 26).indexOf("import") !== -1) {
                classStr = classStr.substr(classStr.indexOf("\n"));
            }
            classStr = classStr.replace(/export default/, "");
            classStr = classStr.replace("../src/index", "").trim();
            State.inputModel.setValue(classStr);
            State.initWorker = true;
        },

        setCodeFromHash: async function () {
            if (location.hash.startsWith("#example")) {
                const exampleName = location.hash.replace("#example/", "").trim();
                UI.selectExample(exampleName);
            }
        },

        refreshOutput() {
            UI.shouldUpdateHash = false;
            State.inputModel.setValue(State.inputModel.getValue());
            UI.shouldUpdateHash = true;
        },

        updateURL() {
            const diff = Object.entries(defaultCompilerOptions).reduce(
                (acc, [key, value]) => {
                    if (value !== compilerOptions[key]) {
                        acc[key] = compilerOptions[key];
                    }

                    return acc;
                },
                {},
            );
                
            const hash = `code/${window.CONFIG.CurExampleName}/${LZString.compressToEncodedURIComponent(
                State.inputModel.getValue(),
            )}`;

            const urlParams = Object.assign({}, diff);

            ["lib", "ts"].forEach(param => {
                if (params.has(param)) {
                    urlParams[param] = params.get(param);
                }
            });

            if (Object.keys(urlParams).length > 0) {
                const queryString = Object.entries(urlParams)
                    .map(([key, value]) => {
                        return `${key}=${encodeURIComponent(value)}`;
                    })
                    .join("&");

                window.history.replaceState(
                    {},
                    "",
                    `${window.CONFIG.baseUrl}?${queryString}#${hash}`,
                );
            } else {
                window.history.replaceState({}, "", `${window.CONFIG.baseUrl}#${hash}`);
            }
        },

        updateCompileOptions(name, value) {
            console.log(`${name} = ${value}`);

            Object.assign(compilerOptions, {
                [name]: value,
            });

            console.log("Updaring compiler options to", compilerOptions);
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
                compilerOptions,
            );

            let inputCode = inputEditor.getValue();
            State.inputModel.dispose();
            State.inputModel = monaco.editor.createModel(
                inputCode,
                "typescript",
                createFile(compilerOptions)
            );
            inputEditor.setModel(State.inputModel);

            UI.refreshOutput();

            UI.updateURL();
        },

        getInitialCode() {
            if (location.hash.startsWith("#code")) {
                const classNameAndCode = location.hash.replace("#code/", "").trim();
                const code = classNameAndCode.split("/")[1];
                window.CONFIG.CurExampleName = classNameAndCode.split("/")[0];
                return LZString.decompressFromEncodedURIComponent(code);
            }

            return `
const message: string = 'hello world';
console.log(message);
  `.trim();
        },
    };

    window.MonacoEnvironment = {
        getWorkerUrl: function (workerId, label) {
            return `worker.js?version=${window.CONFIG.MonacoVersion}`;
        },
    };

    for (const path of window.CONFIG.extraLibs) {
        await LibManager.addLib(path);
    }

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
        compilerOptions,
    );

    State.inputModel = monaco.editor.createModel(
        UI.getInitialCode(),
        "typescript",
        createFile(compilerOptions)
    );

    inputEditor = monaco.editor.create(
        document.getElementById("input"),
        Object.assign({ model: State.inputModel }, sharedEditorOptions),
    );

    function updateOutput() {
        monaco.languages.typescript.getTypeScriptWorker().then(worker => {
            worker(State.inputModel.uri).then((client, a) => {
                if (typeof window.client === "undefined") {
                    UI.renderVersion();

                    // expose global
                    window.client = client;
                    UI.console();
                }

                client.getEmitOutput(State.inputModel.uri.toString()).then(result => {
                    State.jsScriptContent = result.outputFiles[0].text;
                    if (State.initWorker) {
                        runJavaScript();
                    }
                    State.initWorker = false;
                });
            });
        });

        if (UI.shouldUpdateHash) {
            UI.updateURL();
        }
    }

    UI.setCodeFromHash();


    UI.fetchTooltips().then(() => {

    });

    updateOutput();
    inputEditor.onDidChangeModelContent(() => {
        updateOutput();
    });
    UI.shouldUpdateHash = true;

    /* Run */
    function runJavaScript() {
        if (State.jsScriptContent === "") {
            UI.showFlashMessage("please wait...");
            return;
        }
        var CurExampleName = window.CONFIG.CurExampleName;
        if (CurExampleName == null) {
            return;
        }
        setTimeout(() => {
            window.testApplication.loadClass(CurExampleName, State.jsScriptContent);
        }, 0);
    }

    inputEditor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
        runJavaScript,
    );

    // if the focus is outside the editor
    window.addEventListener(
        "keydown",
        event => {
            const S_KEY = 83;
            if (event.keyCode == S_KEY && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();

                window.clipboard.writeText(location.href.toString()).then(
                    () => UI.showFlashMessage("URL is copied to the clipboard!"),
                    e => {
                        alert(e);
                    },
                );
            }

            if (
                event.keyCode === 13 &&
                (event.metaKey || event.ctrlKey) &&
                event.target instanceof Node &&
                event.target === document.body
            ) {
                event.preventDefault();
                runJavaScript();
            }
        },
        false,
    );
}
