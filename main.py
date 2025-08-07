import sys
import os
import json
from dotenv import load_dotenv
from pymongo import MongoClient
from fastapi import FastAPI, Request
from pydantic import BaseModel
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List
from bson import ObjectId
# Load environment variables from .env
load_dotenv(".env")  # Assumes .env is in the root directory
print(os.getenv("MONGOSE_URI")+'gotenv')
app=FastAPI()
# Get MongoDB URI
MONGODB_URI = os.getenv("MONGOSE_URI")
if not MONGODB_URI:
    print(json.dumps({"error": "MongoDB URI not found"}))
    sys.exit(1)

client = MongoClient(MONGODB_URI)
db = client["devTinder"]
users_collection = db["users"]
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is working!"}


class UserIDs(BaseModel):
    userIds: List[str]
@app.post('/match_from_db')
def match_from_db(payload:UserIDs):
        users = {}
        userIds=payload.userIds
        print(payload.userIds)
        for user_id in userIds:
            user_doc = users_collection.find_one({"_id": ObjectId(user_id)})
            if user_doc and "skills" in user_doc:
                users[user_id] = user_doc["skills"]
        cleaned_skills = {
        user_id: [skill.strip(",").strip().lower() for skill in skills]
        for user_id, skills in users.items()
       }
        print(cleaned_skills.values())
        user_names = list(users.keys())
        user_skills = [" ".join(skill_list) for skill_list in cleaned_skills.values()]
        vectorizer = CountVectorizer()
        skill_vectors = vectorizer.fit_transform(user_skills)
        similarity_matrix = cosine_similarity(skill_vectors)

        results = {}
        for i, name_a in enumerate(user_names):
            for j, name_b in enumerate(user_names):
                if i != j:
                    score = round(similarity_matrix[i][j], 2)
                    level = "High" if score > 0.60 else "Medium" if score >= 0.15 else "Low"
                    results[f"{name_a}-{name_b}"] = { "score": score, "match": level }

        return results

if __name__ == "__main__":
    import uvicorn  
    port = int(os.getenv("PORT_FASTAPI", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)