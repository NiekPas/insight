interface TextProcessingOptions {
  removeStopwords: boolean;
  removePunctuation: boolean;
  topicModellingOptions: TopicModellingOptions;
}

interface TopicModellingOptions {
  runTopicModelling: boolean;
  numberOfTopics: number;
}

export default TextProcessingOptions;
export { TopicModellingOptions };
