"""
Clustering Service using K-Means and Silhouette Optimization
Categorizes synthetic entities into descriptive structural cohorts.
"""
from models.kmeans_clusterer import KMeansClusterer
from utils.feature_engineering import FeaturePipeline


class ClusteringService:
    def __init__(self, n_clusters=4):
        self.n_clusters = n_clusters
        self.clusterer = KMeansClusterer(n_clusters=n_clusters, random_state=42)
        self.pipeline = FeaturePipeline()

    def run_clustering(self, entity_records):
        if not entity_records or len(entity_records) < self.n_clusters:
            return {"clusters": [], "silhouette_score": 0.0, "total_entities": 0}

        X_raw, X_scaled = self.pipeline.fit_transform(entity_records)
        self.clusterer.fit(X_scaled, self.pipeline.feature_names)

        # Attach member node summaries to clusters
        clusters_output = []
        for k, profile in self.clusterer.cluster_profiles.items():
            member_indices = [i for i, lbl in enumerate(self.clusterer.labels_) if lbl == k]
            members = [
                {
                    "entity_id": str(entity_records[idx].get("id", f"NODE-{idx}")),
                    "name": str(entity_records[idx].get("name", f"Entity {idx}")),
                    "type": entity_records[idx].get("type", "PERSON"),
                    "direct_connections": entity_records[idx].get("direct_connections", 0),
                    "communication_count": entity_records[idx].get("communication_count", 0)
                }
                for idx in member_indices[:15]
            ]
            clusters_output.append({
                **profile,
                "members": members
            })

        return {
            "algorithm": "K-Means Clustering (K=4, Lloyd EM with K-Means++ Initialization)",
            "total_entities": len(entity_records),
            "clusters_count": len(clusters_output),
            "silhouette_score": round(self.clusterer.silhouette_score_, 4),
            "inertia_wcss": round(self.clusterer.inertia_, 2),
            "clusters": clusters_output
        }
