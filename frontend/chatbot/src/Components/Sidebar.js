import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
// import './sidebar.css'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";
const drawerWidth = 400;
const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      backgroundColor: "white",
      color: 'white'
    },
  }));
function Sidebar({forms}) {
    const [formlist, setformlist] = useState(forms)
    console.log(forms)
    const handleChange = (e) =>{
    let res = []
    for (let i = 0; i < forms.length; i++) {
        if(forms[i]["name"].includes(e.target.value) || forms[i]["details"].includes(e.target.value)){
            res.push(forms[i])
        }
  }
  setformlist(res)
    }
    return ( 
    <StyledDrawer className='sidebar'variant="permanent" anchor="left">
        <div className="sidebar">
            <h1>List of Forms</h1>
            <textarea placeholder="search" onChange={(e)=>{handleChange(e)}}>

            </textarea>
            {
                formlist.map(
                    (form) => {
                        return(
                            <div className="form"> 
                                <h3>{form["name"]}</h3>
                                <div>{form["details"]}</div>
                            </div>
                        )
                    }
                )
            }
        </div>
    </StyledDrawer> 
    );
}

export default Sidebar;