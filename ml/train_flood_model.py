"""
WeatherGuard - Seasonal Flood Outlook Model Training
Trains a logistic regression model on 118 years (1901-2018) of Kerala
rainfall data to predict flood-year likelihood from annual and monsoon
(Jun-Sep) rainfall totals. The resulting coefficients are deployed into
the Spring Boot backend (SeasonalFloodOutlookService.java).
"""

import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

df = pd.read_csv('kerala_rainfall.csv')
df.columns = [c.strip() for c in df.columns]
df['FLOOD_LABEL'] = (df['FLOODS'] == 'YES').astype(int)
df['MONSOON'] = df['JUN'] + df['JUL'] + df['AUG'] + df['SEP']

X = df[['ANNUAL RAINFALL', 'MONSOON']]
y = df['FLOOD_LABEL']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = LogisticRegression()
model.fit(X_train, y_train)

preds = model.predict(X_test)
print("Test accuracy:", accuracy_score(y_test, preds))
print(classification_report(y_test, preds))
print("Intercept:", model.intercept_[0])
print("Coefficients [annual, monsoon]:", model.coef_[0])