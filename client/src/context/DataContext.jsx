import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DataContext = createContext()

export const useAuth = () => useContext(DataContext);

export const DataProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [projects, setprojects] = useState([])
   

    const navigate = useNavigate()



    const fetchUser = async () => {
        try{
            setLoading(true)
            const res = await axios.get('https://apiforge-ml87.onrender.com/api/me', {
                withCredentials: true
            })
            setUser(res.data)
            setprojects(res.data.projects)
                 
        } catch {
            setUser(null)
            setprojects([])
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        await axios.get('https://apiforge-ml87.onrender.com/api/auth/logout',{
            withCredentials: true
        })
        setUser(null)
        navigate('/login')
    }

    useEffect(()=> {
        fetchUser()
    },[])

    return ( 
        <DataContext.Provider
            value={{user, setUser, logout, loading, setLoading, projects, setprojects, fetchUser}}>
            {children}
        </DataContext.Provider>
    )
}

