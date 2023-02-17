import React, { useEffect } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/seconds-to-time';
import { Timer } from './timer';
import { Button } from './button';

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

    useEffect( () => {
        if(working) document.body.classList.add('working');
    }, [working]);

    useInterval(() => {
        setMainTime(mainTime - 1);
    }, timeCounting ? 1000 : null);
    // return <div>Olá Mundo! {secondsToTime(mainTime)} </div>

    const configureWork = () => {
        setTimeCounting(true);
        setWorking(true);
    };

    return (
        <div className="pomodoro">
            <h2>You are working.</h2>
            <Timer mainTime={mainTime} />
            
            <div className="controls">
                <Button text='Working' onClick={() => configureWork()}></Button>
                <Button text='teste' onClick={() => console.log('oi')}></Button>
                <Button text={timeCounting ? 'Pause' : 'Play'} onClick={() => setTimeCounting(!timeCounting)}></Button>
            </div>

            <div className="details">

            </div>
           
        </div>
    )
}