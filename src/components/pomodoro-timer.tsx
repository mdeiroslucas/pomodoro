import React, { useEffect, useState, useCallback } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/seconds-to-time';
import { Timer } from './timer';
import { Button } from './button';

const bellStart         = require('../sounds/src_sounds_bell-start.mp3');
const bellFinish        = require('../sounds/src_sounds_bell-finish.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking  = new Audio(bellFinish);

interface Props {
    PomodoroTime: number;
    shortRestTime: number;
    longRestTime: number;
    cycles: number;
}
export function PomodoroTimer(props: Props): JSX.Element {
    const [mainTime, setMainTime]                   = React.useState(props.PomodoroTime);
    const [timeCounting, setTimeCounting]           = React.useState(false);
    const [working, setWorking]                     = React.useState(false);
    const [resting, setResting]                     = React.useState(false);
    const [cyclesQtdManager, setCyclesQtdManager]   = React.useState(
        new Array(props.cycles - 1).fill(true)
    );

    const [completedCycles, setCompletedCycles]     = useState(0);
    const [fullWorkingTime, setfullWorkingTime]     = useState(0);
    const [numberOfPomodoros, setnumberOfPomodoros] = useState(0);

 

    useInterval(() => {
        setMainTime(mainTime - 1);
        if (working) setfullWorkingTime (fullWorkingTime + 1);
    }, timeCounting ? 1000 : null);

    const configureWork = useCallback(() => {
        setTimeCounting(true);
        setWorking(true);
        setResting(false);
        setMainTime(props.PomodoroTime);
        audioStartWorking.play()
    }, [
        setWorking, 
        setResting, 
        setMainTime, 
        setTimeCounting,
        props.PomodoroTime
    ]);

    const configureRest = useCallback((long: boolean) => {
        setTimeCounting(false);
        setWorking(false);
        setResting(true);
        setMainTime(props.PomodoroTime);
        audioStopWorking.play();

        if (long) {
            setMainTime(props.longRestTime);
        }   else {
            setMainTime(props.shortRestTime);
        }
       
        
    },[
        setWorking, 
        setResting, 
        setMainTime, 
        setTimeCounting, 
        props.longRestTime, 
        props.shortRestTime, 
        props.PomodoroTime
    ]);

    useEffect( () => {
        if(working) document.body.classList.add('working');
        if(resting) document.body.classList.remove('working');

        if (mainTime > 0) return;

        if (working && cyclesQtdManager.length > 0) {
            configureRest(false);
            cyclesQtdManager.pop();
        } else if (working && cyclesQtdManager.length <= 0) {
            configureRest(true);
            setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
            setCompletedCycles(completedCycles + 1);
        }

        if (working) setnumberOfPomodoros (numberOfPomodoros + 1);
        if (resting) configureWork();
    }, [
        working, 
        resting, 
        mainTime, 
        configureRest, 
        setCyclesQtdManager, 
        setCompletedCycles,
        configureWork,
        props.cycles,
        completedCycles, 
        cyclesQtdManager,
        numberOfPomodoros
    ]);

    return (
        <div className="pomodoro">
            <h2>Você está: {working ? 'Trabalhando' : 'Descansando'}</h2>
            <Timer mainTime={mainTime} />
            
            <div className="controls">
                <Button text='Working' onClick={() => configureWork()}></Button>
                <Button text='Resting' onClick={() => configureRest(false)}></Button>
                <Button 
                className = {!working && !resting ? 'hidden' : ''}
                text={timeCounting ? 'Pause' : 'Play'} onClick={() => setTimeCounting(!timeCounting)}></Button>
            </div>

            <div className="details">
                <p>Ciclos Concluídos:   {completedCycles}</p>
                <p>Horas Trabalhadas:   {secondsToTime(fullWorkingTime)}</p>
                <p>Pomodoros Concluídos:{numberOfPomodoros}</p>
            </div>
           
        </div>
    )
}