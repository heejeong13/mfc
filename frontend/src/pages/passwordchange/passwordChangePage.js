import { useState, useEffect } from "react";
import style from "./passwordChange.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/token";

function PasswordChangePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validPassword, setValidPassword] = useState("");
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const userToken = user.token;

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      passwordSubmit(event); // passwordSubmit 함수 호출
    }
  };

  const regex =
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;

  useEffect(() => {
    fetchUserInfo();
    window.addEventListener("keydown", handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleKeyPress]);
  // 현재 비밀번호 가져오기
  const fetchUserInfo = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    try {
      const response = await axios.get(
        `https://goldenteam.site/api/user`,
        config
      );
      setValidPassword(response.data.data.password);
    } catch (error) {
      console.error("사용자 정보 가져오기 오류", error);
    }
  };

  const updatePassword = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const updatedUser = {
      password: newPassword,
    };

    axios
      .patch(`https://goldenteam.site/api/user`, updatedUser, config)
      .then((response) => {
        console.log(response);
        alert("비밀번호 변경이 완료되었습니다.");
        navigate("/");
      })
      .catch((error) => {
        console.error("비밀번호 업데이트 오류:", error);
      });
  };

  // 비밀번호 오류 처리
  const passwordSubmit = (event) => {
    event.preventDefault();

    if (
      currentPassword.trim() === validPassword &&
      newPassword === confirmPassword &&
      regex.test(newPassword)
    ) {
      updatePassword();
    } else {
      // 모든 칸이 채워지지 않았을 때
      if (
        currentPassword.trim() === "" ||
        newPassword.trim() === "" ||
        confirmPassword.trim() === ""
      ) {
        alert("모든 비밀번호 입력란을 채워주세요.");
        // 바꿀 비밀번호가 확인 비밀번호와 같지 않을 때
      } else if (newPassword !== confirmPassword) {
        alert("변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        setNewPassword("");
        setConfirmPassword("");
        // 비밀번호의 조건
      } else if (currentPassword.trim() !== validPassword) {
        alert("현재 비밀번호와 일치하지 않습니다.");
        setCurrentPassword("");
      } else if (!regex.test(newPassword)) {
        alert(
          "비밀번호는 영문자, 숫자, 특수문자를 포함하여 8자 이상 20자 이하여야 합니다."
        );
        setNewPassword("");
        setConfirmPassword("");
      }
    }
  };

  return (
    <div className={style.wrapper}>
      <p className={`${style.passwordTitle}`}>비밀번호 변경</p>
      <hr className="mb-5" />
      <div className={`${style.contentWrap}`}>
        <form onSubmit={passwordSubmit}>
          <div className="my-4">
            <div className={`${style.passwordWrap}`}>
              <p className={style.inputtitle}>현재 비밀번호</p>
              <div className={style.inputWrap}>
                <input
                  className="input form-control w-100"
                  type="password"
                  placeholder="현재 비밀번호"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            </div>
            <div className={`${style.passwordWrap}`}>
              <p className={style.inputtitle}>변경 비밀번호</p>
              <div className={style.inputWrap}></div>
              <input
                className="input form-control w-100"
                type="password"
                placeholder="변경할 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className={`${style.passwordWrap}`}>
              <p className={style.inputtitle}>비밀번호 확인</p>
              <div className={style.inputWrap}></div>
              <input
                className="input form-control w-100"
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="my-4">
              <button className={`${style.btnChange} btn w-100`} type="submit">
                변경
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordChangePage;
