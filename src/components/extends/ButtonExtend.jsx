import React from 'react';
import { Button } from 'react-bootstrap';
import './button.css';

// const ButtonExtend = ({children, ...props}) => <Button {...props}>{children}</Button>

// export default ButtonExtend;


const ButtonExtend = React.forwardRef((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <Button className={className} ref={ref} {...rest}>
      {children}
    </Button>
  );
});

export default ButtonExtend;