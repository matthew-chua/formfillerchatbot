from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import os
from langchain.chains.conversation.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
from langchain import hub
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_openai import ChatOpenAI
from langchain.chains import ConversationChain
from api_tools import tools
import json
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import subprocess

# from forms import forms
# print("hi \n hi")
with open("forms.json", 'r+') as file:
    # Read the list from the file
        forms = json.load(file)
# prompt = ChatPromptTemplate.from_messages(
#     [
#         (
#             "system",
#             f"you are a friendly agent that helps people open forms and fill them up with their requested details. You only have access to forms {{{{forms}}}}, and shouldn't assume you have other forms. You can use your tools to open forms. you should tick boxes of selected options when options are required. Return the form to the user rather than just opening it yourself",
#         ),
#         ("user", "{input}"),
#         MessagesPlaceholder(variable_name="agent_scratchpad"),
#         MessagesPlaceholder(variable_name="chat_history")
#     ]
# )
# print(prompt)
load_dotenv()
app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# chat = ChatOpenAI(model_name="gpt-4-0125-preview", temperature=0.3, openai_api_key=os.getenv("OPENAI_API_KEY"))
chat = ChatOpenAI(model_name="gpt-4-0125-preview", temperature=0.05, openai_api_key=os.getenv("OPENAI_API_KEY"))

memory = ConversationBufferMemory(return_messages=True)
prompt = hub.pull("hwchase17/openai-tools-agent")
# print(prompt)
ag= create_openai_tools_agent(chat, tools, prompt)
agent = AgentExecutor.from_agent_and_tools(
agent=ag,
tools=tools,
llm=chat,
verbose=True,
max_iterations=5,
memory=ConversationBufferMemory(memory_key="chat_history", return_messages=True)
)
agent.invoke({"input": f"use this context for the rest of your conversation: you are a friendly agent that helps people open forms and fill them up with their requested details. This is the list of forms that exist: {forms}, and shouldn't assume you have other forms. You can use your tools to open forms. you should tick boxes of selected options when options are required. Return the form to the user rather than just opening it yourself. you shouldn't ask the user to fill the form up himself, instead, be proactive and ask for his details and fill up the form for him! however, do wait for the user to tell you which form to fill. Limit the chat to topics surrounding forms so the user does not go off track. For questions where the answer should be an exposition, ask the user for his points and write the paragraphs for him. When returning the form to the user, convert it to PDF and send him the link. If it is not a short answer question, verbosify it. do not ask for more info than required.",
})
@app.route("/")
def home():
    return "Home"



@app.route("/get_response", methods = ['POST'])
@cross_origin()
def get_response():
    subprocess.run("python3 test.py", shell=True)
    messages =  request.get_json()["chatters"]
    # print(messages)
    # print(agent({"input": messages[-1]["content"]}))
    latest = messages[-1]["content"]
    # latest  =  """you are""" + latest
    reply = agent.invoke({"input": latest})
    # tolist = json.loads(reply)
    # print(tolist)
    # print("reply", reply.replace("\n", "*"))
    # print(reply)
    response = jsonify({"reply": reply["output"]})
    # print("response", response) 
    return response, 200

@app.route("/get_form", methods = ["POST"])
@cross_origin()
def get_form():
    Formdeets = request.get_json()["message"]
    forms = [
    {"name": "registration.pdf", "use":"use to register for events"},{"name": "download.tex", "use": "use this form for anything related to applying for school"}
    ]
    chat = ChatOpenAI(model_name="gpt-4-0125-preview", temperature=0.3, openai_api_key=os.getenv("OPENAI_API_KEY"))

    conversation = ConversationChain(
    llm = chat,
    verbose=True
    )
    form = conversation(
        f"Given this list of forms {forms}, and that the user is trying to find a form for {Formdeets}, which form should he use? format your reply as ONLY the file name."
    )["response"]
    print("hi", form)
    with open(f"./files/{form}", 'r', encoding='utf-8') as file:
        # Read the contents of the file
        file_contents = file.read()
    response = jsonify({"reply": file_contents})
    return response, 200

@app.route("/update_forms", methods = ["POST"])
@cross_origin()
def update_forms():
    Formdeets = request.get_json()["message"]
    with open("forms.json", 'r+') as file:
    # Read the list from the file
        data = json.load(file)
    
        # Check if the data is a list and append the new dictionary
        if isinstance(data, list):
            data.append(Formdeets)
            
            # Move the cursor to the beginning of the file
            file.seek(0)
            
            # Write the updated list back to the file
            json.dump(data, file, indent=4)
            
            # Truncate the file to the new size
            file.truncate()
    return "ok", 200
@app.route("/retrieve_forms", methods = ["GET"])
@cross_origin()
def retrive_forms():
    with open("forms.json", 'r+') as file:
    # Read the list from the file
        data = json.load(file)
    subprocess.run("python3 test.py", shell=True)
    res = jsonify({"files": data})        
    return res, 200
if __name__ == "__main__":
    app.run(debug=True)