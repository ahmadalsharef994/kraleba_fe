import React from 'react'
import './styles.css'
import 'font-awesome/css/font-awesome.min.css' 
import logo1 from '../assets/logo1.png';


function Footer() {
  return (
        
<footer class="footer-container">
  <div class="address">
    <p>Fashion Design SRL</p>
    <p>Address: Strada Henri Coanda, Nr. 12, Brasov, Romania</p>
    <p>Phone: +40 723 123 456</p>
  </div>
  <div class="social-media-icons">
    <a href="#">
      <div class="icon">
        <i class="fa fa-facebook-f"></i>
      </div>
    </a>
    <a href="#">
      <div class="icon">
        <i class="fa fa-twitter"></i>
      </div>
    </a>
    <a href="#">
      <div class="icon">
        <i class="fa fa-instagram"></i>
      </div>
    </a>
  </div>
  <p class="copyright">&copy; Fashion Design SRL, 2023</p>
</footer>
  )
}

export default Footer