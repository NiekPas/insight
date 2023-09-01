import os, sys

print("hello here's a message from another universe!")
print("This is the args you sent me:")
print(sys.argv)

document_path = sys.argv[1]

# TODO get file from document path, convert to some usable format, analyze, send back

# import sys,json
# data = sys.stdin.readlines()
# data = json.loads(data[0])
# print(data[0]+10)
# sys.stdout.flush()

# from collections import Counter

# # Sample text (replace with your text)
# text = "This is a sample text. You can replace it with your own text."

# # Tokenize the text into words
# words = text.split()

# # Use Counter to count word frequencies
# word_freq = Counter(words)

# # Print the word frequencies
# for word, freq in word_freq.items():
#     print(f"{word}: {freq}")
