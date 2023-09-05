import os, sys
from collections import Counter
import json

def word_frequencies(text: str) -> str:
    words = text.split()
    word_freq = Counter(words)

    # Convert Counter to a dictionary for JSON
    word_freq_dict = dict(word_freq)
    return json.dumps(word_freq_dict, indent=4)

document_path = sys.argv[1]

# For now, assume the file is a plain text file. Converting pdfs/word docs is a TODO.
try:
    with open(document_path, 'r') as file:
        text = file.read()

        # TODO text preprocessing
        json_data = word_frequencies(text)

        # Send back to TS
        print(json_data)

except FileNotFoundError:
    print("The file was not found.")
    sys.exit(1)
