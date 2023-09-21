
import json
import boto3
import os, io, tempfile
import csv
from urllib.parse import unquote

s3_client = boto3.client('s3')


def csv_2_arff(fileToRead, fileToWrite, relation):
    dataType = [] # Stores data types 'nominal' and 'numeric'
    columnsTemp = [] # Temporary stores each column of csv file except the attributes
    uniqueTemp = [] # Temporary Stores each data cell unique of each column
    uniqueOfColumn = [] # Stores each data cell unique of each column
    dataTypeTemp = [] # Temporary stores the data type for cells on each column
    finalDataType = [] # Finally stores data types 'nominal' and 'numeric'
    attTypes = [] # Stores data type 'numeric' and nominal data for attributes
    p = 0 # pointer for each cell of csv file

    writeFile = open(fileToWrite, 'w')

    #Opening and Reading a CSV file
    f = open(fileToRead, 'r')
    reader = csv.reader(f)
    allData = list(reader)
    attributes = allData[0]
    totalCols = len(attributes)
    totalRows = len(allData)
    f.close()

    # Add a '0' for each empty cell
    for j in range(0,totalCols):
        for i in range(0,totalRows):
            if 0 == len(allData[i][j]):
                allData[i][j] = "0"

    # check for comams or blanks and adds single quotes
    for j in range(0,totalCols):
        for i in range(1,totalRows):
            allData[i][j] = allData[i][j].lower()
            if "\r" in allData[i][j] or '\r' in allData[i][j] or "\n" in allData[i][j] or '\n' in allData[i][j]:
                allData[i][j] = allData[i][j].rstrip(os.linesep)
                allData[i][j] = allData[i][j].rstrip("\n")
                allData[i][j] = allData[i][j].rstrip("\r")
            try:
                if allData[i][j] == str(float(allData[i][j])) or allData[i][j] == str(int(allData[i][j])):
                    print
            except ValueError as e:
                    allData[i][j] = "'" + allData[i][j] + "'"

    # fin gives unique cells for nominal and numeric
    for j in range(0,totalCols):
        for i in range(1,totalRows):
            columnsTemp.append(allData[i][j])
        for item in columnsTemp:
            if not (item in uniqueTemp):
                uniqueTemp.append(item)
        uniqueOfColumn.append("{" + ','.join(uniqueTemp) + "}") 
        uniqueTemp = []
        columnsTemp = []

    # Assigns numeric or nominal to each cell
    for j in range(1,totalRows):
        for i in range(0,totalCols):
            try:
                if allData[j][i] == str(float(allData[j][i])) or allData[j][i] == str(int(allData[j][i])):
                    dataType.append("numeric")
            except ValueError as e:
                    dataType.append("nominal")

    for j in range(0,totalCols): 
        p = j
        for i in range(0,(totalRows-1)): 
            dataTypeTemp.append(dataType[p])
            p += totalCols  
        if "nominal" in dataTypeTemp:
            finalDataType .append("nominal")
        else:
            finalDataType .append("numeric")
        dataTypeTemp = []

    for i in range(0,len(finalDataType )):
        if finalDataType [i] == "nominal":
            attTypes.append(uniqueOfColumn[i])
        else:
            attTypes.append(finalDataType[i])

    # Show comments
    writeFile.write("%\n% Comments go after a '%' sign.\n%\n")
    writeFile.write("%\n% Relation: " + relation +"\n%\n%\n")
    writeFile.write("% Attributes: " + str(totalCols) + " "*5 
        + "Instances: " + str(totalRows-1) + "\n%\n%\n\n")

    # Show Relation
    writeFile.write("@relation " + relation + "\n\n")

    # Show Attributes
    for i in range(0,totalCols):
        writeFile.write("@attribute" + " '" + attributes[i] 
            + "' " + attTypes[i] + "\n")

    # Show Data
    writeFile.write("\n@data\n")
    for i in range(1,totalRows):
        writeFile.write(','.join(allData[i])+"\n")

    print(fileToRead + " was converted to " + fileToWrite)
    return fileToWrite
    
    
def getFilename(key):
    filename = os.path.basename(key)
    filename_noext = os.path.splitext(filename)[0]
    print(filename_noext)
    filename_noext+=".arff"
    return filename_noext


def lambda_handler(event, context):
    
    bucketName_download = 'filesurfer-file-download-storage'
    bucket_name = 'filesurfer-file-upload-storage'
    s3SubFolder = 'data'
    uri = 's3://filesurfer-file-upload-storage/'
    tmp_file='/tmp/file.csv'
    
    for record in event['Records']:
        #pull the body out & json load it        
        jsonmaybe=(record["body"])
        jsonmaybe=json.loads(jsonmaybe)                
        #now the normal stuff works        
        key=unquote(unquote(jsonmaybe["Records"][0]["s3"]["object"]["key"]))
        print("key: ", key)
    
    s3_response = s3_client.get_object(Bucket=bucket_name, Key=key)
    print("RESPONSE: ", s3_response)
    print("bucket name: ", bucket_name)
    print("key: ", key)
    
    s3_resource = boto3.resource('s3')
    object = s3_resource.Object(bucket_name, key)
    metadata = object.metadata
    email = metadata['email']
    print("\nMETA: ", metadata)
    print("\nEMAIL: ", email)
    
    file_data = s3_response["Body"].read().decode('utf')
    print("file_data:", file_data)
    
    #tf_path = tempfile.gettempdir() + f"/{message['csv_fid']}.arff"
    filename_arff = getFilename(key)
    filename_arff="/tmp/"+filename_arff
    print(filename_arff)
    
    
    tf = tempfile.NamedTemporaryFile(suffix='.csv')
    tf.write(str.encode(file_data))
    
    # create arff
    file_arff = csv_2_arff(tf.name, filename_arff, "dataset")
    filename_arff = os.path.basename(filename_arff)
    
    save_to_s3 = s3_client.put_object (
        Bucket=bucketName_download,
        Key=s3SubFolder+"/"+filename_arff,
        Body=open(file_arff, 'rb'),
        Metadata={
            "email": email,
        }
    )

       
    
