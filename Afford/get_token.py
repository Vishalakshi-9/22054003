import requests

url = "http://20.244.56.144/evaluation-service/auth"

data = {
    "email": "22054003@kiit.ac.in",
    "name": "vishalakshi kumari",  
    "rollNo": "22054003",
    "accessCode": "nwpwrZ",
    'clientID': 'bfa34bf6-9067-41c7-ae25-f635d2c7f389',
    'clientSecret': 'mQvsGGbqjcsjkfhY'
    
}

response = requests.post(url, json=data)

if response.status_code == 200:
    token = response.json().get("access_token")
    print("Access Token:", token)
else:
    print("Error:", response.text)




