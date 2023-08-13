import React, { useState } from "react";
import style from "./createRoomModal.module.css";

function UpdateRoomModal({
  isModalOpen,
  closeModal,
  debateRoomInfo,
  handleUpdateRoom,
}) {
  const [newRoomInfo, setNewRoomInfo] = useState({
    atopic: debateRoomInfo.atopic,
    btopic: debateRoomInfo.btopic,
    totalTime: debateRoomInfo.totalTime,
    talkTime: debateRoomInfo.talkTime,
    maxPeople: debateRoomInfo.maxPeople,
    overTimeCount: debateRoomInfo.overTimeCount,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewRoomInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (
      !newRoomInfo.atopic ||
      !newRoomInfo.btopic ||
      newRoomInfo.totalTime <= 0
    ) {
      alert("제목과 시간은 필수 입력 항목입니다.");
      return;
    }
    handleUpdateRoom(newRoomInfo);

    closeModal();
  };

  return (
    <div
      className={`modal ${isModalOpen ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">토론방 수정하기</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <label className={style.contentTitle}>제목:</label>
            <div className="row">
              <div className="col-md-12">
                <input
                  type="text"
                  className="form-control"
                  name="atopic"
                  value={newRoomInfo.atopic}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-1">
                <span>VS</span>
              </div>
              <div className="col-md-12">
                <input
                  type="text"
                  className="form-control"
                  name="btopic"
                  value={newRoomInfo.btopic}
                  onChange={handleChange}
                />
              </div>
            </div>
            <label className={style.contentTitle}>토론시간 (분):</label>
            <input
              type="text"
              className="form-control"
              name="totalTime"
              value={newRoomInfo.totalTime}
              onChange={handleChange}
            />
            <label className={style.contentTitle}>발언시간:</label>
            <select
              className="form-select"
              name="talkTime"
              value={newRoomInfo.talkTime}
              onChange={handleChange}
            >
              <option value="1">1분</option>
              <option value="2">2분</option>
              <option value="3">3분</option>
              <option value="4">4분</option>
              <option value="5">5분</option>
            </select>
            <label className={style.contentTitle}>관전자 수:</label>
            <select
              className="form-select"
              name="maxPeople"
              value={newRoomInfo.maxPeople}
              onChange={handleChange}
            >
              <option value="1">1명</option>
              <option value="2">2명</option>
              <option value="3">3명</option>
              <option value="4">4명</option>
              <option value="5">5명</option>
              <option value="6">6명</option>
            </select>
            <label className={style.contentTitle}>연장 횟수:</label>
            <select
              className="form-select"
              name="overTimeCount"
              value={newRoomInfo.overTimeCout}
              onChange={handleChange}
            >
              <option value="0">0회</option>
              <option value="1">1회</option>
              <option value="2">2회</option>
              <option value="3">3회</option>
            </select>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              닫기
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              방 수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateRoomModal;
