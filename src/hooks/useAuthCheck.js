import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const useAuthCheck = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const checkLocalStorage = () => {
            const cookieFallback = localStorage.getItem('cookieFallback');
            if (cookieFallback === '[]' || cookieFallback === null) {
                navigate('/sign-in');
            }
        };

        checkLocalStorage();
        dispatch(checkAuthUser());
    }, [dispatch]);
};

export default useAuthCheck;
