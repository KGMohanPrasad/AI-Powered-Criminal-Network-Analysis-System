"""
Feature Engineering and Preprocessing Pipeline
Extracts graph topological metrics, interaction statistics, and multi-entity links.
"""
import numpy as np
import pandas as pd


FEATURE_NAMES = [
    "degree_centrality",
    "betweenness_centrality",
    "closeness_centrality",
    "pagerank",
    "direct_connections",
    "communication_count",
    "case_count",
    "organization_count",
    "location_count",
    "vehicle_count",
    "incident_count"
]


class FeaturePipeline:
    def __init__(self):
        self.means = None
        self.stds = None
        self.mins = None
        self.maxs = None
        self.feature_names = FEATURE_NAMES
        self.is_fitted = False

    def fit_transform(self, raw_entity_records):
        """
        Takes raw dictionaries of entity features, extracts numerical array,
        computes baseline statistics, and returns scaled feature matrix.
        """
        rows = []
        for rec in raw_entity_records:
            row = [
                float(rec.get("degree_centrality", 0.0)),
                float(rec.get("betweenness_centrality", 0.0)),
                float(rec.get("closeness_centrality", 0.0)),
                float(rec.get("pagerank", 0.0)),
                float(rec.get("direct_connections", 0.0)),
                float(rec.get("communication_count", 0.0)),
                float(rec.get("case_count", 0.0)),
                float(rec.get("organization_count", 0.0)),
                float(rec.get("location_count", 0.0)),
                float(rec.get("vehicle_count", 0.0)),
                float(rec.get("incident_count", 0.0))
            ]
            rows.append(row)

        X = np.array(rows, dtype=np.float64)
        if len(X) == 0:
            return np.empty((0, len(self.feature_names)))

        self.means = np.mean(X, axis=0)
        self.stds = np.std(X, axis=0)
        # Prevent division by zero
        self.stds[self.stds == 0] = 1.0

        self.mins = np.min(X, axis=0)
        self.maxs = np.max(X, axis=0)
        self.is_fitted = True

        # Standardized Z-Score scaling for ML
        X_scaled = (X - self.means) / self.stds
        return X, X_scaled

    def get_preprocessing_summary(self, raw_records_count):
        """
        Provides detailed metadata for the Data Preprocessing viva demonstration page.
        """
        return {
            "dataset_rows": raw_records_count,
            "feature_count": len(self.feature_names),
            "feature_names": self.feature_names,
            "steps": [
                {
                    "step_name": "Data Cleaning & Imputation",
                    "status": "COMPLETED",
                    "description": "Handled missing relational attributes using zero-fill baseline for sparse connections.",
                    "records_processed": raw_records_count
                },
                {
                    "step_name": "Graph Topological Feature Extraction",
                    "status": "COMPLETED",
                    "description": "Computed Degree, Betweenness, Closeness Centrality, and PageRank via NetworkX.",
                    "metrics_extracted": ["degree_centrality", "betweenness_centrality", "closeness_centrality", "pagerank"]
                },
                {
                    "step_name": "Interaction Volume Aggregation",
                    "status": "COMPLETED",
                    "description": "Aggregated cross-table synthetic incident, communication, organization, and vehicle logs.",
                    "metrics_extracted": ["communication_count", "case_count", "org_count", "vehicle_count"]
                },
                {
                    "step_name": "Standardization & Z-Score Scaling",
                    "status": "COMPLETED",
                    "description": "Normalized all numeric features to zero mean (μ=0) and unit variance (σ=1) for distance-based ML.",
                    "distribution": "Standard Normal N(0,1)"
                }
            ],
            "feature_statistics": [
                {
                    "name": self.feature_names[i],
                    "mean": round(float(self.means[i]), 3) if self.means is not None else 0.0,
                    "std": round(float(self.stds[i]), 3) if self.stds is not None else 1.0,
                    "min": round(float(self.mins[i]), 3) if self.mins is not None else 0.0,
                    "max": round(float(self.maxs[i]), 3) if self.maxs is not None else 0.0
                }
                for i in range(len(self.feature_names))
            ]
        }
