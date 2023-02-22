// import React from 'react';
// import { Button } from 'react-bootstrap';
// import './button.css';

// const ButtonExtend = ({children, ...props}) => <Button {...props}>{children}</Button>

// export default ButtonExtend;

import React from "react";

const ButtonExtend = React.forwardRef((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <button className={className} ref={ref} {...rest}>
      {children}
    </button>
  );
});

export default ButtonExtend;