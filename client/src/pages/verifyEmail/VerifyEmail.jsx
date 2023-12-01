import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import { verifyEmail } from "../../apicalls/users";
import { verifyEmail } from "../../redux/features/userSlice";
import { message } from "antd";

const VerifyEmail = () => {
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { emailToken } = useParams();

  const [count, setCount] = useState(3);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount > 0 && prevCount - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const verifyEmailToken = async () => {
    if (user?.user?.isEmailVerified) {
      message.success("Redirecting back to signin page");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } else {
      if (emailToken) {
        try {
          dispatch(verifyEmail(emailToken));
          localStorage.removeItem("user");
        } catch (error) {
          message.error(error.error);
          console.error("Error verifying email:", error);
        }
      }
    }
  };

  useEffect(() => {
    verifyEmailToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailToken, user, navigate]);

  return (
    <div className="verify-email">
      {user?.user?.isEmailVerified ? (
        <div className="center">
          <h3>Email verified successfully</h3>
          <p>Redirecting in {count} seconds</p>
        </div>
      ) : (
        <div className="center">
          <h3>Email not verified {count}</h3>
          <p>
            A verification email link has been sent to your email account,
            please click on the link to verify your account
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
