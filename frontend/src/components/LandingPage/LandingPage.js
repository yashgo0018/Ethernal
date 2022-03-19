import React from 'react';
import Header from '../Header/Header'
import { Container, Row, Col } from "react-bootstrap";
import "./LandingPage.css"
import crypto from '../../assets/images/crypto.png';
import donation from '../../assets/images/wallet.png';
import nft from '../../assets/images/nft.png';
import filecoin from '../../assets/svg/filecoin-logo.svg';
import alchemy from '../../assets/svg/alchemy.svg';
import polygon from '../../assets/svg/polygon-logo.svg';
import metamask from '../../assets/svg/metamask-fox.svg';
// import theGraph from '../../assets/svg/theGraph_logo.svg';
import Steps from './Steps';
import Team from './Team';


const tech_logo = [alchemy, polygon, filecoin, metamask];
const LandingPage = () => {
  return (
    <>
      <div className="landing_page_wrapper">
        <div className="landing_page_skew">
          <div className="landing_page_antiskew p-3">
            <Header />
            <Container className="mt-4">
              <Row className="align-items-center justify-content-center">
                <Col md={7} className="d-flex flex-column align-items-center ">
                  <div className="heading_landing_page display-4">
                    <span>A supporter is worth a</span>
                    <br />
                    <span>thousand followers.</span>
                  </div>
                  <div className='desc_landing_page my-4'>
                    <img src={donation} alt="donation" />
                    <span>
                      Accept donations from all over the world in seconds right into your wallet.
                    </span>
                    <br />
                    <img src={nft} alt="nft" />
                    <span>
                      Sell your NFTs to your fans. It’s easier than you think.
                    </span>
                  </div>
                </Col>
                <Col md={4} className="">
                  <div className="landing_page_img d-flex justify-content-start">
                    <img src={crypto} alt="coin_image" />
                  </div>
                </Col>
              </Row>
              <Row className="text-center mt-5 mb-5 tech_heading">
                <Col md={12}>
                  <span>Technology</span>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="antiskew tech_used_wrapper">
            <Container fluid>
              <Row className="mx-auto justify-content-center">
                {
                  tech_logo.map((logo,index) => {
                    return (
                      <Col md={2} className="tech_used" key={index}>
                        <div className="d-flex justify-content-center shadow-lg p-1">
                          <img alt="logo" src={logo} width={160} height={100} />
                        </div>
                      </Col>
                    )
                  })
                }
              </Row>
            </Container>
          </div>
          <div>
            <Container className="intro_video mt-5" fluid>
              <Row className="mt-3 d-flex align-items-start justify-content-center mx-auto inner_intro_video">
                <Col md={6} className="d-flex flex-column align-items-start">
                  <span className="mb-3">How it works..</span>
                  <Steps />
                </Col>
                <Col md={3} className="d-flex flex-column align-items-center mx-2 px-4">
                  <iframe width="350" height="240" src="https://www.youtube.com/embed/GWUwFDFOipo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  <p className='text-muted text-center mt-2'>Refer this video for complete explanation.</p>
                </Col>
              </Row>
            </Container>
          </div>
          <div className='team'>
            <Container>
              <Row className="m-0">
                <Team />
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  )
}

export default LandingPage