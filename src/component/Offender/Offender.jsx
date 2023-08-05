import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  offenderListSelector,
  getOffenderListFromApi,
  removeOffender,
} from "../../redux/slice/offenderListSlice/offenderListSlice";
import { setOffender } from "../../redux/slice/editOffender/editOffender";
import { logOut } from "../../redux/slice/auto/loginSlice";
import "./offender.scss";
const Offender = () => {
  const user = useSelector((state) => state.login.userDetails);
  const offenderList = useSelector(offenderListSelector);
  const isDataFetched = useSelector(
    (state) => state.offenderList.isDataFetched
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEditOffender = (offenderId) => {
    const offenderToEdit = offenderList.find(
      (offender) => offender.id === offenderId
    );
    dispatch(setOffender(offenderToEdit));
    navigate(`/edit/${offenderId}`);
  };

  const handleDeleteOffender = (offenderId) => {
    dispatch(removeOffender(offenderId));
  };
  const moveToCreateOffenderPage = () => {
    navigate("/create");
  };
  const logout = () => {
    localStorage.clear();
    dispatch(logOut());

    navigate("/");
  };

  useEffect(() => {
    if (!isDataFetched) {
      dispatch(getOffenderListFromApi());
    }
  }, []);

  console.log("offenderList", offenderList);

  return (
    <div className="offender-container">
      <span className="offender-title">Offender List</span>
      <ul className="offender-list">
        {offenderList !== undefined && offenderList.length > 0
          ? offenderList.map((offender) => (
              <li key={offender.id} className="offender-item">
                <span className="offender-item-name">
                  {offender.firstName} {offender.lastName}
                </span>
                <div className="offender-actions">
                  <button
                    className={
                      user.role !== "A"
                        ? "offender-disabled"
                        : "offender-button"
                    }
                    disabled={user.role !== "A" ? true : false}
                    onClick={() => handleEditOffender(offender.id)}
                  >
                    Edit
                  </button>
                  {user.role === "A" && (
                    <>
                      <button
                        className="offender-button"
                        onClick={() => handleDeleteOffender(offender.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))
          : ""}
      </ul>
      <button className="button-1" onClick={moveToCreateOffenderPage}>
        Create Offender
      </button>
      <button className="button-2" onClick={logout}>
        Log Out
      </button>
    </div>
  );
};
export default Offender;
