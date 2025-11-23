import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

def clean_text(text: str) -> str:
    text = text.lower() 
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'[^a-z\s]', '', text) 
    return text

def tokenize_text(text: str) -> list[str]:
    return word_tokenize(text)

def remove_stopwords(tokens: list[str]) -> list[str]:

    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in stop_words]
    return filtered_tokens

def preprocess_pipeline(raw_text: str) -> list[str]:
    if not isinstance(raw_text, str) or not raw_text.strip():
        return []

    cleaned_text = clean_text(raw_text)
    tokens = tokenize_text(cleaned_text)
    final_tokens = remove_stopwords(tokens)
    return final_tokens


if __name__ == "__main__":
    sample_headline1 = "Big News!! Apple's ($AAPL) stock price could surge by 20% after the event, see more at https://example.com"
    sample_headline2 = "Despite a 15% surge, analysts warn that $TSLA's volatility is a major concern. More info: https://invest.com/tsla-news"

    print("Original Headline:")
    print(sample_headline1)
    print("-" * 30)
    
    processed_tokens = preprocess_pipeline(sample_headline1)
    
    print("Processed Tokens:")
    print(processed_tokens)