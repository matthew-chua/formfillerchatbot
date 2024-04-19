import { useCallback, useEffect, useState } from "react";
import "./Chatpage.css";
import Code from "./Code";
import axios from "axios";
import Sidebar from "./Sidebar";
// import Box from '@mui/material/Box';
import {marked} from 'marked';

function Chatpage() {
  const [curtext, setCurtext] = useState("");
  const [boxheight, setBoxheight] = useState("30px");
  const [messages, setMessages] = useState([]);
  const [a, setA] = useState(0)
  const getMarkdown = (FORM_INPUT) => {
    if (FORM_INPUT) {
      let markdown = marked(FORM_INPUT , { sanitize: true })
      return { __html: markdown }
    }
}
const [forms, setForms] = useState([])
  useEffect(
    () => {
      axios.get("http://127.0.0.1:5000/retrieve_forms").then(
        (response) => {console.log("response", response.data["files"]); setForms(response.data["files"]); setA(1)})
      
    }, []
  )
  useEffect(() => {
    if (Math.ceil(curtext.length / 72) < 7) {
      setBoxheight(String(Math.floor(curtext.length / 72) * 15 + 30) + "px");
    } else {
      setBoxheight(7 * 15 + 30);
    }
  }, [curtext]);
  // function copytoclipboard(i){
  //   navigator.clipboard.writeText(i)
  // }

  const getResponse = useCallback(
    (curtext, newarray) => {
      console.log(newarray);
      axios
        .post(
          "http://127.0.0.1:5000/get_response",
          {
            chatters: newarray,
          },
          {
            headers: {
              "content-type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          newarray.push({ role: "chatbot", content: response.data["reply"] });
          setMessages([...newarray]);
        });
    },
    [messages]
  );
  function handlekeydown(e) {
    if (e.key === "Enter") {
      e.preventDefault();

      // Prepare the new state data but don't wait for the state to update
      var newarray = [...messages, { role: "user", content: curtext }];

      // Call setMessages to update the state
      setMessages(newarray);
      console.log(newarray);
      // Immediately call getResponse with the new array
      // This assumes getResponse does not rely on the updated state from a re-render
      getResponse(curtext, newarray);

      // Reset your input
      document.getElementById("textarea").value = "";
      setCurtext("");
    }
  }
  return (
    <div className="chat">
      {a !== 0 ? <Sidebar forms={forms}/>:null}
      <div className="chat-content">
        <div className="message-box">
          {messages.map((message) => {
            // console.log(message);
            // var j = message["content"]
            // j.replace("---", "```")
            // let x = message["content"].split("```")
            return message["role"] === "system" ? null : (
              <>
                {/* <hr className="message-divider"></hr> */}
                <div className={"message-area" + message["role"]}>
                  <div className="message-content">
                    {/* {
                      x.map(
                        (i, index) => {
                          if(index % 2 == 0){
                            return(<>{i}</>)
                          }
                          else{
                            console.log("code", i)
                            return(<>
                            <button onClick={()=> navigator.clipboard.writeText(i)}>copy to clipboard</button>
                            <Code id="code" contents={i}/>
                            </>)
                          }
                        } 
                      ) */
                    }
                    <div dangerouslySetInnerHTML={getMarkdown(message["content"])}></div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
        <textarea
          id="textarea"
          className="chat-input"
          style={{ height: boxheight }}
          onKeyDown={handlekeydown}
          onChange={(e) => setCurtext(e.target.value)}
          placeholder="Enter your query here..."
        ></textarea>
      </div>
    </div>
  );
}

export default Chatpage;
