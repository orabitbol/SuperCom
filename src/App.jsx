import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useSelector } from "react-redux";
import Login from "./component/Login/Login";
import Offender from "./component/offender/Offender";
import { autoSelector } from "./redux/slice/auto/loginSlice";
import OffenderCreation from "./component/OffenderCreation/OffenderCreation";
import EditOffender from "./component/EditOffender/EditOffender";

const App = () => {
  const isAuth = useSelector(autoSelector);
  return (
    <div className="app">
      {isAuth ? (
        <Routes>
          <Route path="/" element={<Navigate to="/offender" />} />
          <Route path="/offender" element={<Offender />} />
          <Route path="/create" element={<OffenderCreation />} />
          <Route path="/edit/:id" element={<EditOffender />} />
        </Routes>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
