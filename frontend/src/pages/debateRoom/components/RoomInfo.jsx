import React, {useState, useEffect} from "react";
import { Row, Col, Button, ProgressBar } from "react-bootstrap";
import style from '../debatePage.module.css';

function RoomInfo({status, role, onStatusChange, onRoleChange}){
    const user1HP = 70;
    const user2HP = 100;

    const [totalTime, setTotalTime] = useState(30);
    const [speechTime, setSpeechTime] = useState(10);

    const [userReady, setUserReady] = useState([false, false]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    useEffect(() => {
        if(status === 'ongoing'){
            // 총 토론시간 타이머
            const totalTimer = setInterval( () => {
                if(totalTime > 0){
                    setTotalTime((prevTime) => prevTime - 1);
                } else {
                    onStatusChange('done');
                }
            }, 1000);

            // 1회 발언시간 타이머
            const speechTimer = setInterval(() => {
                if(speechTime > 0 && totalTime > 0) {
                    setSpeechTime((prevTime) => prevTime - 1);
                } 
            }, 1000);

            return () => {
                clearInterval(totalTimer);
                clearInterval(speechTimer);
            };
        }
    }, [status, onStatusChange, totalTime, speechTime]);

    
    useEffect( () => {
        if(speechTime === 0 && totalTime > 0){
            setSpeechTime(10);
        }
    }, [speechTime, totalTime]);
    
    //두 참가자가 모두 준비가 되면 토론 시작
    useEffect( () => {
        if(status === 'waiting' && userReady[0] && userReady[1]){
            onStatusChange('ongoing');
        }
    },[userReady, status, onStatusChange]);

    return(
        <>
            <Row className={style.roomInfo}>
                <Col id="option1" className={`${style.opinion} ${style.opinion1}`}>
                    <span>title1</span>
                </Col>
                <Col id="option2" className={`${style.opinion} ${style.opinion2}`}>
                    <span>title2</span>
                </Col>
            </Row>
            <Row>
                <Col className={style.userInfo}>
                    사용자1 정보
                </Col>
                <Col xs={2} className={style.timer}>
                    {formatTime(totalTime)}
                </Col>
                <Col className={style.userInfo}>
                    사용자2 정보
                </Col>
            </Row>
            <Row>
                <Col className={style.userInfo}>
                    {status === 'waiting' && (
                        <Button variant={userReady[0] ? 'outline-primary' : 'primary'} onClick={() => setUserReady((prevState) => [!prevState[0], prevState[1]])}>
                            {userReady[0] ? '준비완료' : '준비'}
                        </Button>
                    )}
                    {status === 'ongoing' && <ProgressBar className={style.user1HP} now={user1HP} label={`${user1HP}%`} />}
                </Col>
                <Col xs={2} className={style.timer} >
                    {formatTime(speechTime)}
                </Col>
                <Col className={style.userInfo}>
                    {status === 'waiting' && (
                        <Button variant={userReady[1] ? 'outline-primary' : 'primary'} onClick={() => setUserReady((prevState) => [prevState[0], !prevState[1]])}>
                            {userReady[1] ? '준비완료' : '준비'}
                        </Button>
                    )}
                    {status === 'ongoing' && <ProgressBar className="user2HP" now={user2HP} label={`${user2HP}%`} />}
                </Col>
            </Row>
        </>
    );
}

export default RoomInfo;