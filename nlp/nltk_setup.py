import nltk
#RUN THIS BEFORE THE PREPROCESSING FILE

print("Forcing download of all required NLTK resources...")

resources = ['stopwords', 'punkt', 'punkt_tab']
for resource in resources:
    try:
        nltk.data.find(f"tokenizers/{resource}")
    except LookupError:
        print(f"-> Downloading '{resource}'...")
        nltk.download(resource)