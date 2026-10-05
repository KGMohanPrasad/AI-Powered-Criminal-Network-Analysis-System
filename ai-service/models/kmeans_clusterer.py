"""
K-Means Clustering Implementation with Silhouette Score & Semantic Profiling
Implemented using NumPy and SciPy.
"""
import numpy as np
from scipy.spatial.distance import cdist


class KMeansClusterer:
    def __init__(self, n_clusters=4, max_iter=300, tol=1e-4, random_state=42):
        self.n_clusters = n_clusters
        self.max_iter = max_iter
        self.tol = tol
        self.random_state = random_state
        self.centroids = None
        self.labels_ = None
        self.inertia_ = 0.0
        self.silhouette_score_ = 0.0
        self.feature_names = []
        self.cluster_profiles = {}

    def fit(self, X, feature_names=None):
        if self.random_state is not None:
            np.random.seed(self.random_state)

        X = np.asarray(X, dtype=np.float64)
        n_samples, n_features = X.shape
        self.feature_names = feature_names or [f"feature_{i}" for i in range(n_features)]

        # K-Means++ Initialization
        self.centroids = np.zeros((self.n_clusters, n_features))
        first_idx = np.random.randint(0, n_samples)
        self.centroids[0] = X[first_idx]

        for k in range(1, self.n_clusters):
            dists = cdist(X, self.centroids[:k], metric='euclidean')
            min_dists = np.min(dists, axis=1)
            probs = (min_dists ** 2) / np.sum(min_dists ** 2)
            next_idx = np.random.choice(n_samples, p=probs)
            self.centroids[k] = X[next_idx]

        # Iterative Optimization (Lloyd's Algorithm)
        for iteration in range(self.max_iter):
            # Assignment step
            dists = cdist(X, self.centroids, metric='euclidean')
            labels = np.argmin(dists, axis=1)

            # Update step
            new_centroids = np.zeros_like(self.centroids)
            for k in range(self.n_clusters):
                cluster_pts = X[labels == k]
                if len(cluster_pts) > 0:
                    new_centroids[k] = np.mean(cluster_pts, axis=0)
                else:
                    new_centroids[k] = X[np.random.randint(0, n_samples)]

            # Check convergence
            shift = np.sum((new_centroids - self.centroids) ** 2)
            self.centroids = new_centroids
            if shift < self.tol:
                break

        self.labels_ = labels

        # Compute Inertia (WCSS)
        dists = cdist(X, self.centroids, metric='euclidean')
        min_dists = np.min(dists, axis=1)
        self.inertia_ = float(np.sum(min_dists ** 2))

        # Compute Silhouette Score
        self.silhouette_score_ = self._compute_silhouette(X, labels)

        # Build descriptive profiles
        self._build_semantic_profiles(X, labels)
        return self

    def _compute_silhouette(self, X, labels):
        n_samples = len(X)
        if self.n_clusters <= 1 or self.n_clusters >= n_samples:
            return 0.0

        silhouette_vals = []
        for i in range(n_samples):
            same_cluster = (labels == labels[i])
            other_clusters = np.unique(labels[labels != labels[i]])

            # a(i): mean intra-cluster distance
            if np.sum(same_cluster) > 1:
                a_i = np.mean(np.linalg.norm(X[same_cluster] - X[i], axis=1))
            else:
                a_i = 0.0

            # b(i): min mean distance to other clusters
            b_vals = []
            for oc in other_clusters:
                b_vals.append(np.mean(np.linalg.norm(X[labels == oc] - X[i], axis=1)))
            b_i = min(b_vals) if b_vals else 0.0

            denom = max(a_i, b_i)
            s_i = (b_i - a_i) / denom if denom > 0 else 0.0
            silhouette_vals.append(s_i)

        return float(np.mean(silhouette_vals))

    def _build_semantic_profiles(self, X, labels):
        self.cluster_profiles = {}
        for k in range(self.n_clusters):
            pts = X[labels == k]
            count = len(pts)
            if count == 0:
                continue
            means = np.mean(pts, axis=0)

            # Determine dominant feature for objective, non-stigmatizing descriptor
            top_feat_idx = int(np.argmax(means))
            top_feat_name = self.feature_names[top_feat_idx].replace('_', ' ').title()

            semantic_name = f"Cluster {k + 1}: {top_feat_name}-Prominent Group"
            if "Connection" in top_feat_name or "Degree" in top_feat_name:
                semantic_name = f"Cluster {k + 1}: Highly Connected Core Entities"
            elif "Communication" in top_feat_name or "Call" in top_feat_name:
                semantic_name = f"Cluster {k + 1}: High-Frequency Communication Nodes"
            elif "Case" in top_feat_name:
                semantic_name = f"Cluster {k + 1}: Multi-Case Associated Entities"
            elif "Location" in top_feat_name:
                semantic_name = f"Cluster {k + 1}: Geographically Distributed Entities"
            elif count < len(X) * 0.15:
                semantic_name = f"Cluster {k + 1}: Peripheral Interaction Cohort"

            self.cluster_profiles[int(k)] = {
                "cluster_id": int(k),
                "cluster_name": semantic_name,
                "size": int(count),
                "percentage": round((count / len(X)) * 100, 1),
                "feature_means": {
                    self.feature_names[f]: round(float(means[f]), 2)
                    for f in range(len(self.feature_names))
                }
            }
