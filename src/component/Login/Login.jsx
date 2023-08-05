import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logIn } from "../../redux/slice/auto/loginSlice";
import "./Login.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogin = () => {
    fetch("/src/data/data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const user = data.users.find((user) => user.username === username);
        if (user && user.password === password) {
          dispatch(logIn(user));
          navigate("/offender");
        } else {
          setErrors("Invalid username or password");
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  return (
    <div className="login-container">
      <span className="login-title">Login</span>
      <input
        type="text"
        placeholder="Username"
        className="login-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="error-field">{errors && <p>{errors}</p>}</div>
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;
