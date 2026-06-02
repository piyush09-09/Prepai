import chromadb
from sentence_transformers import SentenceTransformer

client = chromadb.PersistentClient(path="./chroma_db")
model = SentenceTransformer("all-MINILm-L6-v2")
collection = client.get_or_create_collection("interview_examples")
# separate collection for job descriptions
jd_collection = client.get_or_create_collection("job_descriptions")

examples = [
    {
        "question": "tell me about yourself",
        "answer": "I am a software engineer with 2 years of experience in Python and React. I graduated from IIT with a computer science degree. I have built several web applications and I am passionate about AI and machine learning. Currently I am working on an interview coaching app using FastAPI and React.",
        "tips": "Include your background, skills, and what you are currently working on."
    },
    {
        "question": "what is your biggest strength",
        "answer": "My biggest strength is problem solving. When I faced a bug in production that was causing data loss, I stayed calm, traced the issue systematically through logs, identified a race condition, and fixed it within 2 hours. I always break big problems into smaller pieces.",
        "tips": "Name one specific strength and back it up with a concrete example."
    },
    {
        "question": "where do you see yourself in 5 years",
        "answer": "In 5 years I see myself as a senior engineer leading a small team. I want to deepen my expertise in machine learning and contribute to products that reach millions of users. I also want to mentor junior developers the way my seniors mentored me.",
        "tips": "Show ambition but stay realistic. Connect your goals to the company."
    },
    {
        "question": "describe a challenge you faced",
        "answer": "During my final year project, our team of 4 had a conflict about the tech stack. I organized a meeting where everyone presented their choice with pros and cons. We voted and moved forward together. The project won best project award.",
        "tips": "Use the STAR format - Situation, Task, Action, Result."
    },
    {
        "question": "why do you want this role",
        "answer": "I want this role because your company is solving a real problem in education using AI. I have been following your work for a year. My skills in Python and machine learning align perfectly with what your team needs and I want to grow in this direction.",
        "tips": "Research the company. Show genuine interest and connect your skills to their needs."
    },
]

def store_job_description(user_id: int, jd_text: str):
    # delete previous JD for this user
    try:
        jd_collection.delete(where={"user_id": str(user_id)})
    except:
        pass

    # chunk the JD into pieces of ~200 words
    words = jd_text.split()
    chunk_size = 200
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)

    # store each chunk with embedding
    for i, chunk in enumerate(chunks):
        embedding = model.encode(chunk).tolist()
        jd_collection.add(
            ids=[f"jd_{user_id}_{i}"],
            embeddings=[embedding],
            documents=[chunk],
            metadatas=[{"user_id": str(user_id)}]
        )

    print(f"Stored {len(chunks)} JD chunks for user {user_id}")

def retrieve_jd_context(user_id: int, question: str, answer: str, n=2):
    try:
        query = f"{question} {answer}"
        query_embedding = model.encode(query).tolist()

        results = jd_collection.query(
            query_embeddings=[query_embedding],
            n_results=n,
            where={"user_id": str(user_id)}
        )

        if results["documents"] and results["documents"][0]:
            return " ".join(results["documents"][0])
        return ""
    except:
        return ""
    

def populate_database():
    existing = collection.count()
    if existing>0:
        print(f"Database already has {existing} examples, skipping population.")
        return
    print("Populating vector database with examples...")

    for i, example in enumerate(examples):
        text = f"question: {example['question']} Answer: {example['answer']}"
        embedding = model.encode(text).tolist()

        collection.add(
            ids=[str(i)],
            embeddings=[embedding],
            documents=[text],
            metadatas=[{"tips": example["tips"], "question": example["question"]}]
        )
    print(f"Added {len(examples)} examples to database")


def retrieve_relevant_examples(question,answer,n=2):
    query = f"Question: {question} Answer: {answer}"
    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings = [query_embedding],
        n_results = n
    )

    examples = []
    for i in range(len(results["documents"][0])):
        examples.append({
            "document":results["documents"][0][i],
            "tips":results["metadatas"][0][i]["tips"]
        })
    return examples

populate_database()