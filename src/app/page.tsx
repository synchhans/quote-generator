"use client";
import { useState, useEffect } from "react";
import AlertMessage from "./components/AlertMessage";
import QuoteCard from "./components/QuoteCard";
import GetQuoteButton from "./components/GetQuoteButton";
import Footer from "./components/Footer";

const HomePage = () => {
  const [quoteText, setQuoteText] = useState<string>(
    "Klik tombol untuk mendapatkan quote!"
  );
  const [quoteAuthor, setQuoteAuthor] = useState<string>("");
  const [canGetQuote, setCanGetQuote] = useState<boolean>(true);
  const [quoteRequestCount, setQuoteRequestCount] = useState<number>(0);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [limitInfo, setLimitInfo] = useState<string>(
    "Jumlah kutipan yang tersisa: 10"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isQuoteCopied, setIsQuoteCopied] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const updateLimitInfo = (remainingTime: number | null = null) => {
    if (quoteRequestCount >= 10) {
      if (remainingTime !== null) {
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        setLimitInfo(
          `Batas kutipan tercapai, harap tunggu ${minutes}:${seconds
            .toString()
            .padStart(2, "0")} menit.`
        );
      } else {
        setLimitInfo("Batas kutipan tercapai, harap tunggu 5 menit.");
      }
      setCanGetQuote(false);
    } else {
      setLimitInfo(`Jumlah kutipan yang tersisa: ${10 - quoteRequestCount}`);
      setCanGetQuote(true);
    }
  };

  const startCountdown = (remainingTime: number) => {
    let timeLeft = remainingTime;

    const countdownInterval = setInterval(() => {
      timeLeft -= 1000;

      if (timeLeft > 0) {
        updateLimitInfo(timeLeft);
      } else {
        clearInterval(countdownInterval);
        setLimitInfo("Batas kutipan telah direset. Silakan coba lagi.");
        setCanGetQuote(true);
        localStorage.setItem("quoteRequestCount", "0");
        localStorage.setItem(
          "lastRequestTime",
          new Date().getTime().toString()
        );
      }
    }, 1000);
  };

  const getRandomQuote = async () => {
    if (quoteRequestCount >= 10) {
      const currentTime = new Date().getTime();
      if (currentTime - lastRequestTime < 300000) {
        const remainingTime = 300000 - (currentTime - lastRequestTime);
        startCountdown(remainingTime);
        return;
      }
      setQuoteRequestCount(0);
      localStorage.setItem("quoteRequestCount", "0");
      localStorage.setItem("lastRequestTime", currentTime.toString());
      updateLimitInfo();
    }

    setQuoteRequestCount((prevCount) => {
      const newCount = prevCount + 1;
      localStorage.setItem("quoteRequestCount", newCount.toString());
      localStorage.setItem("lastRequestTime", new Date().getTime().toString());
      updateLimitInfo(newCount);
      return newCount;
    });

    setIsLoading(true);

    try {
      const response = await fetch("/api/quotes");
      if (!response.ok) {
        throw new Error("Gagal mendapatkan data kutipan");
      }

      const quotes = await response.json();
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuoteText(randomQuote.text);
      setQuoteAuthor(`- ${randomQuote.author}`);
    } catch (error) {
      setAlertMessage("Terjadi kesalahan dalam mengambil kutipan!");
      setTimeout(() => setAlertMessage(null), 4000);
    } finally {
      setIsLoading(false);
      setIsQuoteCopied(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRequestCount = parseInt(
        localStorage.getItem("quoteRequestCount") || "0"
      );
      const storedLastTime = parseInt(
        localStorage.getItem("lastRequestTime") || "0"
      );

      setQuoteRequestCount(storedRequestCount);
      setLastRequestTime(storedLastTime);
      updateLimitInfo(storedRequestCount);
    }
  }, []);

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
