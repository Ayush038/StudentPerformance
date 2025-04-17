import React, { useState } from "react";
import axios from "axios";

const Survey = () => {
  const initialFormState = {
    Participation_in_Extracurricular_Activities: "",
    Previous_Grades: 50,
    Attendance_Rate:50,
    Study_Hours_per_Week: 10,
    Parent_Education_Level: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [response, setResponse] = useState("");

  const handleOptionClick = (question, value) => {
    setFormData((prev) => ({ ...prev, [question]: value }));
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const res = await axios.post("http://127.0.0.1:8000/predict", formData);
      const x=res.data.prediction;
      if(x==="Yes"){
        setResponse("Hurrey!!! You will defenitely Pass in Your Exam 🎉🎉")
      }
      else{
        setResponse("You should Study Harder, Otherwise you will have difficulty in Passing💀💀")
      }
    } catch (error) {
      alert("There was an error processing the data:", error);
    }
  };

  const handleReload = () => {
    setFormData(initialFormState);
    setResponse("");
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <div className="form-left">
        <div className="slider-group">
            <p>Previous Grade (%)</p>
            <input
              type="range"
              name="Previous_Grades"
              min="0"
              max="100"
              value={formData.Previous_Grades}
              onChange={handleSliderChange}
            />
            <span>{formData.Previous_Grades}</span>
        </div>
        <div className="slider-group">
            <p>Attendance(%)</p>
            <input
              type="range"
              name="Attendance_Rate"
              min="0"
              max="100"
              value={formData.Attendance_Rate}
              onChange={handleSliderChange}
            />
            <span>{formData.Attendance_Rate}</span>
        </div>
        <div className="slider-group">
            <p>Time Wasted per day(hour(s))</p>
            <input
              type="range"
              name="Study_Hours_per_Week"
              min="0"
              max="24"
              value={formData.Study_Hours_per_Week}
              onChange={handleSliderChange}
            />
            <span>{formData.Study_Hours_per_Week}</span>
        </div>
        </div>
        <div className="divider"></div>

        {/* Right Side: 1 button + 4 sliders */}
        <div className="form-right">
        <div className="question">
            <p>Extracurricular Activity</p>
            <div className="option-group">
              {["Yes", "No"].map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className={`option-button ${formData.Participation_in_Extracurricular_Activities === option ? "selected" : ""}`}
                  onClick={() => handleOptionClick("Participation_in_Extracurricular_Activities", option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="question">
            <p>Parent Education Level</p>
            <div className="option-group">
              {["Bachelor", "High School","Associate","Doctorate","Master"].map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className={`option-button ${formData.Parent_Education_Level === option ? "selected" : ""}`}
                  onClick={() => handleOptionClick("Parent_Education_Level", option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>

      <div className="submit-button-container">
        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Check Performance 🔎
        </button>
        <button type="button" className="reload-button" onClick={handleReload}>
          Reload 🔄️
        </button>
      </div>

      <div className="response-box">
        <h3>Will this Student Pass in there Exam?</h3>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default Survey;
