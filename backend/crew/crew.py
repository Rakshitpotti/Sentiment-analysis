from crewai import Crew, Task
from .agents import analysis_agent, chatbot_agent, detect_task_type
from .tools import call_analysis_backend, call_chatbot_backend


def create_crew(file_bytes, user_input, session_id=None):
    task_type = detect_task_type(user_input, file_bytes)
    if task_type == "analyze":
        file_response = call_analysis_backend(file_bytes, user_input)
        task = Task(
            description=f"Analyze comments and return categorized feedback using: {user_input}",
            agent=analysis_agent,
            expected_output="A download link to the sentiment analysis CSV file."
        )
        crew = Crew(agents=[analysis_agent], tasks=[task])
        return file_response 

    elif task_type == "chatbot":
        result = call_chatbot_backend(file_bytes, user_input, session_id)
        task = Task(
            description=f"Provide streaming summary based on: {user_input}",
            agent=chatbot_agent,
            expected_output="Live bullet-point summary"
        )
        crew = Crew(agents=[chatbot_agent], tasks=[task])
        response = result 
        return response
    else:
        raise ValueError("Invalid task_type. Use 'analyze' or 'chatbot'.")
