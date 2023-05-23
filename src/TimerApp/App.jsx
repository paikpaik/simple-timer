/*
  *****************************************************************************
  *                         redux만을 이용한 상태관리                          *
  ***************************************************************************** 
*/
/*
import React, { useEffect, useRef, useMemo } from "react";
import { useDispatch, Provider, useSelector } from "react-redux";
import { createStore } from "redux";
import styled from "styled-components";

const initialState = {
  isRunning: false,
  startTime: 10,
  currentTime: 10,
  duration: 1000,
};

const palette = ["hotpink", "aquamarine", "coral", "cyan"];

// reducer를 정의, action에 따른 state 변경 로직을 구현.
const reducer = (state, action) => {
  switch (action.type) {
    case "timer/reset": {
      // currentTime을 초기화하고, 타이머를 중단.
      return {
        ...state,
        currentTime: state.startTime,
        isRunning: false
      }
    }

    case "timer/start": {
      // 타이머를 시작.
      return { ...state, isRunning: true }
    }

    case "timer/stop": {
      // 타이머를 중단.
      return { ...state, isRunning: false }
    }

    case "timer/tickTimer": {
      // 시간을 1초씩 줄이고 시간이 0이 되면 타이머를 멈춤.
      return {
        ...state,
        currentTime: state.currentTime - 1,
        isRunning: state.currentTime - 1 > 0
      }
    }

    case "timer/setDuration": {
      // duration을 세팅.
      return {
        ...state,
        duration: action.payload.duration,
      }
    }

    case "timer/setStartTime": {
      // startTime을 세팅.
      return {
        ...state,
        startTime: action.payload.startTime,
      }
    }

    default:
      return state;
  }
};

// action creator를 생성.
const reset = () => ({ type: 'timer/reset' })
const start = () => ({ type: 'timer/start' })
const stop = () => ({ type: 'timer/stop' })
const tickTimer = () => ({ type: 'timer/tickTimer' })
const setDuration = (duration) => ({ type: 'timer/setDuration', payload: { duration } })
const setStartTime = (startTime) => ({ type: 'timer/setStartTime', payload: { startTime } })

const store = createStore(reducer, initialState);

const durationSelector = (state) => state.duration;
const currentTimeSelector = (state) => state.currentTime;
const isRunningSelector = (state) => state.isRunning;
const startTimeSelector = (state) => state.startTime;

export default function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

function Counter() {
  const dispatch = useDispatch()
  // startTime을 조정하는 input에 대한 ref.
  const startTimeInputRef = useRef();
  // duration을 조정하는 input에 대한 ref.
  const durationInputRef = useRef();

  const duration = useSelector(durationSelector);
  const currentTime = useSelector(currentTimeSelector);
  const isRunning = useSelector(isRunningSelector);
  const startTime = useSelector(startTimeSelector);

  // 액션을 dispatch.
  const handleStop = () => dispatch(stop())
  const handleReset = () => dispatch(reset())
  const handleTimer = () => dispatch(start())

  const isResetted = useMemo(() => currentTime === startTime, [
    startTime,
    currentTime,
  ]);

  const isDone = useMemo(() => currentTime === 0, [currentTime]);

  useEffect(() => {
    // isRunning이 true일 경우, 타이머를 동작.
    if (!isRunning) return;

    let timerId = null;

    const tick = () => {
      timerId = setTimeout(() => {
        if (!isRunning) return;
        dispatch(tickTimer())
        tick();
      }, duration);
    };

    tick();

    return () => clearTimeout(timerId);
  }, [duration, isRunning]);

  return (
    <Container>
      <Time duration={duration} currentTime={currentTime} stopped={!isRunning}>
        {currentTime}
      </Time>

      <Button onClick={handleStop} disabled={!isRunning}>
        Stop
      </Button>

      <Button onClick={handleReset} disabled={isRunning || isResetted}>
        Reset
      </Button>

      <Button onClick={handleTimer} disabled={isRunning || isDone}>
        Start
      </Button>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const duration = Number(durationInputRef.current.value);
          // state의 duration 값을 변경.
          console.log("Duration : ", duration);
          // duration을 변경한 경우, 타이머를 리셋.
          dispatch(setDuration(duration))
        }}
      >
        <label htmlFor="duration">Duration(ms)</label>
        <input
          ref={durationInputRef}
          id="duration"
          type="text"
          name="duration"
          defaultValue={duration}
        />
        <input type="submit" value="Set" disabled={isRunning} />
      </Form>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          // state의 startTime 값을 변경.
          const startTime = Number(startTimeInputRef.current.value);
          console.log("startTime : ", startTime);
          // startTime을 변경한 경우, 타이머를 리셋.
          dispatch(setStartTime(startTime))
        }}
      >
        <label htmlFor="duration">Start Time(sec)</label>
        <input
          ref={startTimeInputRef}
          id="start-time"
          type="text"
          name="start-time"
          defaultValue={startTime}
        />
        <input type="submit" value="Set" disabled={isRunning} />
      </Form>
    </Container>
  );
}
*/
/*
  *****************************************************************************
  *                      redux-toolkit을 이용한 상태관리                       *
  ***************************************************************************** 
*/
import React, { useRef, useMemo, useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import styled from "styled-components";

const initialState = {
  isRunning: false,
  startTime: 10,
  currentTime: 10,
  duration: 1000,
};

const palette = ["hotpink", "aquamarine", "coral", "cyan"];

// reducers 를 완성.
const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    reset(state, action){
      state.isRunning = false
      state.currentTime = state.startTime
    },
    start(state, action){
      state.isRunning = true
    },
    stop(state, action){
      state.isRunning = false
    },
    tick(state, action){
      state.currentTime -= 1
      state.isRunning = state.currentTime > 0
    },
    setDuration(state, action){
      state.duration = action.payload.duration
    },
    setStartTime(state, action){
      const { startTime } = action.payload
      state.startTime = startTime
      state.currentTime = startTime
    },
  },
});

// reducer를 slice에서 생성한 리듀서로 변경.
const store = configureStore({ reducer: timerSlice.reducer });

export default function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

const {
  start,
  stop,
  reset,
  setDuration,
  setStartTime,
  tick: tickTimer
} = timerSlice.actions

const durationSelector = (state) => state.duration;
const currentTimeSelector = (state) => state.currentTime;
const isRunningSelector = (state) => state.isRunning;
const startTimeSelector = (state) => state.startTime;

function Counter() {
  const startTimeInputRef = useRef();
  const durationInputRef = useRef();

  const dispatch = useDispatch();

  const duration = useSelector(durationSelector);
  const currentTime = useSelector(currentTimeSelector);
  const isRunning = useSelector(isRunningSelector);
  const startTime = useSelector(startTimeSelector);

  const handleStop = () => dispatch(stop());
  const handleReset = () => dispatch(reset());
  const handleTimer = () => dispatch(start());

  useEffect(() => {
    if (!isRunning) return;
    let timerId = null;

    const tick = () => {
      timerId = setTimeout(() => {
        if (!isRunning) return;
        dispatch(tickTimer());
        tick();
      }, duration);
    };

    tick();

    return () => clearTimeout(timerId);
  }, [dispatch, duration, isRunning]);

  const isResetted = useMemo(() => currentTime === startTime, [
    startTime,
    currentTime,
  ]);

  const isDone = useMemo(() => currentTime === 0, [currentTime]);

  return (
    <Container>
      <Time duration={duration} currentTime={currentTime} stopped={!isRunning}>
        {currentTime}
      </Time>

      <Button onClick={handleStop} disabled={!isRunning}>
        Stop
      </Button>

      <Button onClick={handleReset} disabled={isRunning || isResetted}>
        Reset
      </Button>

      <Button onClick={handleTimer} disabled={isRunning || isDone}>
        Start
      </Button>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const duration = Number(durationInputRef.current.value);
          dispatch(setDuration({ duration }));
          dispatch(reset());
        }}
      >
        <label htmlFor="duration">Duration(ms)</label>
        <input
          ref={durationInputRef}
          id="duration"
          type="text"
          name="duration"
          defaultValue={duration}
        />
        <input type="submit" value="Set" disabled={isRunning} />
      </Form>

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const startTime = Number(startTimeInputRef.current.value);
          dispatch(setStartTime({ startTime }));
          dispatch(reset());
        }}
      >
        <label htmlFor="duration">Start Time(sec)</label>
        <input
          ref={startTimeInputRef}
          id="start-time"
          type="text"
          name="start-time"
          defaultValue={startTime}
        />
        <input type="submit" value="Set" disabled={isRunning} />
      </Form>
    </Container>
  );
}


const Button = styled.button`
  display: block;
  padding: 8px;
  margin: 4px 0;
`;

const Time = styled.div`
  box-sizing: border-box;

  margin: 12px 0;
  width: 400px;
  height: 400px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 100%;

  transition: background-color ${({ duration }) => duration}ms;
  background-color: ${({ currentTime }) =>
    palette[currentTime % palette.length]};

  font-size: 2rem;
  font-weight: bold;
  color: black;

  opacity: ${({ stopped }) => (stopped ? 0.4 : 1)};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  margin-top: 8px;

  label {
    display: inline-block;
    min-width: 120px;
  }

  input[type="text"] {
    margin-right: 8px;
  }
`;