import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './DataContext';



const CurrentContext = createContext()

export const useCurrent = () => useContext(CurrentContext);

export const CurrentProvider = ({children}) => {
    const [openProject, setOpenProject] = useState(null)
    const [routes, setRoutes] = useState(null)
    const [openRoute, setOpenRoute] = useState(null)
    
    const {setLoading} = useAuth()

    const fetchRoutes = async () => {
        try{
                setLoading(true)
                const res = await axios.post('http://localhost:3000/api/routes', {
                projectId: openProject._id,
                withCredentials: true
            })
            setRoutes(res.data)
            
        } catch (err){
            console.log(err)
            setRoutes(null)
        } finally {
            setLoading(false)
        }
    }

useEffect(() => {
    if (openProject) {
        setLoading(true);
        fetchRoutes();
    } else {
        setRoutes(null); // 
    }
    return () => setOpenProject(null);
}, [openProject]);


    return ( 
        <CurrentContext.Provider
            value={{setOpenProject, openProject, routes, setOpenRoute, openRoute, fetchRoutes}}>
            {children}
        </CurrentContext.Provider>
    )

}