"use client";
import { useState, useEffect } from "react";

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
  const [countdownTimer, setCountdownTimer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isQuoteCopied, setIsQuoteCopied] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const updateLimitInfo = (newCount: number = quoteRequestCount) => {
    if (newCount >= 10) {
      setLimitInfo("Batas kutipan tercapai, harap tunggu 5 menit.");
      setCanGetQuote(false);
    } else {
      setLimitInfo(`Jumlah kutipan yang tersisa: ${10 - newCount}`);
      setCanGetQuote(true);
    }
  };

  const startCountdown = (remainingTime: number) => {
    let timeLeft = remainingTime / 1000;
    setCountdownTimer(
      `Tunggu ${Math.ceil(timeLeft)} detik lagi untuk mendapatkan kutipan baru.`
    );

    const countdownInterval = setInterval(() => {
      timeLeft--;
      setCountdownTimer(
        `Tunggu ${Math.ceil(
          timeLeft
        )} detik lagi untuk mendapatkan kutipan baru.`
      );

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        setLimitInfo("Batas kutipan telah direset. Silakan coba lagi.");
        setCanGetQuote(true);
        localStorage.setItem("quoteRequestCount", "0");
        localStorage.setItem(
          "lastRequestTime",
          new Date().getTime().toString()
        );
        setCountdownTimer("");
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

  const copyQuote = () => {
    const quote = `${quoteText} ${quoteAuthor}`;
    navigator.clipboard
      .writeText(quote)
      .then(() => {
        setAlertMessage("Kutipan berhasil disalin!");
        setIsQuoteCopied(true);
        setTimeout(() => setAlertMessage(null), 4000);
      })
      .catch(() => {
        setAlertMessage("Gagal menyalin kutipan.");
        setTimeout(() => setAlertMessage(null), 4000);
      });
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
        {alertMessage && (
          <div className="bg-blue-500 text-white p-4 rounded-md mb-4 shadow-md animate__animated animate__fadeIn">
            {alertMessage}
          </div>
        )}
        <div className="bg-white shadow-md rounded-lg p-6 max-w-xl w-full text-center mb-6 transform transition duration-300 hover:scale-105">
          <p className="text-xl font-semibold mb-4">{quoteText}</p>
          <p className="text-gray-500 mb-4">{quoteAuthor}</p>
          {quoteText && quoteAuthor && !isQuoteCopied && (
            <button
              onClick={copyQuote}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transform transition duration-300 hover:scale-105"
              disabled={isQuoteCopied}
            >
              Salin Kutipan
            </button>
          )}
        </div>
        <p className="text-gray-600 mb-2">{limitInfo}</p>
        <p className="text-red-500 mb-4">{countdownTimer}</p>
        <button
          onClick={getRandomQuote}
          disabled={!canGetQuote || isLoading}
          className={`${
            canGetQuote && !isLoading
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          } text-white px-6 py-2 rounded-md shadow-md transform transition duration-300 hover:scale-105`}
        >
          {isLoading ? "Loading..." : "Dapatkan Quote"}
        </button>
      </main>
      <footer className="bg-gray-200 py-4 text-center text-sm text-gray-700">
        <h3 className="text-lg font-bold mb-2">Ikuti Saya</h3>
        <div className="flex justify-center space-x-4">
          <a
            href="https://www.youtube.com/@codeworshipper"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
              alt="YouTube"
              className="w-8 h-8 hover:scale-110 transition"
            />
          </a>
          <a
            href="https://www.instagram.com/synchhans"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg"
              alt="Instagram"
              className="w-8 h-8 hover:scale-110 transition"
            />
          </a>
          <a
            href="https://wa.me/+6283804506486"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://clipart.info/images/ccovers/1499955335whatsapp-icon-logo-png.png"
              alt="WhatsApp"
              className="w-8 h-8 hover:scale-110 transition"
            />
          </a>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Hubungi saya di{" "}
          <a
            href="mailto:muhamadfarhan.inc@gmail.com"
            className="text-blue-500 hover:underline"
          >
            muhamadfarhan.inc@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
