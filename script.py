import os, sys
from collections import Counter
import json
from typing import List
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import unicodedata


def word_frequencies(words: List[str]) -> str:
    word_freq = Counter(words)

    # Convert Counter to a dictionary for JSON
    word_freq_dict = dict(word_freq)
    return json.dumps(word_freq_dict, indent=4)


try:
    document_path = sys.argv[1]
except IndexError:
    print("No document path provided.")
    sys.exit(1)


def remove_stopwords(text: str) -> List[str]:
    # Tokenize the text
    word_tokens = word_tokenize(text)

    # Get English stopwords
    stop_words = set(stopwords.words("english"))

    # Remove stopwords
    return [w for w in word_tokens if not w.lower() in stop_words]


def remove_punctuation(words: List[str]) -> List[str]:
    return [w for w in words if not only_punctuation(w)]


# Returns true if all characters in the input string are punctuation characters
def only_punctuation(string):
    return all(unicodedata.category(char).startswith("P") for char in string)


# For now, assume the file is a plain text file. Converting pdfs/word docs is a TODO.
try:
    with open(document_path, "r") as file:
        text = file.read()

        # TODO text preprocessing
        words = remove_stopwords(text)
        words = remove_punctuation(words)

        json_data = word_frequencies(words)

        # Send back to TS
        print(json_data)

except FileNotFoundError:
    print("The file was not found.")
    sys.exit(1)
