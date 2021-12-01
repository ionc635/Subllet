import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../IMG/favicon.png";
import defaultImg from "../IMG/default.png";

const NavHeader = styled.header`
  @media only screen and (min-width: 800px) {
    display: flex;
    /* justify-content: space-around; */ /* 로고, 프로필 좌우 가운데 */
    justify-content: space-between;
    background-color: #0f0f0f;
    width: 100%;
    height: 70px;
  }
  @media only screen and (max-width: 800px) {
    display: flex;
    justify-content: space-between;
    background-color: #0f0f0f;
    width: 100%;
    height: 70px;
  }
`;

const MinNavTap = styled.span`
  @media only screen and (max-width: 800px) {
    display: flex;
    flex-shrink: 0;
    span {
      display: flex;
      flex-shrink: 0;
      justify-content: space-around;
      margin-top: 2.7rem;
      :not(:last-child) {
        margin-left: 1.5rem;
      }
      :last-child {
        margin-left: 1rem;
      }
    }
    a {
      color: #ff8a00;
    }
  }
  @media only screen and (min-width: 800px) {
    display: none;
  }
`;

const MaxNavTap = styled.div`
  display: flex;
  justify-self: right;
  flex-shrink: 0;
  margin-right: 2rem;
  div {
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
    margin-left: 1rem;
    margin-top: 2.7rem;
  }
  a {
    color: #ff8a00;
  }
  @media only screen and (max-width: 800px) {
    display: none;
  }
`;

const SearchBar = styled.input`
  display: flex;
  /* margin-right: 15rem; */
  width: 35rem;
  height: 2.3rem;
  margin-left: 1.5rem;
  margin-top: 1rem;
  background-color: #000000;
  border: 1px solid #ff8a00;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  text-align: center;
  color: white;
  ::placeholder {
    font-size: 1rem;
    color: #c5c5c5;
  }
  :focus::placeholder {
    color: transparent;
  }
  @media only screen and (max-width: 1050px) and (min-width: 800px) {
    width: 15rem;
  }
  @media only screen and (max-width: 800px) {
    display: none;
  }
`;

const Font = styled.span`
  display: flex;
  color: #ff8a00;
  font-size: 3.8rem;
  margin-top: 0.5rem;
  @media only screen and (min-width: 800px) {
    margin-left: 2rem;
  }
  @media only screen and (max-width: 800px) {
    padding-right: 3.3rem;
  }
  img {
    margin-top: 0.6rem;
    width: 4rem;
    height: 3rem;
  }
  a {
    color: #ff8a00;
  }
`;

const RightNav = styled.span`
  display: flex;
  /* :hover ul {
    visibility: visible;
  } */

  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #ff8a00;
    text-align: center;
    color: #ffffff;
  }
  li:last-child {
    border-bottom: none;
  }
  li:hover {
    background-color: #ff8a00;
    opacity: 0.65;
  }
`;

const Test = styled.div`
  img {
    width: 3.7rem;
    border-radius: 2rem;
    margin: 0.4rem 1rem 0.4rem 0;

    /* margin-top: 0.4rem;
    margin-right: 1.6rem; */
  }
  :hover ul {
    visibility: visible;
  }
  ul {
    z-index: 1;
    width: 6rem;
    margin: 0;
    padding: 0;
    list-style: none;
    position: absolute;
    top: 4.3rem;
    right: 1rem;
    background-color: #000000;
    border: 1px solid #ff8a00;
    opacity: 0.8;
    visibility: hidden;
  }
`;

const Nav = () => {
  return (
    <>
      <NavHeader>
        <MinNavTap>
          <span>
            <Link to="/d">모두보기</Link>
          </span>
          <span>
            <Link to="/f">고객센터</Link>
          </span>
        </MinNavTap>
        <Font>
          <Link to="/">
            <span>Subllet</span>
          </Link>
          <img src={logo}></img>
          <SearchBar type="search" placeholder="서비스를 검색해보세요" />
        </Font>
        {true ? (
          <RightNav>
            <MaxNavTap>
              <div>
                <Link to="/d">모두보기</Link>
              </div>
              <div>
                <Link to="/f">고객센터</Link>
              </div>
            </MaxNavTap>
            <Test>
              <img alt="defaultImg" src={defaultImg} className="defaultImg" />
              <ul>
                <li>
                  <Link to="/">My Subllet</Link>
                </li>
                <li>
                  <Link to="/a">로그아웃</Link>
                </li>
              </ul>
            </Test>
          </RightNav>
        ) : (
          <div></div>
        )}
      </NavHeader>
    </>
  );
};

export default Nav;
