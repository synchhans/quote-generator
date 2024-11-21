interface QuoteCardProps {
  text: string;
  author: string;
  isQuoteCopied: boolean;
  onCopy: () => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({
  text,
  author,
  isQuoteCopied,
  onCopy,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-xl w-full text-center mb-6 transform transition duration-300 hover:scale-105">
      <p className="text-xl font-semibold mb-4">{text}</p>
      <p className="text-gray-500 mb-4">{author}</p>
      {text && author && !isQuoteCopied && (
        <button
          onClick={onCopy}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transform transition duration-300 hover:scale-105"
        >
          Salin Kutipan
        </button>
      )}
    </div>
  );
};

export default QuoteCard;
