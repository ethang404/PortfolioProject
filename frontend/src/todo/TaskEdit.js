import {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jwt_decode from "jwt-decode";
export default function TaskEdit(){
    const {id} = useParams();
    //Send to this component a object form homepage->The task you clicked on VIA props. To get old data...Should fix required field issue?
    //Also weird task_due and isCompleted errors with types? idk...Look back on this trip ethan-remember when you typed this in incheon airport?
    //Almost home <3
    let navigate = useNavigate()
    let [userID, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens'))['user_id'] : null)
    const [taskDetails,setTaskDetails] = useState({
        id: parseInt(id),
        task_name: "",
        task_info: "",
        task_due: "2022-07-27",
        isCompleted: "",
        taskOwner: userID
    });
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setTaskDetails((prevState) => ({ ...prevState, [name]: value }));
        console.log(taskDetails)
    };
    useEffect( () => {
    console.log(typeof taskDetails.id, taskDetails.id)
    console.log(typeof taskDetails.task_name, taskDetails.task_name)
    console.log(typeof taskDetails.task_info, taskDetails.task_info)
    console.log(typeof taskDetails.task_due, taskDetails.task_due)
    console.log(typeof taskDetails.isCompleted, taskDetails.isCompleted)
    console.log(typeof taskDetails.taskOwner, taskDetails.taskOwner) })

    async function handleSubmit(){//Make Fetch Request here
        
        let response = await fetch('http://127.0.0.1:8000/api/updateTask/', {
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + JSON.parse(localStorage.getItem('accessToken'))
                },
                body: JSON.stringify(taskDetails)
        })
        if(response.ok){
            alert('Task Successfully Updated!')
            navigate('/Project/To-do/Dashboard')
        }
        else{
            console.log("error")
        }

    }

    return(
        <div>
            <h1>Task Edit Page!</h1>
            <div className="Login">
			<form onSubmit={handleSubmit}>
				<label>
					Task Name:
					<input
						type="text"
						name="task_name"
						value={taskDetails.task_name}
						onChange={onChangeHandler}
					/>
				</label>
				<label>
					Task Info:
					<input
						type="text"
						name="task_info"
						value={taskDetails.task_info}
						onChange={onChangeHandler}
					/>
				</label>
                
                
				<input type="submit" value="Login" />
			</form>
			
		</div>
        </div>
    )
}