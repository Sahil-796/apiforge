import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DataContext = createContext()

export const useAuth = () => useContext(DataContext);

export const DataProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
   

    const navigate = useNavigate()



    const fetchUser = async () => {
        try{
            const res = await axios.get('https://bfc56k0q-3000.inc1.devtunnels.ms/api/me', {
                withCredentials: true
            })
            
            setUser(res.data)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        await axios.get('https://bfc56k0q-3000.inc1.devtunnels.ms/api/auth/logout',{
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
            value={{user, setUser, logout, loading}}>
            {children}
        </DataContext.Provider>
    )
}

