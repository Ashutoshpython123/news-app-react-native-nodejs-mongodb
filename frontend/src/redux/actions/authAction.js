import { postDataAPI } from '../../fetchData'


export const TYPES = {
    AUTH: 'AUTH'
}

export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        const res = await postDataAPI('login', data)
        console.log(data, res)
        dispatch({
            type: 'NOTIFY',
            payload: {
                token : res.data.access_token,
                user : res.data.user
            }
        })

        localStorage.setItem("firstlogin")
        dispatch({
            type: 'NOTIFY',
            payload: {
                success : res.data.msg
            }
        })
    } catch (err) {
        dispatch({
            type: 'NOTIFY',
            payload: {
                error: err.response.data.msg
            }
        })
    }
}