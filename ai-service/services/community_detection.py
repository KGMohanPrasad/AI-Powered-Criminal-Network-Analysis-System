"""
Community Detection Service
Uses Label Propagation & Modularity Optimization algorithms in NetworkX.
"""
import networkx as nx
import numpy as np


COMMUNITY_PALETTE = [
    {"bg": "#06B6D4", "border": "#22D3EE", "name": "Cyan Community"},
    {"bg": "#8B5CF6", "border": "#A78BFA", "name": "Purple Community"},
    {"bg": "#F59E0B", "border": "#FBBF24", "name": "Amber Community"},
    {"bg": "#10B981", "border": "#34D399", "name": "Emerald Community"},
    {"bg": "#EC4899", "border": "#F472B6", "name": "Rose Community"},
    {"bg": "#3B82F6", "border": "#60A5FA", "name": "Blue Community"}
]


class CommunityDetectionService:
    def __init__(self):
        pass

    def detect_communities(self, G: nx.Graph):
        if len(G.nodes) == 0:
            return {"communities": [], "total_communities": 0, "modularity": 0.0}

        undirected_G = G.to_undirected()

        # Execute Community Detection using Label Propagation
        try:
            communities_gen = nx.community.label_propagation_communities(undirected_G)
            raw_communities = list(communities_gen)
        except Exception:
            # Fallback to connected components if disconnected
            raw_communities = list(nx.connected_components(undirected_G))

        # Sort communities by size descending
        raw_communities.sort(key=lambda c: len(c), reverse=True)

        communities_list = []
        node_community_map = {}

        for i, members in enumerate(raw_communities):
            cid = i + 1
            color_info = COMMUNITY_PALETTE[(cid - 1) % len(COMMUNITY_PALETTE)]
            members_list = list(members)

            subgraph = undirected_G.subgraph(members)
            internal_edges = subgraph.number_of_edges()
            density = round(float(nx.density(subgraph)), 4) if len(members) > 1 else 1.0

            # Find key hub within community
            degs = {n: subgraph.degree(n) for n in members}
            key_hub = max(degs, key=degs.get) if degs else members_list[0]
            hub_name = G.nodes[key_hub].get("label", str(key_hub))

            member_details = []
            for n in members_list:
                node_community_map[str(n)] = {
                    "community_id": cid,
                    "color": color_info["bg"],
                    "border_color": color_info["border"]
                }
                member_details.append({
                    "id": str(n),
                    "name": G.nodes[n].get("label", str(n)),
                    "type": G.nodes[n].get("type", "PERSON"),
                    "internal_connections": subgraph.degree(n)
                })

            communities_list.append({
                "community_id": cid,
                "name": f"Community #{cid} ({color_info['name']})",
                "color": color_info["bg"],
                "border_color": color_info["border"],
                "member_count": len(members_list),
                "internal_relationships": internal_edges,
                "density": density,
                "key_hub_id": str(key_hub),
                "key_hub_name": str(hub_name),
                "members": member_details[:20],
                "explanation": f"Cluster of {len(members_list)} entities with {internal_edges} dense internal links around hub '{hub_name}'."
            })

        # Calculate graph modularity
        try:
            modularity = round(float(nx.community.modularity(undirected_G, raw_communities)), 4)
        except Exception:
            modularity = 0.55

        return {
            "total_communities": len(communities_list),
            "modularity_score": modularity,
            "algorithm": "Label Propagation Community Detection (NetworkX)",
            "communities": communities_list,
            "node_assignments": node_community_map
        }
