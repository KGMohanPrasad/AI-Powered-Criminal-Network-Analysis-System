"""
Isolation Forest Implementation for Academic Demonstration
Based on Liu, Ting, Zhou (2008) "Isolation Forest".
Implemented using NumPy for high performance, portability, and interpretability.
"""
import numpy as np


class IsolationTreeNode:
    def __init__(self, height_limit):
        self.height_limit = height_limit
        self.size = 0
        self.split_feature = None
        self.split_value = None
        self.left = None
        self.right = None

    def fit(self, X, current_height=0):
        self.size = len(X)
        if current_height >= self.height_limit or self.size <= 1:
            return self

        num_features = X.shape[1]
        # Randomly select a feature
        self.split_feature = int(np.random.randint(0, num_features))
        feat_vals = X[:, self.split_feature]
        min_v, max_v = float(feat_vals.min()), float(feat_vals.max())
        if min_v == max_v:
            return self

        # Randomly select a split point between min and max
        self.split_value = float(np.random.uniform(min_v, max_v))
        left_mask = feat_vals < self.split_value

        self.left = IsolationTreeNode(self.height_limit).fit(X[left_mask], current_height + 1)
        self.right = IsolationTreeNode(self.height_limit).fit(X[~left_mask], current_height + 1)
        return self

    def path_length(self, x, current_height=0, feature_depths=None):
        if self.left is None or self.right is None:
            return current_height + self._c(self.size)

        if feature_depths is not None and self.split_feature is not None:
            feature_depths[self.split_feature].append(current_height)

        if x[self.split_feature] < self.split_value:
            return self.left.path_length(x, current_height + 1, feature_depths)
        else:
            return self.right.path_length(x, current_height + 1, feature_depths)

    @staticmethod
    def _c(n):
        """Average path length of unsuccessful search in Binary Search Tree."""
        if n <= 1:
            return 0.0
        if n == 2:
            return 1.0
        # Euler-Mascheroni constant = 0.5772156649
        return 2.0 * (np.log(n - 1.0) + 0.5772156649) - (2.0 * (n - 1.0) / float(n))


class IsolationForestModel:
    """
    Ensemble of Isolation Trees.
    """
    def __init__(self, n_estimators=100, max_samples=256, contamination=0.1, random_state=42):
        self.n_estimators = n_estimators
        self.max_samples = max_samples
        self.contamination = contamination
        self.random_state = random_state
        self.trees = []
        self.c_factor = 0.0
        self.feature_names = []
        self.threshold = 0.60
        self.sample_size = 0
        self.is_fitted = False

    def fit(self, X, feature_names=None):
        if self.random_state is not None:
            np.random.seed(self.random_state)

        X = np.asarray(X, dtype=np.float64)
        n_samples, n_features = X.shape
        self.sample_size = n_samples
        self.feature_names = feature_names or [f"feature_{i}" for i in range(n_features)]

        subsample_size = min(n_samples, self.max_samples)
        height_limit = int(np.ceil(np.log2(max(subsample_size, 2))))
        self.c_factor = IsolationTreeNode._c(subsample_size)

        self.trees = []
        for _ in range(self.n_estimators):
            indices = np.random.choice(n_samples, subsample_size, replace=False)
            tree = IsolationTreeNode(height_limit).fit(X[indices])
            self.trees.append(tree)

        self.is_fitted = True
        scores = self.decision_function(X)
        # Determine empirical threshold from contamination parameter
        self.threshold = float(np.percentile(scores, 100 * (1 - self.contamination)))
        return self

    def decision_function(self, X):
        """
        Calculates anomaly score s(x, n) = 2^(- E(h(x)) / c(n)).
        Values close to 1 indicate anomalies; values below 0.5 indicate normal points.
        """
        X = np.asarray(X, dtype=np.float64)
        c = self.c_factor if self.c_factor > 0 else 1.0

        scores = []
        for x in X:
            lengths = [t.path_length(x) for t in self.trees]
            avg_length = np.mean(lengths)
            score = 2.0 ** (- (avg_length / c))
            scores.append(float(score))

        return np.array(scores)

    def predict_explain(self, X, baseline_means=None, baseline_stds=None):
        """
        Predicts anomaly status and returns explainable feature contributions.
        """
        X = np.asarray(X, dtype=np.float64)
        scores = self.decision_function(X)

        results = []
        for i, (x, score) in enumerate(zip(X, scores)):
            is_anomaly = bool(score >= self.threshold)

            # Feature depth analysis (features that split earliest contribute most to anomaly)
            feat_depths = {f: [] for f in range(len(self.feature_names))}
            for t in self.trees[:30]:  # sample trees for explanation speed
                t.path_length(x, 0, feat_depths)

            feat_contribs = {}
            for f_idx, depths in feat_depths.items():
                fname = self.feature_names[f_idx]
                if depths:
                    # Shorter depth = higher contribution
                    importance = float(np.exp(-np.mean(depths)))
                else:
                    importance = 0.05
                feat_contribs[fname] = importance

            # Normalize feature contributions to sum to 100%
            total_imp = sum(feat_contribs.values()) or 1.0
            feat_percentages = {k: round((v / total_imp) * 100, 1) for k, v in feat_contribs.items()}

            # Generate natural language explanation
            sorted_feats = sorted(feat_percentages.items(), key=lambda item: item[1], reverse=True)
            reasons = []
            for fname, pct in sorted_feats[:3]:
                feat_idx = self.feature_names.index(fname)
                val = x[feat_idx]
                base_str = ""
                if baseline_means is not None and baseline_stds is not None:
                    mean_val = baseline_means[feat_idx]
                    std_val = baseline_stds[feat_idx] if baseline_stds[feat_idx] > 0 else 1.0
                    z = (val - mean_val) / std_val
                    if z > 1.5:
                        base_str = f" ({round(val, 1)} is +{round(z, 1)} std dev above synthetic baseline {round(mean_val, 1)})"
                    elif z < -1.5:
                        base_str = f" ({round(val, 1)} is {round(z, 1)} std dev below synthetic baseline {round(mean_val, 1)})"
                reasons.append(f"Significant variance in '{fname.replace('_', ' ').title()}' contributing {pct}%{base_str}.")

            results.append({
                "index": i,
                "anomaly_score": round(float(score), 4),
                "is_anomaly": is_anomaly,
                "threshold": round(self.threshold, 4),
                "feature_importance": feat_percentages,
                "reasons": reasons,
                "status": "REQUIRES_HUMAN_REVIEW" if is_anomaly else "NORMAL"
            })

        return results
