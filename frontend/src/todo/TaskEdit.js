import {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Checkbox from '@mui/material/Checkbox';
import DateTimePicker from 'react-datetime-picker';
export default function TaskEdit(){
    const {id} = useParams();
    //Send to this component a object form homepage->The task you clicked on VIA props. To get old data...Should fix required field issue?
    //Also weird task_due and isCompleted errors with types? 
    let navigate = useNavigate()
    let [userID, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens'))['user_id'] : null)

    const [taskDetails,setTaskDetails] = useState({
        id: parseInt(id),
        task_name: "",
        task_info: "",
        task_due: new Date(),
        isCompleted: false,
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
        console.log(typeof taskDetails.taskOwner, taskDetails.taskOwner) 
    })

    async function handleSubmit(e){//Make Fetch Request here
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/api/updateTask/', {
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + JSON.parse(localStorage.getItem('accessToken'))
                },
                body: JSON.stringify(taskDetails)
        })
        if(response.ok){
            console.log("everything is good")
            alert('Task Successfully Updated!')
            navigate('/Project/To-do/Dashboard')
        }
        else{
            console.log("Something went wrong")
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
                        required
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
                <Checkbox checked={taskDetails.isCompleted} onClick={(event) => {setTaskDetails({...taskDetails, isCompleted: event.target.checked})}} />

                <DateTimePicker onChange={(date) => setTaskDetails({ ...taskDetails, ["task_due"]: date })} value={taskDetails.task_due} />
				<input type="submit" value="TaskEdit" />
			</form>
            <div>
                <h4>Below is my task Details: </h4>
                {JSON.stringify(taskDetails)}
            </div>
			
		</div>
        </div>
    )
}