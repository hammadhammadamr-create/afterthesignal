import json
import random
import re
import requests

API_URL = "https://collabs.corexai.online/apis/cosmo/v1/chat/completions"
API_KEY = "cosmo_9NoaCVq28sFEJt3uStQTnw9z32R7MGdF-85gOes9trI"

# 1. Load your JSON dataset
try:
    with open("nasa_missions_data.json", "r", encoding="utf-8") as f:
        nasa_data = json.load(f)
        objects_list = nasa_data.get("objects", [])
except FileNotFoundError:
    print("Warning: nasa_missions_data.json not found! Using empty data.")
    objects_list = []


def get_relevant_context(question: str, objects: list, max_items: int = 3) -> str:
    """Finds the most relevant spacecraft records to keep the request payload small."""
    if not objects:
        return "No data provided."

    q_lower = question.lower()
    words = [w for w in re.findall(r"\w+", q_lower) if len(w) > 2]

    # If the user asks for a random project or general question, pick random items
    if "random" in q_lower or not words:
        selected = random.sample(objects, min(max_items, len(objects)))
        return json.dumps(selected, separators=(",", ":"), ensure_ascii=False)

    # Score each object by how many question keywords match its fields
    scored = []
    for obj in objects:
        obj_text = json.dumps(obj, ensure_ascii=False).lower()
        score = sum(1 for w in words if w in obj_text)
        if score > 0:
            scored.append((score, obj))

    scored.sort(key=lambda x: x[0], reverse=True)

    if scored:
        selected = [item[1] for item in scored[:max_items]]
    else:
        # Fallback: send a compact list of all names/types if no direct keyword matched
        selected = [
            {
                "name": o.get("name"),
                "type": o.get("type"),
                "destination": o.get("destination") or o.get("targets") or o.get("target"),
                "year": o.get("launch_year") or o.get("first_use_year") or o.get("years"),
                "description": o.get("description")
            }
            for o in objects
        ]

    # Minify JSON (no spaces or newlines) to keep payload well under the 413 limit
    return json.dumps(selected, separators=(",", ":"), ensure_ascii=False)


print("Model is ready! Type your question (type 'exit' to quit):\n")

while True:
    user_question = input("Your Question: ")
    if user_question.strip().lower() == "exit":
        print("Goodbye!")
        break

    # 2. Extract only the relevant slice of JSON data for this specific question
    compact_context = get_relevant_context(user_question, objects_list)

    # 3. Build a concise prompt
    full_prompt = (
        "Answer the user question strictly using only this NASA JSON data:\n"
        f"{compact_context}\n\n"
        f"Question: {user_question}"
    )

    try:
        response = requests.post(
            API_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "cosmo",
                "message": full_prompt  # Sent only once to cut request size in half
            },
            timeout=50
        )

        response.raise_for_status()
        data = response.json()

        answer = data.get("answer") or data.get("choices", [{}])[0].get("message", {}).get("content")
        print(f"\nAnswer: {answer}\n" + "-" * 40)

    except requests.exceptions.HTTPError as e:
        print(f"\nAPI Error: {e}")
        if e.response is not None:
            print(f"Server details: {e.response.text}")
        print("-" * 40)
    except requests.exceptions.RequestException as e:
        print(f"\nConnection Error: {e}\n" + "-" * 40)