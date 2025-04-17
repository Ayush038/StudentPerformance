from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Load model and encoders
model = joblib.load("student_performance_model.pkl")
le_activity = joblib.load("le_activity.pkl")
le_parent_edu = joblib.load("le_parent_edu.pkl")
le_passed = joblib.load("le_passed.pkl")

# Define request format
class StudentData(BaseModel):
    Study_Hours_per_Week: float
    Attendance_Rate: float
    Previous_Grades: float
    Participation_in_Extracurricular_Activities: str
    Parent_Education_Level: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/predict")
def predict(data: StudentData):
    # Preprocess input
    activity_encoded = le_activity.transform([data.Participation_in_Extracurricular_Activities])[0]
    parent_edu_encoded = le_parent_edu.transform([data.Parent_Education_Level])[0]

    features = np.array([
        data.Study_Hours_per_Week,
        data.Attendance_Rate,
        data.Previous_Grades,
        activity_encoded,
        parent_edu_encoded
    ]).reshape(1, -1)

    # Make prediction
    pred = model.predict(features)[0]
    pred_label = le_passed.inverse_transform([pred])[0]

    return {"prediction": pred_label}
