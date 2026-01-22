import { useEffect, useRef } from 'react';
import { trackVisitor } from '../services/visitorsService';
import { useLocation } from 'react-router-dom';

const useVisitorTracker = (pageName) => {
    const location = useLocation();
    const hasTracked = useRef(false);

    useEffect(() => {
        // Prevent double tracking in Strict Mode or re-renders
        if (hasTracked.current) return;

        const track = async () => {
            await trackVisitor({
                path: location.pathname,
                page: pageName
            });
            hasTracked.current = true;
        };

        track();
    }, [location.pathname, pageName]);
};

export default useVisitorTracker;
