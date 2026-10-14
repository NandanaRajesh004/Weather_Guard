"""
WeatherGuard - Seasonal flood-year classifier

Trains a logistic regression on yearly Kerala rainfall (1901-2018) to classify a
year as flood / no-flood from annual and monsoon (Jun-Sep) rainfall totals.
Prints cross-validated metrics, then fits on all years and prints the
coefficients that are copied into SeasonalFloodOutlookService.java.

Run:  pip install pandas scikit-learn
      python train_flood_model.py
"""

import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.model_selection import StratifiedKFold, cross_val_predict, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

df = pd.read_csv('kerala_rainfall.csv')
df.columns = [c.strip() for c in df.columns]
df['FLOOD'] = (df['FLOODS'].str.strip() == 'YES').astype(int)
df['MONSOON'] = df[['JUN', 'JUL', 'AUG', 'SEP']].sum(axis=1)

y = df['FLOOD']
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

print('Years:', len(df), '| flood years:', int(y.sum()))
print('Baseline (always guess the majority class): %.3f' % max(y.mean(), 1 - y.mean()))

# 1. The deployed model: annual + monsoon rainfall
X = df[['ANNUAL RAINFALL', 'MONSOON']]
model = LogisticRegression(max_iter=1000)
pred = cross_val_predict(model, X, y, cv=cv)
print('\nAnnual + monsoon model, 5-fold cross-validation')
print('  accuracy: %.3f' % accuracy_score(y, pred))
print('  confusion matrix [[TN FP] [FN TP]]:')
print(confusion_matrix(y, pred))

# 2. How separable are the labels?
no_flood_max = df[y == 0]['ANNUAL RAINFALL'].max()
flood_min = df[y == 1]['ANNUAL RAINFALL'].min()
print('\nHighest no-flood year: %.1f mm | lowest flood year: %.1f mm' % (no_flood_max, flood_min))
print('The labels behave like an annual-rainfall cut-off near 2925 mm.')

# 3. Forecast setting: only rainfall that has fallen by the end of a month
months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG']
print('\nEarly-season models (cumulative rainfall up to the month), 5-fold CV accuracy')
for end in ['MAY', 'JUN', 'JUL', 'AUG']:
    cols = months[:months.index(end) + 1]
    Xe = pd.DataFrame({'cumulative': df[cols].sum(axis=1)})
    scores = cross_val_score(make_pipeline(StandardScaler(), LogisticRegression()), Xe, y, cv=cv)
    print('  Jan-%s: %.3f' % (end, scores.mean()))

# 4. Final model on all years: these numbers go into the Java service
model.fit(X, y)
print('\nCoefficients to copy into SeasonalFloodOutlookService.java')
print('  INTERCEPT    =', model.intercept_[0])
print('  COEF_ANNUAL  =', model.coef_[0][0])
print('  COEF_MONSOON =', model.coef_[0][1])