import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const RouteDebugger = () => {
    const location = useLocation();
    useEffect(() => {
        console.log('Current Location:', location);
    }, [location]);
    return null;
};
export default RouteDebugger;
