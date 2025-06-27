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

    const fetchRoutes = async (projectId) => {
        try {
            setLoading(true)
            const res = await axios.post('http://localhost:3000/api/routes', {
                projectId: projectId,
                withCredentials: true
            })
            setRoutes(res.data)
        } catch (err) {
            console.log(err)
            setRoutes([]) // Set empty array instead of null to avoid confusion
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (openProject) {
            fetchRoutes(openProject._id);
        } else {
            setRoutes(null);
        }
        
        // Cleanup function - don't reset openProject here as it causes issues
        // The component should handle setting openProject appropriately
    }, [openProject]);

    // Clear routes when openProject changes or is cleared
    const clearContext = () => {
        setOpenProject(null);
        setRoutes(null);
        setOpenRoute(null);
    }

    return ( 
        <CurrentContext.Provider
            value={{
                setOpenProject, 
                openProject, 
                routes, 
                setRoutes,
                setOpenRoute, 
                openRoute, 
                fetchRoutes,
                clearContext
            }}>
            {children}
        </CurrentContext.Provider>
    )
}