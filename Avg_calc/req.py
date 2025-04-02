import requests

BASE_URL = "http://localhost:9876/numbers"
ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAzODE4LCJpYXQiOjE3NDM2MDM1MTgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImJmYTM0YmY2LTkwNjctNDFjNy1hZTI1LWY2MzVkMmM3ZjM4OSIsInN1YiI6IjIyMDU0MDAzQGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1NDAwM0BraWl0LmFjLmluIiwibmFtZSI6InZpc2hhbGFrc2hpIGt1bWFyaSIsInJvbGxObyI6IjIyMDU0MDAzIiwiYWNjZXNzQ29kZSI6Im53cHdyWiIsImNsaWVudElEIjoiYmZhMzRiZjYtOTA2Ny00MWM3LWFlMjUtZjYzNWQyYzdmMzg5IiwiY2xpZW50U2VjcmV0IjoibVF2c0dHYnFqY3Nqa2ZoWSJ9.oXY66egRjjJU9uEhkEn_-7obZOXQNLi2HaaIXpzICLc"  # Replace with actual token

headers = {
    "Authorization": f"Bearer {ACCESS_TOKEN}"  # Common format for JWT tokens
}

number_types = ["p", "f", "e", "r"]

for num_type in number_types:
    url = f"{BASE_URL}/{num_type}"
    try:
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        print(f"Response for {num_type}: {response.json()}")
    except requests.ConnectionError:
        print(f"Error: Could not connect to {url}. Is your server running?")
    except requests.Timeout:
        print(f"Error: Request to {url} timed out. Try increasing the timeout.")
    except requests.RequestException as e:
        print(f" Error: {e}")
