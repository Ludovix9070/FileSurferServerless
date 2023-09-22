import boto3
import smtplib, os, json
import json
import boto3
from urllib.parse import unquote
from email.message import EmailMessage

def lambda_handler(event, context):
    
    s3_client = boto3.client('s3')
    s3_resource = boto3.resource('s3')
    bucket_name = 'filesurfer-file-download-storage'
    
    for record in event['Records']:
        #pull the body out & json load it        
        jsonmaybe=(record["body"])
        jsonmaybe=json.loads(jsonmaybe)                
        #now the normal stuff works        
        key=unquote(unquote(jsonmaybe["Records"][0]["s3"]["object"]["key"]))
        print("key: ", key)
    
    object = s3_resource.Object(bucket_name, key)
    metadata = object.metadata
    email = metadata['email']
    print("\nMETA: ", metadata)
    print("\nEMAIL: ", email)
    print("\nBUCKET: ", bucket_name)
    filename = os.path.basename(key)
    print("\FILENAME: ", filename)
    
    send_email(email, filename)
    
            
def send_email(receiver_email, file):

    sender_address = "filesurfer9779@gmail.com"
    sender_password = "rdxaiwmumaqwthxv"
    receiver_address = receiver_email

    msg = EmailMessage()
    msg.set_content(f"Aloha from FileSurfer, your file: {file} has been converted, \n You can download it now!")
    msg["Subject"] = "ARFF Download"
    msg["From"] = sender_address
    msg["To"] = receiver_address

    session = smtplib.SMTP("smtp.gmail.com", 587)
    session.starttls()
    session.login(sender_address, sender_password)
    session.send_message(msg, sender_address, receiver_address)
    session.quit()
    print("Mail Sent")
