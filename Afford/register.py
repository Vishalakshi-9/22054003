import requests

url = "http://20.244.56.144/evaluation-service/register"

data = {
    "name": "Vishalakshi Kumari",  
    "email": "22054003@kiit.ac.in",
    "mobileNo": "8434628875",
    "githubUsername": "Vishalakshi-9",
    "rollNo": "22054003",
    "collegeName": "KIIT University",
    "accessCode": "nwpwrZ"
}

response = requests.post(url, json=data)

print(response.json())