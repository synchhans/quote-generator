"use client";
import AlertMessage from "./components/AlertMessage";
import QuoteCard from "./components/QuoteCard";
import GetQuoteButton from "./components/GetQuoteButton";
import Footer from "./components/Footer";
import useQuoteManager from "../../lib/hook/useQuoteManager";

const HomePage = () => {
  const {
    quoteText,
    quoteAuthor,
    canGetQuote,
    limitInfo,
    isLoading,
    isQuoteCopied,
    alertMessage,
    getRandomQuote,
    setAlertMessage,
    setIsQuoteCopied,
  } = useQuoteManager();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <AlertMessage message={alertMessage} />
        <QuoteCard
          text={quoteText}
          author={quoteAuthor}
          isQuoteCopied={isQuoteCopied}
          onCopy={() => {
            const quote = `${quoteText} ${quoteAuthor}`;
            navigator.clipboard.writeText(quote).then(() => {
              setAlertMessage("Kutipan berhasil disalin!");
              setIsQuoteCopied(true);
              setTimeout(() => setAlertMessage(null), 4000);
            });
          }}
        />
        <p className="text-gray-600 mb-2">{limitInfo}</p>
        <GetQuoteButton
          onClick={getRandomQuote}
          canGetQuote={canGetQuote}
          isLoading={isLoading}
        />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
