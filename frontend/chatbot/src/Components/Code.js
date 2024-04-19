import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function Code(props) {
  // const codeString = '(num) => num + 1';

  return (
    <div>
      <SyntaxHighlighter         customStyle={{
                      margin: 0,
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-wrap',
                      boxShadow: '0px 2px 4px rgba(50,50,93,.1)',
                      width: '800px', 
                      textWrap: 'wrap'
        }}
 language="latex" style={docco}>
        {props.contents}
      </SyntaxHighlighter>
    </div>
  );
}
