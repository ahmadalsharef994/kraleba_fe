import React from 'react'
import './styles.css'
import 'font-awesome/css/font-awesome.min.css' 


function Footer() {
  return (
        
<footer className="footer-container">
  <div className="address">
    <p>Fashion Design SRL</p>
    <p>Address: Strada Henri Coanda, Nr. 12, Brasov, Romania</p>
    <p>Phone: +40 723 123 456</p>
  </div>
  <div className="social-media-icons">
    <a href="#">
      <div className="icon">
        <i className="fa fa-facebook-f"></i>
      </div>
    </a>
    <a href="#">
      <div className="icon">
        <i className="fa fa-twitter"></i>
      </div>
    </a>
    <a href="#">
      <div className="icon">
        <i className="fa fa-instagram"></i>
      </div>
    </a>
  </div>
  <p className="copyright">&copy; Fashion Design SRL, 2023</p>
</footer>
  )
}

export default Footer