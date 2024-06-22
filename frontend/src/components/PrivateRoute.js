import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../helpers/auth';

const PrivateRoute = ({ component: Component }) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
