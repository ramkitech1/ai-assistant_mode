from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


api_key = os.getenv("GROQ_API_KEY")

client = Groq(api_key=api_key)

class ChatRequest(BaseModel):
    message: str
    mode: str
    custom_prompt: str = ""

def build_prompt(data: ChatRequest):
    if data.mode == "generic":
        return f"You are a helpful assistant.\nUser: {data.message}"

    return f"""
You are acting as: {data.custom_prompt}

Follow the behavior strictly.

User: {data.message}
"""

@app.post("/chat")
def chat(req: ChatRequest):
    prompt = build_prompt(req)

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": prompt}
        ],
        temperature=0.7
    )

    return {
        "response": response.choices[0].message.content
    }