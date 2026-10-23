# 🌦️ WeatherGuard

### Smart Weather Forecast and Government Disaster Alert System

WeatherGuard is a multi-hazard weather monitoring and disaster-risk alert platform designed for Kerala. It uses weather data, hazard-specific risk assessment models, and interactive district-level visualizations to help users understand potential weather-related threats and improve disaster preparedness.

## ✨ Features

- **Weather Monitoring:** Retrieves weather information and forecasts using the Open-Meteo API.
- **Multi-Hazard Risk Assessment:** Supports monitoring of rain, floods, cyclones, and heatwaves through hazard-specific assessment models.
- **District-Level Visualization:** Presents weather and risk information for Kerala's districts.
- **Risk Alerts:** Identifies weather conditions that may require attention.
- **Seasonal Flood Outlook:** Includes an experimental machine-learning classifier based on historical Kerala rainfall data.
- **Weather History:** Provides access to available historical weather records.
- **Disaster Management Guidelines:** Offers guidance to help users prepare for weather-related hazards.
- **User Authentication:** Uses JWT-based authentication and BCrypt password hashing.

## 🛠️ Technologies Used

| Component | Technology |
|---|---|
| Frontend | React.js |
| Backend | Java, Spring Boot |
| Database | MySQL |
| Weather Data | Open-Meteo API |
| Machine Learning | Python, Scikit-learn |
| Data Processing | Pandas |
| Visualization | Recharts |
| Authentication | JWT, BCrypt |
| Version Control | Git and GitHub |

## 🤖 Machine Learning

WeatherGuard includes an experimental seasonal flood classification component trained using historical Kerala rainfall data. The classifier uses annual and monsoon rainfall features with Logistic Regression to estimate flood-related outcomes.

This historical classifier is intended to support seasonal risk awareness. It should not be interpreted as an official flood warning or a guaranteed real-time prediction.

## 🎯 Project Objectives

- Monitor weather conditions relevant to Kerala.
- Assess risks associated with multiple weather hazards.
- Present weather and risk information in an accessible interface.
- Support public awareness and disaster preparedness.
- Explore the use of historical rainfall data for seasonal flood classification.

## 🏗️ Project Architecture

WeatherGuard follows a client-server architecture:

- **Frontend:** Displays weather information, hazard assessments, visualizations, and guidelines.
- **Backend:** Handles application logic, API requests, authentication, and data processing.
- **Database:** Stores application data.
- **External Weather API:** Supplies weather information.
- **Machine Learning Component:** Supports experimental seasonal flood classification.

## 🚀 Future Enhancements

- Integration with verified official disaster-warning feeds.
- Improved validation of hazard-specific models.
- Enhanced district-level risk visualization.
- Expanded historical datasets and model evaluation.
- Mobile-friendly alerts and notification support.

## ⚠️ Disclaimer

WeatherGuard is an academic project developed for educational and disaster-awareness purposes. Its assessments are not a substitute for official warnings issued by the India Meteorological Department (IMD), Kerala State Disaster Management Authority (KSDMA), or other authorized agencies.

## 👩‍💻 Project Information

- **Project:** WeatherGuard
- **Programme:** Master of Computer Applications (MCA)
- **Institution:** Muthoot Institute of Technology & Science, Kerala
- **Repository:** [WeatherGuard on GitHub](https://github.com/NandanaRajesh004/Weather_Guard)

---

*Developed as an MCA mini project to explore weather monitoring, multi-hazard risk assessment, and disaster preparedness.*
