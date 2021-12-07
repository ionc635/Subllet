import React from "react";
import styled from "styled-components";

const StyledBody = styled.div`
  color: white;
  background-color: #252a3b;
  border-radius: 10px;
  width: 32rem;
  max-width: 28rem;
  height: 10rem;
  position: fixed;
  left: 50%;
  top: 50%;
  padding: 1rem;
  transform: translate(-50%, -50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  button {
    font-size: 1rem;
    background-color: #3b3f51;
    border: 0;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    color: #ff8a00;
  }
`;
const ModalBack = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9998;
  border: 2px solid white;
`;

const AlertModal = ({ handleClick, alertMsg }) => {
  return (
    <>
      <ModalBack onClick={handleClick} />
      <StyledBody>
        <div>{alertMsg.message}</div>
        <button onClick={handleClick}>{alertMsg.button}</button>
      </StyledBody>
    </>
  );
};

export default AlertModal;