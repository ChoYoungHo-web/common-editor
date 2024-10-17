import React from "react";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/dist/i18n/ko-kr";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";

import Prism from "prismjs";
import "prismjs/components/prism-clojure.js";

import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";

function App() {
  new Editor({
    el: document.querySelector("#editor") as HTMLElement,
    height: "600px",
    placeholder: "내용을 적어주세요.",
    initialEditType: "wysiwyg",
    hideModeSwitch: true,
    theme: "dark",
    language: "ko",
    plugins: [[codeSyntaxHighlight, { highlighter: Prism }]],
  });
  return <></>;
}

export default App;
