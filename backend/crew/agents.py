from crewai import Agent
import os
from openai import AzureOpenAI
from dotenv import load_dotenv
load_dotenv()

client = AzureOpenAI(
    api_key=os.environ.get("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
    api_version=os.environ.get("AZURE_OPENAI_VERSION"),
)

analysis_agent = Agent(
    role="Sentiment Analysis Expert",
    goal="Classify feedback into sentiment and categories",
    backstory="An expert in analyzing employee feedback and extracting insights."
)

chatbot_agent = Agent(
    role="Conversational Assistant",
    goal="Provide helpful summaries based on feedback",
    backstory="A chatbot that interacts with users and summarizes insights in real-time."
)

def detect_task_type(user_input: str, file_bytes: bytes) -> str:
    prompt = [
        {"role": "system", "content": "You are an expert AI assistant. Based on the user input below, classify the task type."},
        {"role": "user", "content": f"""
        You are an expert AI assistant. Based on the user input below, classify the task type.
        User Input: {user_input}
        Based on the user input you have to choose which API to call analyze or chatbot.
        - If the user input is location, location-negative, transport, transport-positive → Call 'analyze'.
        - If user input is a message like 'Analyze positive comments about location' or 'What about transport?' → Call 'chatbot'.
        Choose only one of these task types: 'analyze' or 'chatbot'.
        Respond with just one word: analyze or chatbot.
        """}
    ]
    
    response = client.chat.completions.create(
        model="gpt-4o", 
        messages=prompt, 
        max_tokens=2000
    )

    task_type = response.choices[0].message.content.strip().lower() if response.choices else "analyze"

    task_type = task_type.strip().lower()
    if "analyze" in task_type:
        task_type = "analyze"
    elif "chatbot" in task_type:
        task_type = "chatbot"
    print(f"Detected task_type: {task_type}")  
    return task_type
    
