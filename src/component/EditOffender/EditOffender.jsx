import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import * as yup from "yup";
import { offenderSelector } from "../../redux/slice/editOffender/editOffender";
import { editOffender } from "../../redux/slice/offenderListSlice/offenderListSlice";

const EditOffender = () => {
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
      ? new Date(offender.birthDate).toISOString()
      : "",
    programStartDate: offender.programStartDate
      ? new Date(offender.programStartDate)
      : "",
    programEndDate: offender.programEndDate
      ? new Date(offender.programEndDate)
      : "",
    email: offender.email || "",
    phoneNumber: offender.phoneNumber || "",
    picture: offender.picture || null,
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="middleName">Middle Name:</label>
        <input
          type="text"
          id="middleName"
          name="middleName"
          value={formData.middleName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="socialSecurityNumber">Social Security Number:</label>
        <input
          type="text"
          id="socialSecurityNumber"
          name="socialSecurityNumber"
          value={formData.socialSecurityNumber}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="gender">Gender:</label>
        <select
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
      </div>
      <div>
        <label htmlFor="birthDate">Birth Date:</label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="programStartDate">Program Start Date:</label>
        <input
          type="date"
          id="programStartDate"
          name="programStartDate"
          value={formData.programStartDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="programEndDate">Program End Date:</label>
        <input
          type="date"
          id="programEndDate"
          name="programEndDate"
          value={formData.programEndDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="picture">Picture (Upload):</label>
        <input
          type="file"
          id="picture"
          name="picture"
          onChange={handlePictureChange}
        />
      </div>
      <div>
        {errors.firstName && <p>{errors.firstName}</p>}
        {errors.lastName && <p>{errors.lastName}</p>}
        {errors.socialSecurityNumber && <p>{errors.socialSecurityNumber}</p>}
        {errors.gender && <p>{errors.gender}</p>}
        {errors.birthDate && <p>{errors.birthDate}</p>}
        {errors.programStartDate && <p>{errors.programStartDate}</p>}
        {errors.programEndDate && <p>{errors.programEndDate}</p>}
        {errors.email && <p>{errors.email}</p>}
        {errors.phoneNumber && <p>{errors.phoneNumber}</p>}
        {errors.picture && <p>{errors.picture}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
export default EditOffender;
