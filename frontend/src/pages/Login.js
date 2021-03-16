import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {Button} from '@material-ui/core'
import {login} from '../redux/actions/authAction'
import {useDispatch} from 'react-redux'

function Login() {
    const initialState = {email : "", password : ""}
    const [userData, setUserData] = useState(initialState)
    const {email, password} = userData

    const dispatch = useDispatch()


    const handleChangeInput = e => {
        const {name, value} = e.target
        setUserData({...userData, [name] : value})
    }

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(login(userData))
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" value={email} placeholder="Email" onChange={handleChangeInput}  />
                <input type="password" name="password" value={password} placeholder="Password" onChange={handleChangeInput}  />
                <Button type="submit">submit</Button>
            </form>
        </div>
    )
}

export default Login
