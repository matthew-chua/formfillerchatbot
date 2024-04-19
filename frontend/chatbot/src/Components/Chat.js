import { useEffect, useState, useCallback } from "react";
import "./Chatpage.css"
import Code from "./Code";
import axios from "axios";
import {marked} from 'marked';
function Chat() {
    const [count, setCount] = useState(0)
    const [messages, setMessages] = useState([
        {"from": "AI", "content": "Hello! What do you need a form for?"}
    ])
    const [curtext, setCurtext] = useState("");
    const [boxheight, setBoxheight] = useState("30px");
    useEffect(() => {
        if (Math.ceil(curtext.length / 72) < 7) {
          setBoxheight(String(Math.floor(curtext.length / 72) * 15 + 30) + "px");
        } else {
          setBoxheight(7 * 15 + 30);
        }
      }, [curtext]);
    
    useEffect(
        ()=>{
            console.log("messages", messages)
        },
        [messages]
    )
    const get_form = useCallback(
        (array) => {
            axios
            .post(
              "http://127.0.0.1:5000/get_form",
              {
                message: curtext,
              },
              {
                headers: {
                  "content-type": "application/json",
                },
              }
            )
            .then((response) => {
              console.log(response);
              array.push({ "from": "AI", "content": "The form to fill is: " + response.data["reply"] });
              console.log("array", array);
              var newarray = [...array]
              setMessages(newarray);
            });
        },
        [messages]
      );

    function handlekeydown(e){
        if (e.key === "Enter") {
            e.preventDefault();
        var newarray = [...messages, { role: "user", content: curtext }];
        setMessages(newarray)
        // Reset your input
        document.getElementById("textarea").value = "";
        setCurtext("");
        if(count == 0){
            get_form(newarray)
        }
    }
        }
    
    return ( 

            <div className="chat">
      <div className="chat-content">
        <div className="message-box">
          {messages.map((message) => {
            console.log(message);
            return message["role"] === "system" ? null : (
              <>
                <hr className="message-divider"></hr>
                <div className="message-area">
                  <div className="message-content">
                      <Code
                        contents={message["content"].replaceAll("```", "")}
                      />
                    {/* {message["content"].includes("{") ? (
                    ) : (
                      <> {message["content"]} </>
                    )} */}
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
        ></textarea>
      </div>
    </div>

     );

        }
export default Chat;