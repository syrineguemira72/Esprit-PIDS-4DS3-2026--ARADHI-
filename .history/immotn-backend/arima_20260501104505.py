# arima.py
import numpy as np

class SimpleARIMA:
    def __init__(self, p=2, d=1, q=1):
        self.p, self.d, self.q = p, d, q

    def difference(self, y, d):
        for _ in range(d): y = np.diff(y)
        return y

    def fit(self, y):
        self.orig = np.array(y, dtype=float)
        diff_y = self.difference(self.orig, self.d)
        self.mean_diff = diff_y.mean()
        diff_y = diff_y - self.mean_diff
        N = len(diff_y)
        self.residuals = np.zeros(N)
        if self.p > 0 and N > self.p:
            X = np.column_stack([diff_y[i:N-self.p+i] for i in range(self.p)])
            Y = diff_y[self.p:]
            self.ar_coefs = np.linalg.lstsq(X, Y, rcond=None)[0]
            pred_ar = X @ self.ar_coefs
            self.residuals[self.p:] = Y - pred_ar
        else:
            self.ar_coefs = np.zeros(self.p)
        return self

    def forecast(self, steps):
        diff_y = self.difference(self.orig, self.d) - self.mean_diff
        history  = list(diff_y)
        res_hist = list(self.residuals)
        forecasts_diff = []
        for _ in range(steps):
            ar_term = sum(self.ar_coefs[i] * history[-(i+1)]
                         for i in range(self.p)) if self.p > 0 else 0
            ma_term = res_hist[-1] * 0.3 if self.q > 0 else 0
            pred = ar_term + ma_term + self.mean_diff
            forecasts_diff.append(pred)
            history.append(pred)
            res_hist.append(0)
        result = []
        last = self.orig[-1]
        for v in forecasts_diff:
            last = last + v
            result.append(last)
        return np.array(result)