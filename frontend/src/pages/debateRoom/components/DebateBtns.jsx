import React, {useState, useEffect} from "react";
import {Row, Col, Button, Modal, Form} from "react-bootstrap";
import style from '../debatePage.module.css';

function DebateBtns({status, role, onRoleChange, debateRoomInfo, setPlayerStatus, setUserReady}){
    const [showModal, setShowModal] = useState(false);
    const [selectedTopic, setSelectedTopics] = useState([]);
    const [isVotingEnabled, setVotingEnabled] = useState(true);
    const votingCooldown = debateRoomInfo.talkTime * 120;
    const [remainingTime, setRemainingTime] = useState(votingCooldown);

    const handleVote = () => {
        // 투표 로직 구현
        console.log(`Selected ${selectedTopic}`);
        setShowModal(false);
        setVotingEnabled(false);    // 투표 후 투표 비활성화
    };
useEffect(() => {
    if(!isVotingEnabled){
        // 투표 후 재투표 가능 시간 설정
        const timer = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);

        //일정 시간이 지나면 투표 가능하도록 활성화
        setTimeout(() => {
            setVotingEnabled(true);
            setRemainingTime(votingCooldown);
            clearInterval(timer);
        }, votingCooldown * 1000);

        //컴포넌트 언마운트 시 타이머 정리
        return () => {
            clearTimeout(timer);
        };
    }
}, [isVotingEnabled, votingCooldown]);

    const handleRoleChangeToSpectator = () => {
        onRoleChange('spectator');
        setPlayerStatus([false, false]);
        setUserReady(false);
    }


    return (
        <div className={style.Btns}>
            <Row>
                <Col xs={{span: 9}}>
                    { role === 'participant' && status === 'ongoing' && 
                        <>
                            <Button variant="outline-primary">연장하기</Button>
                            <Button variant="outline-primary">항복하기</Button>
                        </>
                    }
                </Col>
                <Col xs={2}>
                    { role === 'participant' && status === 'waiting' && 
                        <Button 
                            variant="outline-primary" 
                            onClick={handleRoleChangeToSpectator}
                        >
                            관전자로 돌아가기
                        </Button>
                    }
                </Col>
            </Row>
            <Row>
                <Col className={style.items}>
                    { role === 'participant' && status === 'ongoing' &&
                        <>  
                            <Button variant="outline-primary">포션</Button>
                            <Button variant="outline-primary">수호천사</Button>
                            <Button variant="outline-primary">연장</Button>
                            <Button variant="outline-primary">마이크</Button>
                            <Button variant="outline-primary">끼어들기</Button>
                            <Button variant="outline-primary">음성변조</Button>
                        </>
                    }
                </Col>
                <Col className={style.onOff}>
                    { role === 'spectator' && status === 'ongoing' && 
                        <Button variant="primary" onClick={() => setShowModal(true)}>투표하기</Button>
                    }
                    <Button variant="primary">캠 OFF</Button>
                    { role === 'participant' && <Button variant="primary">마이크 OFF</Button>}
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Vote for Topics</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Check
                            key="topicA"
                            type="radio"
                            label={debateRoomInfo.atopic}
                            id="topicA"
                            value="topicA"
                            checked={selectedTopic === "topicA"}
                            onChange={() => setSelectedTopics("topicA")}
                            disabled={!isVotingEnabled}
                        />
                        <Form.Check
                            key="topicB"
                            type="radio"
                            label={debateRoomInfo.btopic}
                            id="topicB"
                            value="topicB"
                            checked={selectedTopic === "topicB"}
                            onChange={() => setSelectedTopics("topicB")}
                            disabled={!isVotingEnabled}
                        />
                    </Form>
                {!isVotingEnabled && (
                    <p>{remainingTime}초 뒤에 재투표가 가능합니다.</p>
                )}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleVote}>
                    투표하기
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DebateBtns;