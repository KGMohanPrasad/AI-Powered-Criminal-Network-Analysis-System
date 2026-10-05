# MASTER PROMPT — AIML PROJECT



Build and improve my project:



# AI-Powered Criminal Network Analysis System



This is an **Artificial Intelligence and Machine Learning academic project**.



The website must clearly demonstrate:



- AI

- Machine Learning

- Graph Analysis

- Data Analysis

- Pattern Detection

- Network Analysis

- Anomaly Detection

- Clustering

- Link Prediction

- Explainable Results



The project should NOT behave like a simple CRUD website.



The AI/ML components must be visible, understandable, demonstrable, and connected with the full-stack website.



Use only **synthetic/demo criminal-network data**.



Do NOT use real criminal records, facial recognition, biometric identification, automated guilt prediction, or real-person surveillance.



The project must clearly state:



"AI results are analytical indicators for academic demonstration and require human verification."



---



# 1. MAIN PROJECT OBJECTIVE



The system should analyze a fictional criminal-network dataset and help investigators understand:



- Connections between people

- Groups inside a network

- Important bridge nodes

- Suspicious interaction patterns

- Abnormal communication behavior

- Similar investigation cases

- Possible missing connections

- Changes in network structure

- Frequent shared locations

- Common organization links



The system should use AI/ML and graph algorithms to generate these insights.



---



# 2. RECOMMENDED TECH STACK



Frontend:



- React

- Vite

- JavaScript

- Tailwind CSS

- Framer Motion



Backend:



- Java 21

- Spring Boot

- Spring Data JPA

- Hibernate

- REST API

- Spring Security

- JWT



Database:



- MySQL



AI/ML Service:



Use Python.



Recommended:



- Python

- FastAPI

- Pandas

- NumPy

- Scikit-learn

- NetworkX



Optional:



- XGBoost

- PyTorch Geometric

- Matplotlib



Architecture:



React Frontend



↓



Spring Boot Backend



↓



MySQL Database



AND



Spring Boot



↓



Python AIML Microservice



The Spring Boot backend should communicate with the Python AIML service through REST APIs.



---



# 3. PROJECT ARCHITECTURE



Create:



criminal-network-analysis/



frontend/



backend/



ai-service/



database/



docs/



Inside ai-service:



app.py



models/



services/



algorithms/



data/



utils/



requirements.txt



Example:



ai-service/

├── app.py

├── models/

├── services/

│   ├── network_analysis.py

│   ├── anomaly_detection.py

│   ├── clustering.py

│   ├── link_prediction.py

│   └── case_similarity.py

├── utils/

├── data/

└── requirements.txt



---



# 4. AIML DASHBOARD



Create a dedicated:



# AI Intelligence Dashboard



Show:



Total Network Nodes



Total Relationships



Detected Communities



Potential Links



Anomalies Detected



Bridge Nodes



High-Connectivity Nodes



Recently Changed Network Areas



Display these as modern KPI cards.



---



# 5. NETWORK ANALYSIS



Use NetworkX.



Analyze:



Degree Centrality



Betweenness Centrality



Closeness Centrality



PageRank



Connected Components



Node Degree



Network Density



Shortest Path



Community Structure



Display results visually.



Do NOT convert these measurements into statements such as:



"Most dangerous criminal"



Instead say:



"Highest connectivity within this selected synthetic network."



---



# 6. DEGREE CENTRALITY



Calculate which nodes have the largest number of direct connections.



Example result:



Entity:

DEMO-P014



Degree Centrality:

0.76



Direct Connections:

14



Explanation:



"This entity has many direct connections within the selected network."



Add a button:



View Connections



---



# 7. BETWEENNESS CENTRALITY



Calculate which entities connect otherwise separate groups.



Example:



Entity:

DEMO-P008



Betweenness:

0.68



Explanation:



"This entity acts as a bridge between multiple network groups."



Visualize these nodes differently in the graph.



---



# 8. CLOSENESS CENTRALITY



Show entities that can reach other entities through fewer graph steps.



Example:



Entity:

DEMO-P005



Closeness:

0.74



Explain:



"This entity is structurally close to many entities in this synthetic network."



---



# 9. PAGERANK



Use PageRank as a graph-importance measurement.



Display:



Entity



PageRank Score



Number of Connections



Related Cases



Important:



Explain that PageRank represents graph structure only and does NOT indicate guilt.



---



# 10. COMMUNITY DETECTION



This should be one of the main AIML features.



Use:



Louvain Community Detection



OR



Label Propagation



OR



Girvan-Newman



Detect network communities.



Example:



Community 1



12 entities



32 relationships



Community 2



8 entities



18 relationships



Community 3



15 entities



41 relationships



Show communities in different graph colors.



---



# 11. CLUSTER ANALYSIS



Use unsupervised ML.



Recommended:



K-Means



DBSCAN



Hierarchical Clustering



Create features such as:



Connection count



Communication frequency



Case count



Organization count



Location count



Vehicle count



Network centrality



Then cluster entities.



Example:



Cluster 1:

Highly Connected Entities



Cluster 2:

Low Activity Entities



Cluster 3:

Communication-Heavy Entities



Do NOT call clusters:



Dangerous



Criminal



Safe



Threat



Keep cluster labels descriptive.



---



# 12. ANOMALY DETECTION



Use ML anomaly detection.



Recommended:



Isolation Forest



Possible input features:



Communication frequency



Sudden network growth



Number of new connections



Repeated location activity



Organization overlap



Connection count changes



Output example:



Anomaly Detected



Entity:

DEMO-P021



Anomaly Score:

0.82



Reasons:



Communication count increased sharply.



Three new network relationships appeared.



Two new shared locations were recorded.



Status:



Requires Human Review



---



# 13. ANOMALY EXPLANATION



Never show only a score.



Always explain:



Why it was detected



Input features



Compared baseline



Relevant records



Confidence/score limitations



Example:



Detected because the communication frequency is significantly higher than this entity's previous synthetic activity pattern.



---



# 14. LINK PREDICTION



Create an AIML / graph-analysis link prediction module.



Predict possible missing network edges using synthetic graph information.



Recommended algorithms:



Common Neighbors



Jaccard Coefficient



Adamic-Adar Index



Preferential Attachment



Optional advanced model:



Graph Neural Network



Output:



Potential Relationship



Entity A:

DEMO-P003



Entity B:

DEMO-P018



Link Score:

78%



Supporting Graph Signals:



4 common neighbors



2 shared locations



1 shared organization



Button:



Review Relationship



Buttons:



Accept as Investigation Lead



Reject Suggestion



Never automatically create a verified relationship.



---



# 15. CASE SIMILARITY ML



Create case similarity analysis.



Convert case attributes into feature vectors.



Possible features:



Incident type



Location



Organization involvement



Network structure



Evidence category



Vehicle involvement



Time patterns



Use:



Cosine Similarity



Optional:



K-Nearest Neighbors



Display:



CASE-2026-001



Similar to



CASE-2026-009



Similarity:

74%



Shared Features:



Same incident category



Similar location profile



Common organization type



Similar network density



---



# 16. NETWORK CHANGE DETECTION



Compare network state across time periods.



Example:



Previous Month



vs



Current Month



Identify:



New nodes



New relationships



Removed relationships



New clusters



Merged communities



New bridge nodes



Create a visual comparison.



---



# 17. TIME-BASED ANALYSIS



Allow:



Last 7 days



30 days



90 days



Custom Date Range



Show:



New relationships



Incident count



Network growth



Communication frequency



Community changes



Anomalies



---



# 18. INTERACTIVE NETWORK GRAPH



Use Cytoscape.js.



Nodes represent:



Person



Organization



Vehicle



Location



Case



Incident



Phone



Evidence



Edges represent:



Associated With



Owns



Works For



Communicated With



Located At



Involved In Case



Related To



Shared Organization



Shared Location



---



# 19. AI GRAPH VISUALIZATION



Use special visualization for ML output.



Normal Node:

standard border



Community:

community color



Potential Link:

dashed line



Anomaly:

special warning indicator



Bridge Node:

highlighted border



Selected Node:

animated focus ring



Add legend.



---



# 20. NETWORK FILTERS



Allow filtering by:



Node Type



Relationship Type



Case



Community



Anomaly Status



Centrality Range



Date



Location



Organization



---



# 21. NETWORK PATH ANALYSIS



Select:



Source Entity



Target Entity



Click:



Find Path



Show shortest graph path.



Example:



Person A



↓



Organization X



↓



Person B



↓



Vehicle Y



↓



Person C



Show:



Number of hops



Relationship types



Related cases



This is graph analysis, not AI prediction.



---



# 22. MODEL TRAINING PAGE



Create a dedicated:



# Model Training



page.



Show available ML models.



Example:



Anomaly Detection



Algorithm:

Isolation Forest



Status:

Trained



Samples:

450



Features:

8



Last Trained:

29 September 2026



Button:



Train Model



Retrain Model



---



# 23. MODEL PERFORMANCE PAGE



For supervised models, show proper metrics if applicable.



Possible metrics:



Accuracy



Precision



Recall



F1 Score



Confusion Matrix



ROC Curve



For unsupervised models show:



Silhouette Score



Cluster Count



Noise Samples



Anomaly Distribution



Do NOT show fake metrics.



Metrics must come from actual model output.



---



# 24. FEATURE IMPORTANCE



Where the model supports feature importance, display it.



Example:



Communication Frequency — 28%



New Connections — 24%



Shared Locations — 18%



Case Count — 15%



Organization Links — 10%



Vehicle Links — 5%



Use a horizontal bar chart.



---



# 25. AIML MODEL EXPLANATION



Every model page must explain:



Algorithm Used



Why it is Used



Input Data



Features



Output



Limitations



Example:



Algorithm:

Isolation Forest



Purpose:

Detect unusual patterns in synthetic network activity.



Input:

Network and interaction statistics.



Output:

Anomaly score.



Limitation:

An anomaly does not prove wrongdoing.



---



# 26. MODEL COMPARISON



Create a comparison page.



Example:



Anomaly Detection:



Isolation Forest



vs



Local Outlier Factor



Compare:



Runtime



Number of anomalies



Stability



Available metrics



Do not fabricate winner labels.



---



# 27. DATASET PAGE



Create:



# Dataset Explorer



Show dataset statistics.



Examples:



Persons:

100



Relationships:

350



Cases:

30



Organizations:

20



Vehicles:

40



Incidents:

75



Show columns/features.



Allow:



Preview data



Search



Filter



Sort



Export CSV



---



# 28. DATA PREPROCESSING PAGE



Show AIML preprocessing steps.



Example:



Missing Values



Duplicate Removal



Categorical Encoding



Normalization



Feature Scaling



Feature Engineering



Graph Construction



Display status:



Completed



Show:



Before preprocessing



After preprocessing



This is important for faculty demonstration.



---



# 29. FEATURE ENGINEERING



Generate features such as:



degree



betweenness



closeness



pagerank



communication_count



case_count



vehicle_count



organization_count



location_count



shared_contact_count



new_relationship_count



incident_count



These features should feed ML models.



---



# 30. MODEL PIPELINE VISUALIZATION



Create a pipeline diagram:



Synthetic Dataset



↓



Data Cleaning



↓



Feature Engineering



↓



Graph Construction



↓



ML Model



↓



Prediction / Analysis



↓



Explanation



↓



Human Review



Show this on the AIML dashboard.



---



# 31. AI ANALYSIS PAGE



Create tabs:



Network Analysis



Community Detection



Anomaly Detection



Link Prediction



Case Similarity



Model Metrics



Dataset



Preprocessing



---



# 32. PERSON PROFILE ML INSIGHTS



Inside a person profile add:



# Network Analytics



Show:



Degree Centrality



Betweenness



Closeness



PageRank



Community



Connection Count



Anomaly Indicator



Possible Link Suggestions



Clearly label:



Analytical Data



Not Criminal Determination



---



# 33. CASE ML INSIGHTS



Inside case page show:



Network Size



Network Density



Detected Communities



Bridge Nodes



Anomalies



Potential Links



Similar Cases



Allow:



Run Analysis



---



# 34. RULE + ML SEPARATION



Clearly separate:



Database Facts



Rule-Based Alerts



ML Analysis



Example:



FACT



5 communications recorded.



RULE ALERT



Case not updated for 10 days.



ML INSIGHT



Communication pattern is unusual compared with historical synthetic activity.



Never mix these together.



---



# 35. FULL-STACK CASE MANAGEMENT



Keep standard website features too.



Include:



Dashboard



Cases



Persons



Evidence



Incidents



Organizations



Vehicles



Locations



Communications



Network



AI Intelligence



Reports



Users



Audit Logs



Settings



---



# 36. DASHBOARD



Show:



Active Cases



Persons



Evidence



Incidents



Relationships



AI Anomalies



Detected Communities



Potential Links



Then charts:



Case Trend



Network Growth



Anomaly Distribution



Community Size



Incident Categories



Communication Trend



---



# 37. CASE MANAGEMENT



CRUD operations:



Create



View



Edit



Archive



Search



Filter



Statuses:



NEW



ACTIVE



UNDER_INVESTIGATION



REVIEW



CLOSED



ARCHIVED



---



# 38. EVIDENCE MANAGEMENT



Fields:



Evidence ID



Case



Type



Description



Collected Date



Collected By



Status



Location



Notes



Add chain of custody.



---



# 39. INVESTIGATION WORKSPACE



Create the most impressive page:



# Investigation Workspace



Layout:



LEFT PANEL



Case/Entity Explorer



CENTER



Interactive Network Graph



RIGHT PANEL



Selected Entity Details



BOTTOM PANEL



Investigation Timeline



TOP AREA



AIML Analysis Controls



Buttons:



Run Network Analysis



Detect Communities



Detect Anomalies



Predict Links



Find Path



Compare Cases



This should be the main demonstration screen.



---



# 40. AIML RESULT DRAWER



When ML analysis completes, open a right-side drawer.



Display:



Analysis Type



Algorithm



Input Records



Result



Score



Supporting Features



Explanation



Limitations



Model Version



Date/Time



---



# 41. TRAIN MODEL WORKFLOW



Button:



Train Model



Process:



Load Data



↓



Validate Dataset



↓



Preprocess



↓



Feature Engineering



↓



Train



↓



Evaluate



↓



Save Model



↓



Update Model Version



Show progress on screen.



---



# 42. MODEL VERSIONING



Store:



Model Name



Version



Algorithm



Training Date



Dataset Size



Features



Metrics



Status



Example:



AnomalyDetector



v1.2



Isolation Forest



Status:

ACTIVE



---



# 43. PYTHON AIML APIs



Create endpoints such as:



POST /ml/network-analysis



POST /ml/anomaly-detection



POST /ml/community-detection



POST /ml/link-prediction



POST /ml/case-similarity



POST /ml/train/anomaly-model



GET /ml/model-info



GET /ml/model-metrics



Spring Boot should call these APIs.



---



# 44. SPRING BOOT AIML INTEGRATION



Create:



AiService



AiController



AiResponseDTO



PythonClient



Example flow:



React



↓



Spring Boot



↓



Fetch related records from MySQL



↓



Send feature data to Python service



↓



Python performs ML



↓



Return result



↓



Spring Boot stores analysis result



↓



React displays result



---



# 45. STORE ML RESULTS



Create database table:



ml_analysis_results



Fields:



id



analysis_type



entity_type



entity_id



case_id



algorithm



model_version



score



result



explanation



input_features



created_at



review_status



reviewed_by



reviewed_at



---



# 46. REVIEW SYSTEM



ML results should require review.



Statuses:



PENDING_REVIEW



ACCEPTED_AS_LEAD



REJECTED



REQUIRES_MORE_DATA



Never automatically change case status based on ML results.



---



# 47. EXPLAINABILITY



This feature is very important.



For every ML result show:



WHAT was detected?



WHY was it detected?



WHICH FEATURES contributed?



WHICH RECORDS support it?



WHICH ALGORITHM generated it?



WHAT are the limitations?



This will make the AIML project stronger during viva.



---



# 48. MODEL ERROR HANDLING



If AIML service is unavailable:



Show:



"Analysis service is currently unavailable."



Do not crash the entire website.



Normal case-management functions must continue working.



---



# 49. PROFESSIONAL UI



Use premium dark theme.



Colors:



Dark Navy



Slate



Charcoal



Cyan Accent



Amber Warnings



Red Critical



Green Success



Avoid excessive neon.



Use:



Clean cards



Charts



Tables



Sliding panels



Professional graph



Smooth animations



Tooltips



Modals



Skeleton loaders



---



# 50. AIML VISUAL IDENTITY



ML result cards should use a small:



"ML Analysis"



badge.



Example:



ML ANALYSIS



Anomaly Detection



Entity:

DEMO-P014



Score:

0.82



Status:

Review Required



This makes the AI sections obvious during demonstration.



---



# 51. REPORTS



Create reports:



Case Report



Network Analysis Report



Community Analysis Report



Anomaly Detection Report



Link Prediction Report



Case Similarity Report



Model Performance Report



Export PDF.



All ML reports must include:



Algorithm



Model Version



Features



Results



Explanation



Limitations



---



# 52. AUDIT LOGS



Track:



RUN_NETWORK_ANALYSIS



RUN_ANOMALY_DETECTION



RUN_COMMUNITY_DETECTION



RUN_LINK_PREDICTION



TRAIN_MODEL



RETRAIN_MODEL



REVIEW_ML_RESULT



EXPORT_ML_REPORT



---



# 53. SYNTHETIC DATASET



Generate a meaningful synthetic dataset.



Example:



100 Persons



30 Cases



300+ Relationships



25 Organizations



50 Vehicles



100 Incidents



500 Communication Records



150 Location Records



Ensure the dataset contains:



Network communities



Bridge nodes



Outliers



Repeated communication patterns



Possible missing links



Different network densities



This is necessary so AIML results are visible.



---



# 54. IMPORTANT AIML DEMO FLOW



Prepare the project so I can demonstrate this exact flow to faculty:



1. Login



2. Open dashboard



3. Open dataset explorer



4. Explain dataset



5. Show preprocessing



6. Show feature engineering



7. Open network graph



8. Run centrality analysis



9. Run community detection



10. Show detected groups



11. Run anomaly detection



12. Show anomaly and explanation



13. Run link prediction



14. Show potential connection



15. Open model metrics



16. Show model performance



17. Generate report



This should work without coding during the live demonstration.



---



# 55. VIVA-FRIENDLY DESIGN



Every AIML feature page should contain a small:



"How It Works"



section.



Example:



Community Detection



Algorithm:

Louvain



Input:

Network nodes and relationships.



Process:

The algorithm groups densely connected nodes.



Output:

Network communities.



This will help me explain the project during viva.



---



# 56. IMPORTANT SAFETY RULES



Use only synthetic/demo records.



Never claim:



"This person is a criminal."



Never predict:



"Person will commit crime."



Never output:



"Arrest this person."



Never determine guilt.



Never use race, religion, caste, gender, political affiliation, or other sensitive attributes as ML risk features.



The AIML system should analyze network structure and synthetic activity patterns only.



---



# 57. FINAL QUALITY REQUIREMENT



This project must demonstrate all three areas:



## FULL STACK



React + Spring Boot + MySQL



## AIML



Python + Scikit-learn + NetworkX



## DATA VISUALIZATION



Interactive Graphs + Charts + Reports



The final application should feel like a professional AIML analytics platform, not just a website with the word "AI" added to it.



---



# 58. DO NOT FAKE AIML



Very important:



Do NOT hard-code ML results.



Do NOT display random anomaly scores.



Do NOT display random accuracy numbers.



Do NOT create fake model metrics.



Actual Python algorithms must calculate results.



Actual model outputs must be returned through APIs.



Actual database/synthetic dataset data must be used.



If a feature has not been implemented, do not pretend it works.



---



# 59. TEST EVERYTHING



Before completing the project test:



Frontend



Backend



MySQL



Python AIML service



Spring-to-Python communication



Authentication



Dataset loading



Preprocessing



Feature generation



Centrality



Community detection



Clustering



Anomaly detection



Link prediction



Case similarity



Charts



Network visualization



Model metrics



Reports



No frontend errors.



No backend 500 errors.



No Python exceptions.



No CORS errors.



No broken APIs.



No dead buttons.



---



# FINAL GOAL



Transform my existing project into a complete:



# AI-Powered Criminal Network Analysis System



The AIML functionality should be the main technical strength.



The project should demonstrate:



Graph Algorithms



Machine Learning



Unsupervised Learning



Anomaly Detection



Clustering



Link Prediction



Similarity Analysis



Feature Engineering



Model Evaluation



Explainable ML



Full-Stack Development



Database Integration



Interactive Data Visualization



The final system must be visually professional, technically meaningful, and easy to explain during my AIML project demonstration and viva.
# MASTER PROMPT — AIML PROJECT



Build and improve my project:



# AI-Powered Criminal Network Analysis System



This is an **Artificial Intelligence and Machine Learning academic project**.



The website must clearly demonstrate:



- AI

- Machine Learning

- Graph Analysis

- Data Analysis

- Pattern Detection

- Network Analysis

- Anomaly Detection

- Clustering

- Link Prediction

- Explainable Results



The project should NOT behave like a simple CRUD website.



The AI/ML components must be visible, understandable, demonstrable, and connected with the full-stack website.



Use only **synthetic/demo criminal-network data**.



Do NOT use real criminal records, facial recognition, biometric identification, automated guilt prediction, or real-person surveillance.



The project must clearly state:



"AI results are analytical indicators for academic demonstration and require human verification."



---



# 1. MAIN PROJECT OBJECTIVE



The system should analyze a fictional criminal-network dataset and help investigators understand:



- Connections between people

- Groups inside a network

- Important bridge nodes

- Suspicious interaction patterns

- Abnormal communication behavior

- Similar investigation cases

- Possible missing connections

- Changes in network structure

- Frequent shared locations

- Common organization links



The system should use AI/ML and graph algorithms to generate these insights.



---



# 2. RECOMMENDED TECH STACK



Frontend:



- React

- Vite

- JavaScript

- Tailwind CSS

- Framer Motion



Backend:



- Java 21

- Spring Boot

- Spring Data JPA

- Hibernate

- REST API

- Spring Security

- JWT



Database:



- MySQL



AI/ML Service:



Use Python.



Recommended:



- Python

- FastAPI

- Pandas

- NumPy

- Scikit-learn

- NetworkX



Optional:



- XGBoost

- PyTorch Geometric

- Matplotlib



Architecture:



React Frontend



↓



Spring Boot Backend



↓



MySQL Database



AND



Spring Boot



↓



Python AIML Microservice



The Spring Boot backend should communicate with the Python AIML service through REST APIs.



---



# 3. PROJECT ARCHITECTURE



Create:



criminal-network-analysis/



frontend/



backend/



ai-service/



database/



docs/



Inside ai-service:



app.py



models/



services/



algorithms/



data/



utils/



requirements.txt



Example:



ai-service/

├── app.py

├── models/

├── services/

│   ├── network_analysis.py

│   ├── anomaly_detection.py

│   ├── clustering.py

│   ├── link_prediction.py

│   └── case_similarity.py

├── utils/

├── data/

└── requirements.txt



---



# 4. AIML DASHBOARD



Create a dedicated:



# AI Intelligence Dashboard



Show:



Total Network Nodes



Total Relationships



Detected Communities



Potential Links



Anomalies Detected



Bridge Nodes



High-Connectivity Nodes



Recently Changed Network Areas



Display these as modern KPI cards.



---



# 5. NETWORK ANALYSIS



Use NetworkX.



Analyze:



Degree Centrality



Betweenness Centrality



Closeness Centrality



PageRank



Connected Components



Node Degree



Network Density



Shortest Path



Community Structure



Display results visually.



Do NOT convert these measurements into statements such as:



"Most dangerous criminal"



Instead say:



"Highest connectivity within this selected synthetic network."



---



# 6. DEGREE CENTRALITY



Calculate which nodes have the largest number of direct connections.



Example result:



Entity:

DEMO-P014



Degree Centrality:

0.76



Direct Connections:

14



Explanation:



"This entity has many direct connections within the selected network."



Add a button:



View Connections



---



# 7. BETWEENNESS CENTRALITY



Calculate which entities connect otherwise separate groups.



Example:



Entity:

DEMO-P008



Betweenness:

0.68



Explanation:



"This entity acts as a bridge between multiple network groups."



Visualize these nodes differently in the graph.



---



# 8. CLOSENESS CENTRALITY



Show entities that can reach other entities through fewer graph steps.



Example:



Entity:

DEMO-P005



Closeness:

0.74



Explain:



"This entity is structurally close to many entities in this synthetic network."



---



# 9. PAGERANK



Use PageRank as a graph-importance measurement.



Display:



Entity



PageRank Score



Number of Connections



Related Cases



Important:



Explain that PageRank represents graph structure only and does NOT indicate guilt.



---



# 10. COMMUNITY DETECTION



This should be one of the main AIML features.



Use:



Louvain Community Detection



OR



Label Propagation



OR



Girvan-Newman



Detect network communities.



Example:



Community 1



12 entities



32 relationships



Community 2



8 entities



18 relationships



Community 3



15 entities



41 relationships



Show communities in different graph colors.



---



# 11. CLUSTER ANALYSIS



Use unsupervised ML.



Recommended:



K-Means



DBSCAN



Hierarchical Clustering



Create features such as:



Connection count



Communication frequency



Case count



Organization count



Location count



Vehicle count



Network centrality



Then cluster entities.



Example:



Cluster 1:

Highly Connected Entities



Cluster 2:

Low Activity Entities



Cluster 3:

Communication-Heavy Entities



Do NOT call clusters:



Dangerous



Criminal



Safe



Threat



Keep cluster labels descriptive.



---



# 12. ANOMALY DETECTION



Use ML anomaly detection.



Recommended:



Isolation Forest



Possible input features:



Communication frequency



Sudden network growth



Number of new connections



Repeated location activity



Organization overlap



Connection count changes



Output example:



Anomaly Detected



Entity:

DEMO-P021



Anomaly Score:

0.82



Reasons:



Communication count increased sharply.



Three new network relationships appeared.



Two new shared locations were recorded.



Status:



Requires Human Review



---



# 13. ANOMALY EXPLANATION



Never show only a score.



Always explain:



Why it was detected



Input features



Compared baseline



Relevant records



Confidence/score limitations



Example:



Detected because the communication frequency is significantly higher than this entity's previous synthetic activity pattern.



---



# 14. LINK PREDICTION



Create an AIML / graph-analysis link prediction module.



Predict possible missing network edges using synthetic graph information.



Recommended algorithms:



Common Neighbors



Jaccard Coefficient



Adamic-Adar Index



Preferential Attachment



Optional advanced model:



Graph Neural Network



Output:



Potential Relationship



Entity A:

DEMO-P003



Entity B:

DEMO-P018



Link Score:

78%



Supporting Graph Signals:



4 common neighbors



2 shared locations



1 shared organization



Button:



Review Relationship



Buttons:



Accept as Investigation Lead



Reject Suggestion



Never automatically create a verified relationship.



---



# 15. CASE SIMILARITY ML



Create case similarity analysis.



Convert case attributes into feature vectors.



Possible features:



Incident type



Location



Organization involvement



Network structure



Evidence category



Vehicle involvement



Time patterns



Use:



Cosine Similarity



Optional:



K-Nearest Neighbors



Display:



CASE-2026-001



Similar to



CASE-2026-009



Similarity:

74%



Shared Features:



Same incident category



Similar location profile



Common organization type



Similar network density



---



# 16. NETWORK CHANGE DETECTION



Compare network state across time periods.



Example:



Previous Month



vs



Current Month



Identify:



New nodes



New relationships



Removed relationships



New clusters



Merged communities



New bridge nodes



Create a visual comparison.



---



# 17. TIME-BASED ANALYSIS



Allow:



Last 7 days



30 days



90 days



Custom Date Range



Show:



New relationships



Incident count



Network growth



Communication frequency



Community changes



Anomalies



---



# 18. INTERACTIVE NETWORK GRAPH



Use Cytoscape.js.



Nodes represent:



Person



Organization



Vehicle



Location



Case



Incident



Phone



Evidence



Edges represent:



Associated With



Owns



Works For



Communicated With



Located At



Involved In Case



Related To



Shared Organization



Shared Location



---



# 19. AI GRAPH VISUALIZATION



Use special visualization for ML output.



Normal Node:

standard border



Community:

community color



Potential Link:

dashed line



Anomaly:

special warning indicator



Bridge Node:

highlighted border



Selected Node:

animated focus ring



Add legend.



---



# 20. NETWORK FILTERS



Allow filtering by:



Node Type



Relationship Type



Case



Community



Anomaly Status



Centrality Range



Date



Location



Organization



---



# 21. NETWORK PATH ANALYSIS



Select:



Source Entity



Target Entity



Click:



Find Path



Show shortest graph path.



Example:



Person A



↓



Organization X



↓



Person B



↓



Vehicle Y



↓



Person C



Show:



Number of hops



Relationship types



Related cases



This is graph analysis, not AI prediction.



---



# 22. MODEL TRAINING PAGE



Create a dedicated:



# Model Training



page.



Show available ML models.



Example:



Anomaly Detection



Algorithm:

Isolation Forest



Status:

Trained



Samples:

450



Features:

8



Last Trained:

29 September 2026



Button:



Train Model



Retrain Model



---



# 23. MODEL PERFORMANCE PAGE



For supervised models, show proper metrics if applicable.



Possible metrics:



Accuracy



Precision



Recall



F1 Score



Confusion Matrix



ROC Curve



For unsupervised models show:



Silhouette Score



Cluster Count



Noise Samples



Anomaly Distribution



Do NOT show fake metrics.



Metrics must come from actual model output.



---



# 24. FEATURE IMPORTANCE



Where the model supports feature importance, display it.



Example:



Communication Frequency — 28%



New Connections — 24%



Shared Locations — 18%



Case Count — 15%



Organization Links — 10%



Vehicle Links — 5%



Use a horizontal bar chart.



---



# 25. AIML MODEL EXPLANATION



Every model page must explain:



Algorithm Used



Why it is Used



Input Data



Features



Output



Limitations



Example:



Algorithm:

Isolation Forest



Purpose:

Detect unusual patterns in synthetic network activity.



Input:

Network and interaction statistics.



Output:

Anomaly score.



Limitation:

An anomaly does not prove wrongdoing.



---



# 26. MODEL COMPARISON



Create a comparison page.



Example:



Anomaly Detection:



Isolation Forest



vs



Local Outlier Factor



Compare:



Runtime



Number of anomalies



Stability



Available metrics



Do not fabricate winner labels.



---



# 27. DATASET PAGE



Create:



# Dataset Explorer



Show dataset statistics.



Examples:



Persons:

100



Relationships:

350



Cases:

30



Organizations:

20



Vehicles:

40



Incidents:

75



Show columns/features.



Allow:



Preview data



Search



Filter



Sort



Export CSV



---



# 28. DATA PREPROCESSING PAGE



Show AIML preprocessing steps.



Example:



Missing Values



Duplicate Removal



Categorical Encoding



Normalization



Feature Scaling



Feature Engineering



Graph Construction



Display status:



Completed



Show:



Before preprocessing



After preprocessing



This is important for faculty demonstration.



---



# 29. FEATURE ENGINEERING



Generate features such as:



degree



betweenness



closeness



pagerank



communication_count



case_count



vehicle_count



organization_count



location_count



shared_contact_count



new_relationship_count



incident_count



These features should feed ML models.



---



# 30. MODEL PIPELINE VISUALIZATION



Create a pipeline diagram:



Synthetic Dataset



↓



Data Cleaning



↓



Feature Engineering



↓



Graph Construction



↓



ML Model



↓



Prediction / Analysis



↓



Explanation



↓



Human Review



Show this on the AIML dashboard.



---



# 31. AI ANALYSIS PAGE



Create tabs:



Network Analysis



Community Detection



Anomaly Detection



Link Prediction



Case Similarity



Model Metrics



Dataset



Preprocessing



---



# 32. PERSON PROFILE ML INSIGHTS



Inside a person profile add:



# Network Analytics



Show:



Degree Centrality



Betweenness



Closeness



PageRank



Community



Connection Count



Anomaly Indicator



Possible Link Suggestions



Clearly label:



Analytical Data



Not Criminal Determination



---



# 33. CASE ML INSIGHTS



Inside case page show:



Network Size



Network Density



Detected Communities



Bridge Nodes



Anomalies



Potential Links



Similar Cases



Allow:



Run Analysis



---



# 34. RULE + ML SEPARATION



Clearly separate:



Database Facts



Rule-Based Alerts



ML Analysis



Example:



FACT



5 communications recorded.



RULE ALERT



Case not updated for 10 days.



ML INSIGHT



Communication pattern is unusual compared with historical synthetic activity.



Never mix these together.



---



# 35. FULL-STACK CASE MANAGEMENT



Keep standard website features too.



Include:



Dashboard



Cases



Persons



Evidence



Incidents



Organizations



Vehicles



Locations



Communications



Network



AI Intelligence



Reports



Users



Audit Logs



Settings



---



# 36. DASHBOARD



Show:



Active Cases



Persons



Evidence



Incidents



Relationships



AI Anomalies



Detected Communities



Potential Links



Then charts:



Case Trend



Network Growth



Anomaly Distribution



Community Size



Incident Categories



Communication Trend



---



# 37. CASE MANAGEMENT



CRUD operations:



Create



View



Edit



Archive



Search



Filter



Statuses:



NEW



ACTIVE



UNDER_INVESTIGATION



REVIEW



CLOSED



ARCHIVED



---



# 38. EVIDENCE MANAGEMENT



Fields:



Evidence ID



Case



Type



Description



Collected Date



Collected By



Status



Location



Notes



Add chain of custody.



---



# 39. INVESTIGATION WORKSPACE



Create the most impressive page:



# Investigation Workspace



Layout:



LEFT PANEL



Case/Entity Explorer



CENTER



Interactive Network Graph



RIGHT PANEL



Selected Entity Details



BOTTOM PANEL



Investigation Timeline



TOP AREA



AIML Analysis Controls



Buttons:



Run Network Analysis



Detect Communities



Detect Anomalies



Predict Links



Find Path



Compare Cases



This should be the main demonstration screen.



---



# 40. AIML RESULT DRAWER



When ML analysis completes, open a right-side drawer.



Display:



Analysis Type



Algorithm



Input Records



Result



Score



Supporting Features



Explanation



Limitations



Model Version



Date/Time



---



# 41. TRAIN MODEL WORKFLOW



Button:



Train Model



Process:



Load Data



↓



Validate Dataset



↓



Preprocess



↓



Feature Engineering



↓



Train



↓



Evaluate



↓



Save Model



↓



Update Model Version



Show progress on screen.



---



# 42. MODEL VERSIONING



Store:



Model Name



Version



Algorithm



Training Date



Dataset Size



Features



Metrics



Status



Example:



AnomalyDetector



v1.2



Isolation Forest



Status:

ACTIVE



---



# 43. PYTHON AIML APIs



Create endpoints such as:



POST /ml/network-analysis



POST /ml/anomaly-detection



POST /ml/community-detection



POST /ml/link-prediction



POST /ml/case-similarity



POST /ml/train/anomaly-model



GET /ml/model-info



GET /ml/model-metrics



Spring Boot should call these APIs.



---



# 44. SPRING BOOT AIML INTEGRATION



Create:



AiService



AiController



AiResponseDTO



PythonClient



Example flow:



React



↓



Spring Boot



↓



Fetch related records from MySQL



↓



Send feature data to Python service



↓



Python performs ML



↓



Return result



↓



Spring Boot stores analysis result



↓



React displays result



---



# 45. STORE ML RESULTS



Create database table:



ml_analysis_results



Fields:



id



analysis_type



entity_type



entity_id



case_id



algorithm



model_version



score



result



explanation



input_features



created_at



review_status



reviewed_by



reviewed_at



---



# 46. REVIEW SYSTEM



ML results should require review.



Statuses:



PENDING_REVIEW



ACCEPTED_AS_LEAD



REJECTED



REQUIRES_MORE_DATA



Never automatically change case status based on ML results.



---



# 47. EXPLAINABILITY



This feature is very important.



For every ML result show:



WHAT was detected?



WHY was it detected?



WHICH FEATURES contributed?



WHICH RECORDS support it?



WHICH ALGORITHM generated it?



WHAT are the limitations?



This will make the AIML project stronger during viva.



---



# 48. MODEL ERROR HANDLING



If AIML service is unavailable:



Show:



"Analysis service is currently unavailable."



Do not crash the entire website.



Normal case-management functions must continue working.



---



# 49. PROFESSIONAL UI



Use premium dark theme.



Colors:



Dark Navy



Slate



Charcoal



Cyan Accent



Amber Warnings



Red Critical



Green Success



Avoid excessive neon.



Use:



Clean cards



Charts



Tables



Sliding panels



Professional graph



Smooth animations



Tooltips



Modals



Skeleton loaders



---



# 50. AIML VISUAL IDENTITY



ML result cards should use a small:



"ML Analysis"



badge.



Example:



ML ANALYSIS



Anomaly Detection



Entity:

DEMO-P014



Score:

0.82



Status:

Review Required



This makes the AI sections obvious during demonstration.



---



# 51. REPORTS



Create reports:



Case Report



Network Analysis Report



Community Analysis Report



Anomaly Detection Report



Link Prediction Report



Case Similarity Report



Model Performance Report



Export PDF.



All ML reports must include:



Algorithm



Model Version



Features



Results



Explanation



Limitations



---



# 52. AUDIT LOGS



Track:



RUN_NETWORK_ANALYSIS



RUN_ANOMALY_DETECTION



RUN_COMMUNITY_DETECTION



RUN_LINK_PREDICTION



TRAIN_MODEL



RETRAIN_MODEL



REVIEW_ML_RESULT



EXPORT_ML_REPORT



---



# 53. SYNTHETIC DATASET



Generate a meaningful synthetic dataset.



Example:



100 Persons



30 Cases



300+ Relationships



25 Organizations



50 Vehicles



100 Incidents



500 Communication Records



150 Location Records



Ensure the dataset contains:



Network communities



Bridge nodes



Outliers



Repeated communication patterns



Possible missing links



Different network densities



This is necessary so AIML results are visible.



---



# 54. IMPORTANT AIML DEMO FLOW



Prepare the project so I can demonstrate this exact flow to faculty:



1. Login



2. Open dashboard



3. Open dataset explorer



4. Explain dataset



5. Show preprocessing



6. Show feature engineering



7. Open network graph



8. Run centrality analysis



9. Run community detection



10. Show detected groups



11. Run anomaly detection



12. Show anomaly and explanation



13. Run link prediction



14. Show potential connection



15. Open model metrics



16. Show model performance



17. Generate report



This should work without coding during the live demonstration.



---



# 55. VIVA-FRIENDLY DESIGN



Every AIML feature page should contain a small:



"How It Works"



section.



Example:



Community Detection



Algorithm:

Louvain



Input:

Network nodes and relationships.



Process:

The algorithm groups densely connected nodes.



Output:

Network communities.



This will help me explain the project during viva.



---



# 56. IMPORTANT SAFETY RULES



Use only synthetic/demo records.



Never claim:



"This person is a criminal."



Never predict:



"Person will commit crime."



Never output:



"Arrest this person."



Never determine guilt.



Never use race, religion, caste, gender, political affiliation, or other sensitive attributes as ML risk features.



The AIML system should analyze network structure and synthetic activity patterns only.



---



# 57. FINAL QUALITY REQUIREMENT



This project must demonstrate all three areas:



## FULL STACK



React + Spring Boot + MySQL



## AIML



Python + Scikit-learn + NetworkX



## DATA VISUALIZATION



Interactive Graphs + Charts + Reports



The final application should feel like a professional AIML analytics platform, not just a website with the word "AI" added to it.



---



# 58. DO NOT FAKE AIML



Very important:



Do NOT hard-code ML results.



Do NOT display random anomaly scores.



Do NOT display random accuracy numbers.



Do NOT create fake model metrics.



Actual Python algorithms must calculate results.



Actual model outputs must be returned through APIs.



Actual database/synthetic dataset data must be used.



If a feature has not been implemented, do not pretend it works.



---



# 59. TEST EVERYTHING



Before completing the project test:



Frontend



Backend



MySQL



Python AIML service



Spring-to-Python communication



Authentication



Dataset loading



Preprocessing



Feature generation



Centrality



Community detection



Clustering



Anomaly detection



Link prediction



Case similarity



Charts



Network visualization



Model metrics



Reports



No frontend errors.



No backend 500 errors.



No Python exceptions.



No CORS errors.



No broken APIs.



No dead buttons.



---



# FINAL GOAL



Transform my existing project into a complete:



# AI-Powered Criminal Network Analysis System



The AIML functionality should be the main technical strength.



The project should demonstrate:



Graph Algorithms



Machine Learning



Unsupervised Learning



Anomaly Detection



Clustering



Link Prediction



Similarity Analysis



Feature Engineering



Model Evaluation



Explainable ML



Full-Stack Development



Database Integration



Interactive Data Visualization



The final system must be visually professional, technically meaningful, and easy to explain during my AIML project demonstration and viva." b
jB0X
execute_url(localhost)
execute_url(127.0.0.1)
mcp(MCP Server)
'mcp(playwright/browser_take_screenshot)
 mcp(playwright/browser_navigate)
(mcp(playwright/browser_console_messages)
 mcp(playwright/browser_evaluate)
mcp(playwright/browser_click)
!mcp(playwright/browser_press_key)
read_url(127.0.0.1)
 mcp(playwright/browser_snapshot)

execute_url()
read_url(localhost)$mcp(chrome_devtools/evaluate_script)
read_url(*)z
*
  p: