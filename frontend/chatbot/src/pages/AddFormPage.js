import { useState } from "react";
import "./AddFormPage.css";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import axios from "axios";
export default function AddFormPage() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    // Create a storage reference from our storage service
    const storageRef = ref(storage, selectedFile.name);
    const data = {
      name: selectedFile.name,
      details: document.getElementById("formClassDescription").value,
    };
    axios
      .post(
        "http://127.0.0.1:5000/update_forms",
        { message: data },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
      .then((response) => console.log(response));
    uploadBytes(storageRef, selectedFile).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  };
  return (
    <div className="root">
      <h1>Add Form</h1>
      <p>
        Use this page to add forms to the database that the chatbot can access.
      </p>
      <div>
        Form Description
        <input type="text" id="formClassDescription" name="formClassName" />
      </div>
      <input
        type="file"
        accept=".tex"
        id="file"
        name="file"
        onChange={handleFileChange}
      />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
}
