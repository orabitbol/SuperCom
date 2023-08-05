import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import * as yup from "yup";
import { offenderSelector } from "../../redux/slice/editOffender/editOffender";
import { editOffender } from "../../redux/slice/offenderListSlice/offenderListSlice";
import "./editOffender.scss";
const EditOffender = () => {
  const today = new Date();
  const numberOfDaysToAdd = 3;
  const newDate = today.setDate(today.getDate() + numberOfDaysToAdd);
  console.log(newDate, "newDate");
  const defaultValue = new Date(newDate).toISOString().split("T")[0];
  console.log(defaultValue, "defaultValue");

  const [date, setDate] = useState(defaultValue);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const offender = useSelector(offenderSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: offender.id || "",
    firstName: offender.firstName || "",
    middleName: offender.middleName || "",
    lastName: offender.lastName || "",
    socialSecurityNumber: offender.socialSecurityNumber || "",
    gender: offender.gender || "",
    birthDate: offender.birthDate
      ? new Date(offender.birthDate).toISOString().split("T")[0]
      : "",
    programStartDate: offender.programStartDate
      ? new Date(offender.programStartDate).toISOString().split("T")[0]
      : "",
    programEndDate: offender.programEndDate
      ? new Date(offender.programEndDate).toISOString().split("T")[0]
      : "",
    email: offender.email || "",
    phoneNumber: offender.phoneNumber || "",
    picture: offender.picture || null,
  });

  const [errors, setErrors] = useState("");

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
          if (!startDate || !endDate) return true;

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
      dispatch(editOffender({ id: formData.id, newData: formData }));
      setFormData({
        id: "",
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

      navigate("/offender");
      alert("Offender data submitted successfully!");
    } catch (error) {
      let array = [];
      if (error instanceof yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        console.log(newErrors);
        Object.entries(newErrors).forEach(([key, value]) => {
          array.push(value);
        });
        console.log(array[array.length - 1]);
        console.log(array);
        if (
          array[array.length - 1] !== undefined ||
          array[array.length - 1] >= -1
        ) {
          setErrors(array[0]);
        }
      }
    }
  };

  console.log(offender.programStartDate);
  let data = new Date(offender.programStartDate);
  // data = data.toISOString().split("T")[0];
  console.log(data);
  return (
    <div className="edit-offender">
      <span className="offender-creation-title">Edit Offender</span>
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="wapper-form">
          <div className="position-field">
            <label className="label-name">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="edit-input-name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="position-field">
            <label className="label-name">Middle Name</label>
            <input
              type="text"
              id="middleName"
              name="middleName"
              className="edit-input-name"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="wapper-form">
          <div className="position-field">
            <label className="label-name">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="edit-input-name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="position-field">
            <label className="label-name">Social Security Number</label>
            <input
              type="text"
              id="socialSecurityNumber"
              name="socialSecurityNumber"
              className="edit-input-name"
              value={formData.socialSecurityNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="wapper-form">
          <div className="position-field">
            <label className="label-name">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              className="edit-input-name"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="position-field">
            <label className="label-name">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="wapper-form">
          <label className="label-name">Gender</label>
          <select
            id="gender"
            name="gender"
            className="edit-input-gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="wapper-form">
          <label className="label-name">Birth Date</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>
        <div className="wapper-form">
          <label className="label-name">Program Start Date</label>
          <input
            type="date"
            id="programStartDate"
            name="programStartDate"
            value={formData.programStartDate}
            onChange={handleChange}
          />
        </div>
        <div className="wapper-form">
          <label className="label-name">Program End Date</label>
          <input
            type="date"
            id="programEndDate"
            name="programEndDate"
            value={formData.programEndDate}
            onChange={handleChange}
          />
        </div>

        <div className="wapper-form">
          <label className="label-name">Picture (Upload)</label>
          <label htmlFor="picture" className="custom-upload-button">
            Choose a Picture
          </label>
          <input
            type="file"
            id="picture"
            name="picture"
            className="edit-input-picture"
            onChange={handlePictureChange}
          />
        </div>
        <div className="error-field">{errors && <p>{errors}</p>}</div>
        <div className="position-button">
          <button className="button-1" type="submit">
            Submit
          </button>
          <button className="button-1" onClick={() => navigate("/offender")}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditOffender;
