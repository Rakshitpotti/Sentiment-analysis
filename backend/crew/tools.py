from fastapi.responses import FileResponse
import tempfile
import os
import requests

def call_analysis_backend(file_bytes, user_input):
    files = {"file": ("data.xlsx", file_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
    data = {"categories": user_input}
    analyze_response = requests.post("http://localhost:8001/analyze", files=files, data=data)

    if analyze_response.status_code == 200:
        final_content = analyze_response.text.strip()
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".csv")
        with open(temp_file.name, mode="w", newline="", encoding="utf-8") as f:
            f.write(final_content)
        return FileResponse(path=temp_file.name, filename="analysis_output.csv", media_type="text/csv")
    else:
        analyze_response.raise_for_status()


def call_chatbot_backend(file_bytes=None, user_input="", session_id=None):
    files = {}
    if file_bytes:
        files = {
            "file": ("data.xlsx", file_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        }
    data = {"user_input": user_input}
    if session_id:
        data["session_id"] = session_id

    response = requests.post("http://localhost:8002/chatbot", files=files or None, data=data)
    response.raise_for_status()
    return response.text




