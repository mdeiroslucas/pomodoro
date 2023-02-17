import React, { useEffect } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/seconds-to-time';
import { Timer } from './timer';
import { Button } from './button';

const bellStart = require('../sounds/src_sounds_bell-start.mp3');
const bellFinish = require('../sounds/src_sounds_bell-finish.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
    PomodoroTime: number;
    shortRestTime: number;
    longRestTime: number;
    cycles: number;
}
export function PomodoroTimer(props: Props): JSX.Element {
    const [mainTime, setMainTime] = React.useState(props.PomodoroTime);
    const [timeCounting, setTimeCounting] = React.useState(false);
    const [working, setWorking] = React.useState(false);
    const [resting, setResting] = React.useState(false);

    useEffect( () => {
        if(working) document.body.classList.add('working');
        if(resting) document.body.classList.remove('working');
    }, [working]);

    useInterval(() => {
        setMainTime(mainTime - 1);
    }, timeCounting ? 1000 : null);
    // return <div>Olá Mundo! {secondsToTime(mainTime)} </div>

    const configureWork = () => {
        setTimeCounting(true);
        setWorking(true);
        setResting(false);
        setMainTime(props.PomodoroTime);
        audioStartWorking.play()
    };

    const configureResting = (long: boolean) => {
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
       
        
    };

    return (
        <div className="pomodoro">
            <h2>You are working.</h2>
            <Timer mainTime={mainTime} />
            
            <div className="controls">
                <Button text='Working' onClick={() => configureWork()}></Button>
                <Button text='Resting' onClick={() => configureResting(false)}></Button>
                <Button 
                className = {!working && !resting ? 'hidden' : ''}
                text={timeCounting ? 'Pause' : 'Play'} onClick={() => setTimeCounting(!timeCounting)}></Button>
            </div>

            <div className="details">

            </div>
           
        </div>
    )
}