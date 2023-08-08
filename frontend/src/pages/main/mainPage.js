import React, { useState, useEffect} from 'react';
import axios from 'axios';
import style from './mainPage.module.css';
import { BsPlusSquare } from 'react-icons/bs';
import DebateRoomCard from '../../components/mainpage/debateRoomCard';
import { useRecoilState } from 'recoil';
import { minRoomIdState, minWaitingRoomIdState } from '../../recoil/mainPageRoomId';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/token'
import { userIdState } from '../../recoil/userId';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [title1, setTitle1] = useState('');
  const [title2, setTitle2] = useState('');
  const [debateTime, setDebateTime] = useState('');
  const [speechTime, setSpeechTime] = useState('');
  const [spectatorCount, setSpectatorCount] = useState('');
  const [extensionCount, setExtensionCount] = useState('');
  const [ongoingDebateRooms, setOngoingDebateRooms] = useState([]);
  const [waitingDebateRooms, setWaitingDebateRooms] = useState([]);
  const [minWaitingRoomId, setMinWaitingRoomId] = useRecoilState(minWaitingRoomIdState);
  const userId = useRecoilValue(userIdState);
  const tokenis = useRecoilValue(userState);
  const navigate = useNavigate();

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCreateRoom = async () => {
    // 토론시간 유효성 검사
    const debateTimeInt = parseInt(debateTime);
    const userIdString = String(userId);
    
    if (isNaN(debateTimeInt) || debateTimeInt < 20 || debateTimeInt > 120) {
      alert('토론시간은 20분에서 120분 사이의 숫자로 입력해야 합니다.');
    }

    // 데이터 구성
    const roomData = {
      userId : userIdString,
      totalTime: parseInt(debateTimeInt),
      talkTime: parseInt(speechTime),
      maxPeople: parseInt(spectatorCount),
      overTimeCount: parseInt(extensionCount),
      atopic: title1,
      btopic: title2
    };

    // 서버에 POST 요청 보내기
    try {
      const response = await axios.post(`http://i9a605.p.ssafy.io:8081/api/debate/${userId.userId}`, roomData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenis}`  // 토큰을 사용한다면 이렇게 헤더에 추가
        }
      });
      if (response.data) {
        alert('방이 성공적으로 생성되었습니다.');
        // 여기까지는 성공
        navigate(`/debateRoom/${response.data.data}`);
      }
    } catch (error) {
      console.error('방 생성에 실패하였습니다.', error);
      alert('방 생성에 실패하였습니다.');
    }
    
    closeModal();
};

  // 최초 페이지 로드 시 서버에서 데이터 가져오기
  const [minRoomId, setMinRoomId] = useRecoilState(minRoomIdState);

  useEffect(() => {
    async function fetchData() {
      try {
        let apiUrl = 'http://i9a605.p.ssafy.io:8081/api/debate/list/ongoing';
        if (minRoomId !== null) {
          apiUrl += `?minRoomId=${minRoomId}&size=12`;
        } else {
          apiUrl += '?minRoomId=10000&size=12';
        }
        const response = await axios.get(apiUrl);
        const data = response.data.data;
        
        if (data.length > 0) {
          const newMinRoomId = Math.min(...data.map(room => room.roomId));
          setMinRoomId(newMinRoomId);
          setOngoingDebateRooms(data);
        }        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, [minRoomId]);

  useEffect(() => {
    async function fetchData() {
      try {
        let apiUrl = 'http://i9a605.p.ssafy.io:8081/api/debate/list/waiting';
        if (minWaitingRoomId !== null) {
          apiUrl += `?minRoomId=${minWaitingRoomId}&size=12`;
        } else {
          apiUrl += '?minRoomId=10000&size=12';
        }

        const response = await axios.get(apiUrl);
        const data = response.data.data;

        if (data.length > 0) {
          const newMinRoomId = Math.min(...data.map(room => room.roomId));
          setMinWaitingRoomId(newMinRoomId);
          setWaitingDebateRooms(data);
        }        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
    // eslint-disable-next-line
  }, [minWaitingRoomId]);

  return (
    <div className='container'>
      <div className='innercontents'>
          <div className={`${style.createroombuttoncontainer} justify-content-end`}> {/* Add this */}
            <button
              className={`btn ${style.createroombutton}`}
              onClick={openModal}
              style={{ width: 'fit-content', padding: '0.5rem' }}
            >
              <BsPlusSquare className={style.createroombuttonicon} style={{ fontSize: '1.5rem' }} />
            </button>
          </div>

        <hr className={style.horizontalline} />
        <div className={style.titlebox}>
          <span className={style.title}>참여 가능한 토론방</span>
        </div>
        <div className={style.debateRoomContainer}>
          {waitingDebateRooms.map(room => (
            <DebateRoomCard
              key={room.roomId}
              title1={room.atopic}
              title2={room.btopic}
              debateTime={room.totalTime}
              speechTime={room.talkTime}
              roomId={room.roomId}
            />
          ))}
        </div>

        <hr className={style.horizontalline} />

        <div className={style.titlebox}>
          <span className={style.title}>진행 중인 토론방</span>
        </div>
        
        <div className={style.debateRoomContainer}>
          {ongoingDebateRooms.map(room => (
            <DebateRoomCard
              key={room.roomId}
              title1={room.atopic}
              title2={room.btopic}
              debateTime={room.totalTime}
              speechTime={room.talkTime}
              roomId={room.roomId}
            />
          ))}
        </div>
        </div>
        <div className={`modal ${showModal ? 'show d-block' : ''}`} tabIndex='-1' role='dialog'>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">토론방 만들기</h5>
                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <label className={style.contentTitle}>제목:</label>
                <div className='row'>
                  <div className='col-md-12'>
                    <input type='text' className='form-control' value={title1} onChange={(e) => setTitle1(e.target.value)} />
                  </div>
                  <div className='col-md-1'>
                    <span>VS</span>
                  </div>
                  <div className='col-md-12'>
                    <input type='text' className='form-control' value={title2} onChange={(e) => setTitle2(e.target.value)} />
                  </div>
                </div>
                <label className={style.contentTitle}>토론시간 (분):</label>
                <input
                  type='text'
                  className='form-control'
                  value={debateTime}
                  onChange={(e) => setDebateTime(e.target.value)}
                />
                <label className={style.contentTitle}>발언시간:</label>
                <select className='form-select' value={speechTime} onChange={(e) => setSpeechTime(e.target.value)}>
                  <option value="1">1분</option>
                  <option value="2">2분</option>
                  <option value="3">3분</option>
                  <option value="4">4분</option>
                  <option value="5">5분</option>
                </select>
                <label className={style.contentTitle}>관전자 수:</label>
                <select className='form-select' value={spectatorCount} onChange={(e) => setSpectatorCount(e.target.value)}>
                  <option value="1">1명</option>
                  <option value="2">2명</option>
                  <option value="3">3명</option>
                  <option value="4">4명</option>
                  <option value="5">5명</option>
                  <option value="6">6명</option>
                </select>
                <label className={style.contentTitle}>연장 횟수:</label>
                <select className='form-select' value={extensionCount} onChange={(e) => setExtensionCount(e.target.value)}>
                  <option value="0">0회</option>
                  <option value="1">1회</option>
                  <option value="2">2회</option>
                  <option value="3">3회</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>닫기</button>
                <button type="button" className="btn btn-primary" onClick={handleCreateRoom}>방 만들기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default MainPage;
