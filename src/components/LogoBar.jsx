import React from 'react';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';
import './styles.css';

const LogoBar = () => {
    return (
        <div className='logobar'>
            <div className='flex-left'>
                <img src={logo1} alt="logo1" style={{ maxHeight: '100%', maxWidth: '100%' }} />
            </div>
            <div className='flex-right'>
                <img src={logo2} alt="logo2" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                {/* , objectFit: 'cover' */}
            </div>
        </div>
    )
}
export default LogoBar;
