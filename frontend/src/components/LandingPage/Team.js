import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import './Team.css';
import Tanish_pic from '../../assets/images/profiles/Tanish.jpg';
import Yash_pic from '../../assets/images/profiles/Yash.jpg';
import Mohammad_pic from '../../assets/images/profiles/Mohammad.jpg';
import linkedin from '../../assets/svg/linkedin.svg';
import github from '../../assets/svg/github.svg';
import Medium from '../../assets/svg/medium_logo.svg';
import Dapplist from '../../assets/svg/dapplist.jpg';
import EtherScan from '../../assets/svg/etherscan_logo.svg';
import Coinmarketcap from '../../assets/svg/coinmarketcap_logo.svg';
import Discord from '../../assets/svg/discord_logo.svg';
import Github_large from '../../assets/svg/github_large.svg';

const profiles = [
  {
    name: "Tanish Singh Chouhan",
    profile_pic: Tanish_pic,
    desc: "Frontend Development",
    linkedin_link: 'https://www.linkedin.com/in/tanish-singh-chouhan-a78856193/',
    github_link: 'https://github.com/Tanish2000'
  },
  {
    name: "Yash Goyal",
    profile_pic: Yash_pic,
    desc: "Blockchain Development",
    linkedin_link: 'https://www.linkedin.com/in/yash-goyal-0018/',
    github_link: 'https://github.com/yashgo0018'
  },
  {
    name: "Mohammad Abbasnejad",
    profile_pic: Mohammad_pic,
    desc: "Blockchain Development",
    linkedin_link: 'https://www.linkedin.com/in/mohammad-abbasnezhad/',
    github_link: 'https://github.com/MR-Abbasnejad',
  }
]

const team_socials = [
  {
    icon: Medium,
    link: "/",
    text: "Medium",
  },
  {
    icon: Dapplist,
    link: "/",
    text: "DappList",
  },
  {
    icon: Coinmarketcap,
    link: "/",
    text: "CoinMarketCap",
  },
  {
    icon: EtherScan,
    link: "/",
    text: "Etherscan",
  },
  {
    icon: Discord,
    link: "/",
    text: "Discord",
  },
  {
    icon: Github_large,
    link: "/",
    text: "Github"
  }
]
const Team = () => {
  return (
    <Container className="team_wrapper pt-4 ">
      <Row className='my-3 mx-auto justify-content-center pb-5'>
        {
          profiles.map((profile, index) => {
            return (
              <Col md={3} className='d-flex flex-column align-items-center justify-content-center' key={index}>
                <div className="d-flex flex-column team_members">
                  <img src={profile.profile_pic} alt={profile.name + `_pic`} />
                </div>
                <div className='team_member_details pt-3'>
                  <span className="member_name">{profile.name}</span>
                  <span className="member_desc">{profile.desc}</span>
                </div>
                <div className='social_links'>
                  <a href={profile.linkedin_link} target="_blank" rel="noreferrer">
                    <img src={linkedin} alt="linkedin_icon" />
                  </a>
                  <a href={profile.github_link} target="_blank" rel="noreferrer">
                    <img src={github} alt="github_icon" />
                  </a>
                </div>
              </Col>
            )
          })
        }
        <Col md={2} className="d-flex justify-content-around align-items-center">
          <div className='team_title'>
            <div className="team_head">
              <span>Team</span>
            </div>
            <div className="team_name">
              <span>Ethy</span>
            </div>
          </div>
        </Col>
      </Row>
      <hr />
      <Row className="p-3 justify-content-center">
        <Col md={2}>
          <div className='social_title'>
            <div className="social_name">
              <span>Available at..</span>
            </div>
          </div>
        </Col>
        {
          team_socials.map((link,index) => {
            return (
              <Col md={1} key={index}>
                <div>
                  <a href={link.link} alt={`${link.text}_link`}>
                    <img src={link.icon} width={40} height={50} title={link.text} className="social_img" alt={link.text} />
                  </a>
                </div>
              </Col>
            )
          })
        }
      </Row>
      <Row className="justify-content-center">
        <Col md={12}>
          <div className="footer_text mt-3">
            <span>
              &copy; 2022 Fancrypt
            </span>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Team