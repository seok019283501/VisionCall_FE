import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/SignUp.css";
import { useNavigate } from "react-router-dom";

const SignUp = (props) => {
  const rest_api_url = process.env.REACT_APP_REST_API_URL;
  const navigator = useNavigate();

  // 회원가입 입력 상태
  const [signUp, setSignUp] = useState({
    username: "",          // 아이디
    password: "",          // 비밀번호
    password_confirm: "",  // 비밀번호 확인
    name: "",              // 이름
    nickname: "",          // 닉네임
    email: "",             // 이메일
    birth: ""    // 생년월일 (기본값 설정)
  });

  // 이메일 인증 코드 입력 값
  const [emailConfirmCode, setEmailConfirmCode] = useState("");

  // 이메일 인증 성공 여부
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 회원가입/인증 과정 중 발생한 에러 메시지
  const [errorMessage, setErrorMessage] = useState("");

  // 입력 핸들러
  const handleName = (e) => {
    setSignUp({ ...signUp, name: e.target.value });
  };
  const handleUsername = (e) => {
    setSignUp({ ...signUp, username: e.target.value });
  };
  const handlePassword = (e) => {
    setSignUp({ ...signUp, password: e.target.value });
  };
  const handlePasswordConfirm = (e) => {
    setSignUp({ ...signUp, password_confirm: e.target.value });
  };
  const handleNickname = (e) => {
    setSignUp({ ...signUp, nickname: e.target.value });
  };
  const handleEmail = (e) => {
    setSignUp({ ...signUp, email: e.target.value });
  };
const handleBirth = (e) => {
  const inputValue = e.target.value.replace(/[^0-9]/g, ""); 

  if (inputValue.length === 8) {
    const year = inputValue.slice(0, 4);   // YYYY
    const month = inputValue.slice(4, 6);  // MM
    const day = inputValue.slice(6, 8);    // DD

    setSignUp({ 
      ...signUp, 
      birth: `${year}-${month}-${day}` 
    });
  } else {
    setSignUp({ ...signUp, birth: inputValue });
  }
};
  const handleEmailConfirmCode = (e) => {
    setEmailConfirmCode(e.target.value);
  };

  // 에러 핸들러
  const handleSignUpError = () => {
    setErrorMessage("제대로 된 입력값을 적어주세요");
  };
  const handleEmailConfirmError = () => {
    setErrorMessage("코드가 일치하지 않습니다.");
  };
  const handleSendEmailCodeError = () => {
    setErrorMessage("코드 전송에 실패하였습니다.");
  };

  // 회원가입 요청
  const handleSignUp = () => {
    axios
      .post(`${rest_api_url}/open-api/auth/sign-up`, signUp)
      .then((res) => {
        console.log("회원가입 성공:", res.data.body);
        navigator("/sign-in")
      })
      .catch((err) => {
        console.log(err);
        handleSignUpError();
      });
  };

  // 이메일에 인증 코드 전송
  const handleEmailSend = () => {
    axios
      .post(`${rest_api_url}/open-api/auth/email-verification`, {
        email: signUp.email
      })
      .then((res) => {
        console.log("이메일 전송 성공:", res.data.body);
        // 성공 시 에러 메시지 초기화
        setErrorMessage("");
      })
      .catch((err) => {
        console.log(err);
        handleSendEmailCodeError();
      });
  };

  // 인증 코드 확인
  const handleEmailSendCode = () => {
    axios
      .post(`${rest_api_url}/open-api/auth/check-verification`, {
        email: signUp.email,
        code: emailConfirmCode
      })
      .then((res) => {
        console.log("이메일 인증 성공:", res.data.body);
        // 인증 완료 표시
        setIsEmailVerified(true);
        setErrorMessage("");
      })
      .catch((err) => {
        console.log(err);
        handleEmailConfirmError();
      });
  };

  // 모든 입력값이 들어가고 (비밀번호 확인 포함), 이메일 인증까지 완료되면 회원가입 버튼 활성화
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const {
      username,
      password,
      password_confirm,
      name,
      nickname,
      email,
      birth
    } = signUp;

    // (1) 모든 값이 비어있지 않아야 함
    const isAllFieldsFilled =
      username.trim() !== "" &&
      password.trim() !== "" &&
      password_confirm.trim() !== "" &&
      name.trim() !== "" &&
      nickname.trim() !== "" &&
      email.trim() !== "" &&
      birth.trim() !== "";

    // (2) 비밀번호와 비밀번호 확인이 동일해야 함
    const isPasswordMatch = password === password_confirm;

    // (3) 이메일 인증 완료여부
    const isEmailChecked = isEmailVerified;

    // (4) birth가 YYYY-MM-DD 형식인지 검증
    //    간단히 정규식으로 체크 (1990-01-01 등)
    const birthPattern = /^\d{4}-\d{2}-\d{2}$/;
    const isBirthValid = birthPattern.test(birth);

    // 최종 유효성
    if (isAllFieldsFilled && isPasswordMatch && isEmailChecked && isBirthValid) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [signUp, isEmailVerified]);

  return (
    <div className="sign-in-up-container">
      <div className="sign-in-up-in-sub-container">
        <div className="sign-in-up-sub-title-container">
          <div className="sign-in-up-sub-title">회원가입</div>
        </div>

        <div className="sign-up-input-container">
          <input
            className="sign-up-input"
            onChange={handleName}
            value={signUp.name}
            type="text"
            placeholder="이름을 입력해주세요."
          />
          <input
            className="sign-up-input"
            onChange={handleUsername}
            value={signUp.username}
            type="text"
            placeholder="아이디를 입력해주세요."
          />
          <input
            className="sign-up-input"
            onChange={handlePassword}
            value={signUp.password}
            type="password"
            placeholder="비밀번호를 8자 이상 입력해주세요."
          />
          <input
            className="sign-up-input"
            onChange={handlePasswordConfirm}
            value={signUp.password_confirm}
            type="password"
            placeholder="비밀번호를 확인해주세요."
          />
          <input
            className="sign-up-input"
            onChange={handleNickname}
            value={signUp.nickname}
            type="text"
            placeholder="닉네임을 입력해주세요."
          />

          <div className="email-confirm-container">
            <input
              className="sign-up-input-email-confirm"
              onChange={handleEmail}
              value={signUp.email}
              type="text"
              placeholder="이메일을 입력해주세요."
              readOnly={isEmailVerified} // 이메일 인증 후 읽기전용
            />
            <input
              className="email-confirm-button"
              type="button"
              onClick={handleEmailSend}
              value="전송"
              disabled={isEmailVerified} // 이메일 인증 후 버튼 비활성화
            />
          </div>

          <div className="email-confirm-container">
            <input
              className="sign-up-input-email-confirm"
              onChange={handleEmailConfirmCode}
              value={emailConfirmCode}
              type="text"
              placeholder="인증번호를 입력해주세요."
              readOnly={isEmailVerified} // 인증 완료 후 읽기전용
            />
            <input
              className="email-confirm-button"
              onClick={handleEmailSendCode}
              type="button"
              value="확인"
              disabled={isEmailVerified} // 인증 완료 후 버튼 비활성화
            />
          </div>

          <input
            className="sign-up-input"
            onChange={handleBirth}
            value={signUp.birth}
            type="text"
            maxLength={10}
            placeholder="생년월일 (YYYY-MM-DD)"
          />

          {/* 회원가입 버튼. 모든 조건 충족 시에만 활성화 */}
          <input
            className="sign-in-up-button"
            type="button"
            onClick={handleSignUp}
            value="회원가입"
            disabled={!isFormValid}
          />
        </div>

        {/* 에러 메시지 표시 */}
        {errorMessage && <div className="sign-error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default SignUp;