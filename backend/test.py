import firebase_admin
from firebase_admin import credentials, storage
import json
# Initialize Firebase Admin SDK
cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred, {"storageBucket": "cloud-42617.appspot.com"})

# Download a file from Firebase Storage
def download_file(file_path_in_storage, local_destination):
    bucket = storage.bucket()

    # Specify the path to the file within the Firebase Storage bucket
    blob = bucket.blob(file_path_in_storage)

    # Download the file to the local destination
    blob.download_to_filename("./files/" + local_destination)

    print(f"File downloaded to {local_destination}")

# Example usage
with open("forms.json", 'r+') as file:
    # Read the list from the file
        forms = json.load(file)
for i in forms:
    name = i["name"]
    download_file(name, name)

