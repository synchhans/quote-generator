interface GetQuoteButtonProps {
  onClick: () => void;
  canGetQuote: boolean;
  isLoading: boolean;
}

const GetQuoteButton: React.FC<GetQuoteButtonProps> = ({
  onClick,
  canGetQuote,
  isLoading,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!canGetQuote || isLoading}
      className={`${
        canGetQuote && !isLoading
          ? "bg-green-500 hover:bg-green-600"
          : "bg-gray-400 cursor-not-allowed"
      } text-white px-6 py-2 rounded-md shadow-md transform transition duration-300 hover:scale-105`}
    >
      {isLoading ? "Loading..." : "Dapatkan Quote"}
    </button>
  );
};

export default GetQuoteButton;
