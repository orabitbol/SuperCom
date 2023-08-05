import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import * as yup from "yup";
import { setOffendersList } from "../../redux/slice/offenderListSlice/offenderListSlice";
import { offenderListSelector } from "../../redux/slice/offenderListSlice/offenderListSlice";
import "./OffenderCreation.scss";
const OffenderCreation = () => {
  const offenderList = useSelector(offenderListSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    socialSecurityNumber: "",
    gender: "",
    birthDate: "",
    programStartDate: "",
    programEndDate: "",
    email: "",
    phoneNumber: "",
    picture: null,
  });

  const [errors, setErrors] = useState({});

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    middleName: yup.string(),
    lastName: yup.string().required("Last name is required"),
    socialSecurityNumber: yup
      .string()
      .required("Social security number is required"),
    gender: yup.string().required("Gender is required"),
    birthDate: yup.date().required("Birth date is required"),
    programStartDate: yup.date().required("Program start date is required"),
    programEndDate: yup
      .date()
      .required("Program end date is required")
      .min(
        yup.ref("programStartDate"),
        "End date should not be before start date"
      )
      .test(
        "is-minimum-two-months",
        "Program length should be a minimum of two months",
        function (endDate) {
          const startDate = this.resolve(yup.ref("programStartDate"));
          if (!startDate || !endDate) return true; // Allow if either date is not set

          const diffInMonths = Math.ceil(
            Math.abs(endDate.getMonth() - startDate.getMonth()) + 1
          );
          return diffInMonths >= 3;
        }
      ),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Invalid phone number")
      .required("Phone number is required"),
    picture: yup.mixed().required("Picture is required"),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePictureChange = (event) => {
    setFormData({ ...formData, picture: event.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        socialSecurityNumber: "",
        gender: "",
        birthDate: "",
        programStartDate: "",
        programEndDate: "",
        email: "",
        phoneNumber: "",
        picture: null,
      });
      const newOffender = {
        ...formData,
        id: offenderList[offenderList.length - 1].id + 1,
      };
      dispatch(setOffendersList(newOffender));
      navigate("/offender");
      alert("Offender data submitted successfully!");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="offender-creation-container">
      <span className="offender-creation-title">Create Offender</span>
      <form className="offender-creation-form" onSubmit={handleSubmit}>
        <div className="offender-top-part">
          <input
            className="offender-creation-input"
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />

          <input
            className="offender-creation-input"
            placeholder="Middle Name"
            type="text"
            id="middleName"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
        </div>

        <div className="offender-bottom-part">
          <input
            className="offender-creation-input"
            type="text"
            placeholder="Last Name"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            className="offender-creation-input"
            type="text"
            placeholder="Security Number"
            id="socialSecurityNumber"
            name="socialSecurityNumber"
            value={formData.socialSecurityNumber}
            onChange={handleChange}
          />
        </div>

        <div className="offender-gender-birthdate">
          <label className="offender-creation-label">Gender:</label>
          <select
            className="offender-creation-input"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <label className="offender-creation-label">Birth Date:</label>
          <input
            className="offender-creation-input"
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>

        <div className="offender-wapper">
          <label className="offender-creation-label">Program Start Date:</label>
          <input
            className="offender-creation-input"
            type="date"
            id="programStartDate"
            name="programStartDate"
            value={formData.programStartDate}
            onChange={handleChange}
          />
        </div>
        <div className="offender-wapper">
          <label className="offender-creation-label">Program End Date:</label>
          <input
            className="offender-creation-input"
            type="date"
            id="programEndDate"
            name="programEndDate"
            value={formData.programEndDate}
            onChange={handleChange}
          />
        </div>
        <div className="offender-wapper">
          <label className="offender-creation-label">Email:</label>
          <input
            className="offender-creation-input"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="offender-wapper">
          <label className="offender-creation-label">Phone Number:</label>
          <input
            className="offender-creation-input"
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="offender-wapper">
          <label className="offender-creation-label">Picture (Upload):</label>
          <input
            type="file"
            id="picture"
            name="picture"
            onChange={handlePictureChange}
            className="offender-creation-file-input"
          />
          <label htmlFor="picture" className="offender-creation-file-label">
            Choose a File
          </label>
          {formData.picture && (
            <p className="offender-creation-file-name">
              {formData.picture.name}
            </p>
          )}
          {errors.picture && (
            <p className="offender-creation-error">{errors.picture}</p>
          )}
        </div>
        <div className="offender-creation-error">
          {errors.firstName && <p className="error-text">{errors.firstName}</p>}
          {errors.lastName && <p className="error-text">{errors.lastName}</p>}
          {errors.socialSecurityNumber && (
            <p className="error-text">{errors.socialSecurityNumber}</p>
          )}
          {errors.gender && <p className="error-text">{errors.gender}</p>}
          {errors.birthDate && <p className="error-text">{errors.birthDate}</p>}
          {errors.programStartDate && (
            <p className="error-text">{errors.programStartDate}</p>
          )}
          {errors.programEndDate && (
            <p className="error-text">{errors.programEndDate}</p>
          )}
          {errors.email && <p className="error-text">{errors.email}</p>}
          {errors.phoneNumber && (
            <p className="error-text">{errors.phoneNumber}</p>
          )}
          {errors.picture && <p className="error-text">{errors.picture}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default OffenderCreation;
