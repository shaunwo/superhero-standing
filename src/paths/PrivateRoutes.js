import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import UserContext from '../private/auth/UserContext';

/** "Higher-Order Component" for private routes.
 *
 * In routing component, use these instead of <Route ...>. This component
 * will check if there is a valid current user and only continues to the
 * route if so. If no user is present, redirects to login form.
 */

const PrivateRoutes = () => {
	const { currentUser } = useContext(UserContext);
	console.log('currentUser: ', currentUser);
	return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
