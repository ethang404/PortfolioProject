import {Outlet, Navigate} from 'react-router-dom'
import jwt_decode from "jwt-decode";
export default function PrivateRoute(){
    const accessToken = jwt_decode(localStorage.getItem('accessToken'))
    console.log("This is my private route: ",accessToken)
    const auth = {'token':accessToken}
    return(
        auth.token ? <Outlet/> : <Navigate to="/Project/YoutubeApp/Login"/>
        
    )
}