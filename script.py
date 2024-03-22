import sys
from collections import Counter
import json
from typing import List
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
import unicodedata
import numpy as np

from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation


def word_frequencies(words: List[str]) -> dict[str, int]:
    word_freq = Counter(words)

    # Convert Counter to a dictionary for JSON
    word_freq_dict = dict(word_freq)
    return word_freq_dict


def remove_stopwords(words: List[str]) -> List[str]:
    # Get English stopwords
    stop_words = set(stopwords.words("english"))

    # Remove stopwords
    return [w for w in words if not w.lower() in stop_words]


def remove_punctuation(words: List[str]) -> List[str]:
    return [w for w in words if not only_punctuation(w)]


# Returns true if all characters in the input string are punctuation characters
def only_punctuation(string):
    return all(unicodedata.category(char).startswith("P") for char in string)


def lemmatize(words: List[str]) -> List[str]:
    lemmatizer = WordNetLemmatizer()
    return [lemmatizer.lemmatize(word, pos="v") for word in words]


def topic_modelling(words: List[str], num_topics: int) -> List:
    tfidf_vectorizer = TfidfVectorizer(min_df=2)
    tfidf_vectorizer.fit(words)
    tfidf_matrix = tfidf_vectorizer.transform(words)
    tfidf_matrix.shape

    LDA = LatentDirichletAllocation(
        n_components=num_topics, random_state=321, evaluate_every=10
    )
    LDA.fit(tfidf_matrix)
    feature_names = np.array(tfidf_vectorizer.get_feature_names_out())
    topics = []

    for topic in LDA.components_:
        top_word_indices = topic.argsort()[-5:][::-1]
        top_words = feature_names[top_word_indices]
        topics.append(", ".join(top_words))

    # for i, topic in enumerate(topics):
    #     print("topic #" + str(i))
    #     print(topic)
    return topics


def get_num_topics(args) -> int | None:
    for arg in args:
        if arg.startswith("--num-topics"):
            try:
                return int(arg.split("=")[1])
            except ValueError:
                return None


try:
    document_path = sys.argv[1]
except IndexError:
    print("No document path provided.")
    sys.exit(1)

# For now, assume the file is a plain text file. Converting pdfs/word docs is a TODO.
try:
    with open(document_path, "r") as file:
        text = file.read()
        text = text.lower()

        words = word_tokenize(text)

        if "--remove-stopwords" in sys.argv:
            words = remove_stopwords(words)

        if "--remove-punctuation" in sys.argv:
            words = remove_punctuation(words)

        words = lemmatize(words)

        # TODO Number Removal: Optionally remove numerical values.
        # TODO Text Normalization: Convert all characters to a standard form, like ASCII.
        # TODO N-gram Extraction: Create n-word sequences.

        topics = []
        if "--topic-modelling" in sys.argv:
            num_topics = get_num_topics(sys.argv) or 20
            topics = topic_modelling(words, num_topics)

        word_frequency_data = word_frequencies(words)

        combined_dicts = {"topics": topics, "wordFrequencies": word_frequency_data}
        json_dicts = json.dumps(combined_dicts, indent=2)

        # Send back to Electron process
        print(combined_dicts)

except FileNotFoundError:
    print("The file was not found.")
    sys.exit(1)
