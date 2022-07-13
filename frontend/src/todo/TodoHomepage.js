import {Button} from '@mui/material';
import { useEffect } from 'react';
import jwt_decode from "jwt-decode";
import {useState} from 'react';
import { useNavigate } from "react-router-dom";

export default function TodoHomepage(){ 
    let [userID, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens'))['user_id'] : null)
    let [notes, setNotes] = useState([])

    let navigate = useNavigate()
    
    const getNotes = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/displayTasks/', {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + JSON.parse(localStorage.getItem('accessToken'))
                }
            })
            let data = await response.json()
            console.log(data)
    }
    useEffect(() => {
        console.log(Date.now())
        console.log(jwt_decode(localStorage.getItem('accessToken'))['exp'] * 1000)

        if(!localStorage.getItem('accessToken')){
            navigate('/Project/To-do-Login')
        }
        else if(jwt_decode(localStorage.getItem('accessToken'))['exp'] * 1000 <= Date.now()){ //if access token invalid -> refresh token.
            let refresher = async()=>{
                let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body: JSON.stringify({refresh: JSON.parse(localStorage.getItem('refreshToken'))})
                })
                let data = await response.json()
                localStorage.setItem('accessToken', JSON.stringify(data.access))
                console.log(data)
                getNotes()
            }
            refresher()
        }
        else if(jwt_decode(localStorage.getItem('refreshToken'))['exp'] * 1000 <= Date.now()){//if refreshToken has expired
            handleLogout()

        }
        else{ //if Access Token is still valid(and refresh token valid)
            getNotes()
        }

      });

    function handleLogout(){
        setUser(null)
        localStorage.removeItem('authTokens')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        navigate('/Project/To-do-Login')
    }

    return(
        <div><h1>This is my todo Homepage! Hope you enjoy!</h1>
        
        <Button onClick = {handleLogout}>Logout Here</Button>
        <div>Notes go here</div>
        </div>
    );
}