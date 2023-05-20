import React from 'react';
import "./App.css";
import TimerApp from './TimerApp/App'
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  return (
    <Container>
      <TimerApp />
    </Container>
  );
}

export default App;