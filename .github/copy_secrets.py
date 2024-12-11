import os
import json

secrets = os.getenv('SECRETS')
variables = os.getenv('VARIABLES')
secretsJsonData = json.loads(secrets)
variablesJsonData = json.loads(variables)

def replaceFromJson(jsonData):
  for key in jsonData:
    valueToReplace = f'#{{{key}}}'
    newValue = jsonData[key]
    with open('src/environments/environment.ts', 'r') as file:
      content = file.read()
    with open('src/environments/environment.ts', 'w') as file:
      file.write(content.replace(valueToReplace, newValue))

# main
replaceFromJson(secretsJsonData)
replaceFromJson(variablesJsonData)
