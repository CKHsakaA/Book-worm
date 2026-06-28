import pandas as pd
import numpy as np
from flask import Flask, jsonify, request
from pymongo import MongoClient
from scipy.sparse import csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# -----------------------------
# MongoDB Connection
# -----------------------------
MONGO_URI = "mongodb+srv://aakc066_db_user:Ecpn8VWHErr5Ddoe@cluster0.k4pr2hu.mongodb.net/bookrecom_db?appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["bookrecom_db"]

# -----------------------------
# Cache paths
# -----------------------------
CF_CACHE = "cf_matrix.joblib"
CBF_CACHE = "cbf_matrix.joblib"
BOOKS_CACHE = "books_df.joblib"
RATINGS_CACHE = "ratings_df.joblib"
TFIDF_CACHE = "tfidf_model.joblib"

# -----------------------------
# Load or compute matrices
# -----------------------------
if os.path.exists(CF_CACHE) and os.path.exists(CBF_CACHE):
    print("⏳ Loading cached matrices...")
    user_item_sparse = joblib.load(CF_CACHE)
    item_features_cbf = joblib.load(CBF_CACHE)
    books = joblib.load(BOOKS_CACHE)
    ratings = joblib.load(RATINGS_CACHE)
    tfidf = joblib.load(TFIDF_CACHE)
    print("✅ Loaded cached matrices")
else:
    print("⏳ Loading data from MongoDB and building matrices...")
    
    # Minimal columns for efficiency
    books = pd.DataFrame(list(db.books.find({}, {"ibsn":1,"bktitle":1,"author":1,"yop":1,"publisher":1,"img":1,"genre":1})))
    ratings = pd.DataFrame(list(db.ratings.find({}, {"ratedby":1,"bookid":1,"rating":1})))
    
    # Preprocess
    books["yop"] = pd.to_numeric(books["yop"], errors="coerce").fillna(0)
    
    # Filter unpopular books / inactive users
    book_counts = ratings["bookid"].value_counts()
    ratings = ratings[ratings["bookid"].isin(book_counts[book_counts >= 5].index)]
    user_counts = ratings["ratedby"].value_counts()
    ratings = ratings[ratings["ratedby"].isin(user_counts[user_counts >= 5].index)]
    
    # Encode IDs
    ratings["user_idx"] = ratings["ratedby"].astype("category").cat.codes
    ratings["book_idx"] = ratings["bookid"].astype("category").cat.codes
    
    # Mappings
    user_mapping = dict(enumerate(ratings["ratedby"].astype("category").cat.categories))
    book_mapping = dict(enumerate(ratings["bookid"].astype("category").cat.categories))
    book_reverse_mapping = {v:k for k,v in book_mapping.items()}
    
    # CF sparse matrix
    user_item_sparse = csr_matrix((ratings["rating"], (ratings["user_idx"], ratings["book_idx"])))
    user_item_sparse = normalize(user_item_sparse, axis=1)
    
    # CBF matrix
    books["combined_features"] = books["bktitle"].fillna("") + " " + \
                                 books["author"].fillna("") + " " + \
                                 books.get("genre","").fillna("")
    tfidf = TfidfVectorizer(max_features=2000, stop_words="english")
    item_features_cbf = tfidf.fit_transform(books["combined_features"])
    item_features_cbf = normalize(item_features_cbf)
    
    # Save caches
    joblib.dump(user_item_sparse, CF_CACHE)
    joblib.dump(item_features_cbf, CBF_CACHE)
    joblib.dump(books, BOOKS_CACHE)
    joblib.dump(ratings, RATINGS_CACHE)
    joblib.dump(tfidf, TFIDF_CACHE)
    
    print("✅ Matrices built and cached")

# -----------------------------
# Hybrid recommendation
# -----------------------------
def recommend_books(user_id, top_n=10, alpha=0.7):
    if user_id not in ratings["ratedby"].values:
        # cold start
        popular_books = ratings["bookid"].value_counts().head(top_n).index.tolist()
        return books[books["ibsn"].isin(popular_books)][["ibsn","bktitle","author","yop","publisher","img"]]
    
    user_idx = ratings.loc[ratings["ratedby"]==user_id, "user_idx"].iloc[0]
    user_vector = user_item_sparse.getrow(user_idx)
    
    # CF scores
    scores_cf = user_vector.dot(user_item_sparse.T).toarray().flatten()
    
    # CBF scores
    rated_books_idx = np.where(user_vector.toarray().flatten() > 0)[0]
    if len(rated_books_idx) > 0:
        user_profile_cbf = item_features_cbf[rated_books_idx].mean(axis=0)
        scores_cbf = cosine_similarity(user_profile_cbf, item_features_cbf).flatten()
    else:
        scores_cbf = np.zeros(item_features_cbf.shape[0])
    
    # Hybrid
    scores = alpha * scores_cf + (1-alpha) * scores_cbf
    scores[rated_books_idx] = -1
    
    top_indices = np.argsort(-scores)[:top_n]
    top_book_ids = [book_mapping[i] for i in top_indices]
    
    recommended_books = books[books["ibsn"].isin(top_book_ids)]
    return recommended_books[["ibsn","bktitle","author","yop","publisher","img"]]

# -----------------------------
# API
# -----------------------------
@app.route("/recommend/<string:user_id>", methods=["GET"])
def recommend_api(user_id):
    n = int(request.args.get("n", 10))
    alpha = float(request.args.get("alpha", 0.7))
    recommended = recommend_books(user_id, top_n=n, alpha=alpha)
    if recommended.empty:
        return jsonify({"message":"No recommendations found or new user"}), 404
    return jsonify(recommended.to_dict(orient="records"))

# -----------------------------
# Run server
# -----------------------------
if __name__ == "__main__":
    print("✅ Backend running at http://127.0.0.1:5000")
    app.run(debug=True)
