import React from 'react'
import './Header.css'
import logo from '../../assets/svg/logo.svg';
// import { ethers } from 'ethers';


const Header = () => {

  const onClickHandler = () => {

    if(window.ethereum)
    {
      window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				console.log(result);
			})
			.catch(error => {
        console.log(error);			
			});
    } 
  }

  return (
    <>
      <div className="header_wrapper">
        <div className='header-content'>
          <div className="logo">
            <img src={logo} alt="logo" />
            <span>Fancrypt</span>
          </div>
          <div className="navigation">
            <div className='nav_link'>
              <a href="/whitepaper">Whitepaper</a> 
            </div>
            <div className='nav_link'>
              <a href="/whitepaper">Explore</a> 
            </div>
            <div className='nav_link'>
              <a href="/whitepaper">FAQ</a> 
            </div>
            <div className='nav_link'>
              <a href="/whitepaper">About</a> 
            </div>
            <div className='btn_signup'>
              <button onClick={onClickHandler}>Connect</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header;