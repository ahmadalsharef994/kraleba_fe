import React from 'react';
import { Button } from 'react-bootstrap';
import './button.css';

const ButtonExtend = ({children, ...props}) => <Button {...props}>{children}</Button>

export default ButtonExtend;