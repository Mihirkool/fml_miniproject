# 🌦️ Weather Forecast Dashboard (Fundamentals of ML Project)

### 📚 Mini Project – Experiment 10  
**By:** Mihir Kulkarni  
**Technologies Used:** Python, Flask, scikit-learn, Pandas, HTML, CSS, JavaScript, Chart.js  
**Dataset:** [Weather Prediction Dataset – Kaggle](https://www.kaggle.com/datasets/muthuj7/weather-dataset)

---

## 🧠 Project Overview

The **Weather Forecast Dashboard** is a complete full-stack machine learning project that predicts the **next-day temperature** and identifies **inherent weather patterns** using clustering.  
This project combines concepts from **Experiment 5 (K-Means Clustering)** and **Experiment 10 (End-to-End ML Solution)** into one integrated system.

We used the *Weather Prediction Dataset* containing daily data such as temperature, humidity, rainfall, pressure, and wind speed from 2000–2020.  
The model analyzes this data, groups similar weather patterns using **K-Means clustering**, and then predicts the next-day temperature using a **Random Forest Regressor**.

The results are displayed on a **web-based dashboard** built with Flask and Chart.js, allowing users to view temperature trends, cluster distributions, and make their own forecasts interactively.

---

## 🏗️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript  
- Chart.js for interactive visualizations  

**Backend:**
- Python (Flask Framework)  
- scikit-learn for ML models  
- Pandas, NumPy for data preprocessing  
- Joblib for model saving and loading  

**Dataset:**
- [Weather Prediction Dataset – Kaggle](https://www.kaggle.com/datasets/muthuj7/weather-dataset)

---

## ⚙️ Features

- 📊 **Clustering using K-Means:** Identifies inherent weather classes such as sunny, humid, or rainy patterns.  
- 🌡️ **Next-Day Forecasting:** Predicts next-day temperature using a Random Forest regression model.  
- 🧩 **Interactive Dashboard:** Displays graphs of historical temperature data and cluster distributions.  
- 🔍 **User Input Forecasting:** Allows users to input weather values and get instant predictions.  
- 🖥️ **End-to-End Integration:** Combines data preprocessing, ML training, Flask API, and web UI.

---

## 🧩 Project Structure

weather-forecast-dashboard/
├── app.py # Flask backend server

├── train_model.py # Data cleaning, clustering & regression model training

├── requirements.txt # Required Python packages

├── data/

│ └── weather.csv # Dataset (download from Kaggle)

├── models/

│ ├── scaler.joblib

│ ├── kmeans.joblib

│ └── rf_regressor.joblib

└── static/

├── index.html # Web dashboard

├── style.css # Styling

└── app.js # Frontend logic (API calls + charts)



---

## 🧮 Machine Learning Workflow

1. **Data Loading & Cleaning:**  
   The dataset is read using Pandas. Missing values are handled, and the date column is converted into datetime format.

2. **Feature Engineering:**  
   Lag features are created to include previous-day weather data for prediction.  

3. **Clustering (Experiment 5 Concept):**  
   - Applied **K-Means** with `k=3` to find weather pattern groups.  
   - StandardScaler is used to normalize data before clustering.  

4. **Regression Model:**  
   - Trained a **Random Forest Regressor** to predict next-day temperature.  
   - Input features: humidity, rainfall, pressure, and lag values.  
   - Output: next-day temperature.  

5. **Model Evaluation:**  
   - Calculated Mean Squared Error (MSE) to assess accuracy.  
   - Saved trained models using Joblib for deployment.

6. **Flask Backend:**  
   - Serves API routes for summary, clustering data, and forecasting.  

7. **Frontend Integration:**  
   - Uses JavaScript to fetch API data and render results on Chart.js visualizations.

---

## 🧰 Installation & Setup

📈 Expected Output

Elbow Method (K=3): Distinct clustering of weather patterns

Regression Accuracy: MSE within acceptable limits for temperature prediction

Dashboard View: Interactive charts + user forecast interface

Prediction Example:
Input: Current weather values → Output: “Predicted next-day temperature: 29.6°C (Cluster 2)”

🧩 Learning Outcomes

Implemented K-Means clustering for unsupervised pattern detection.

Trained Random Forest Regressor for numerical prediction.

Understood end-to-end ML pipeline from preprocessing to deployment.

Integrated Flask backend with HTML/CSS/JS frontend for real-time interaction.

Created a scalable, modular project that can be expanded to predict other weather variables like humidity or rainfall.
