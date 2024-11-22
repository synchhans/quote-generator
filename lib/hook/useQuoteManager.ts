import { useState, useEffect, useRef } from "react";

const useQuoteManager = () => {
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
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedQuoteText = localStorage.getItem("lastQuoteText");
      const storedQuoteAuthor = localStorage.getItem("lastQuoteAuthor");
      const storedRequestCount = parseInt(
        localStorage.getItem("quoteRequestCount") || "0",
        10
      );
      const storedLastTime = parseInt(
        localStorage.getItem("lastRequestTime") || "0",
        10
      );
      const storedRemainingTime = parseInt(
        localStorage.getItem("remainingTime") || "0",
        10
      );

      if (storedQuoteText) setQuoteText(storedQuoteText);
      if (storedQuoteAuthor) setQuoteAuthor(storedQuoteAuthor);
      if (!isNaN(storedRequestCount)) setQuoteRequestCount(storedRequestCount);
      if (!isNaN(storedLastTime)) setLastRequestTime(storedLastTime);
      if (!isNaN(storedRemainingTime) && storedRemainingTime > 0) {
        setRemainingTime(storedRemainingTime);
        startCountdown(storedRemainingTime);
      }

      updateLimitInfoByCount(storedRequestCount);
    }
  }, [isClient]);

  const updateLimitInfoByCount = (count: number) => {
    if (count >= 10) {
      setLimitInfo("Batas kutipan tercapai, harap tunggu 05:00 menit.");
      setCanGetQuote(false);
      if (!remainingTime) startCountdown(300000);
    } else {
      setLimitInfo(`Jumlah kutipan yang tersisa: ${10 - count}`);
      setCanGetQuote(true);
    }
  };

  const updateLimitInfoByTime = (remainingTime: number) => {
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    setLimitInfo(
      `Batas kutipan tercapai, harap tunggu ${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} menit.`
    );
  };

  const startCountdown = (remainingTime: number) => {
    if (countdownRef.current) return;
    let timeLeft = remainingTime;
    setCanGetQuote(false);

    countdownRef.current = setInterval(() => {
      timeLeft -= 1000;
      setRemainingTime(timeLeft);
      localStorage.setItem("remainingTime", timeLeft.toString());
      updateLimitInfoByTime(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(countdownRef.current!);
        countdownRef.current = null;
        setCanGetQuote(true);
        resetQuoteLimit();
      }
    }, 1000);
  };

  const resetQuoteLimit = () => {
    setQuoteRequestCount(0);
    setCanGetQuote(true);
    setLimitInfo("Batas kutipan telah direset. Silakan coba lagi.");
    if (isClient) {
      localStorage.setItem("quoteRequestCount", "0");
      localStorage.setItem("lastRequestTime", "0");
      localStorage.setItem("remainingTime", "0");
    }
  };

  const getRandomQuote = async () => {
    const currentTime = new Date().getTime();
    if (quoteRequestCount >= 10) {
      if (currentTime - lastRequestTime < 300000) {
        const remainingTime = 300000 - (currentTime - lastRequestTime);
        startCountdown(remainingTime);
        return;
      } else {
        resetQuoteLimit();
      }
    }

    setQuoteRequestCount((prevCount) => {
      const newCount = prevCount + 1;
      if (isClient) {
        localStorage.setItem("quoteRequestCount", newCount.toString());
        localStorage.setItem("lastRequestTime", currentTime.toString());
      }
      updateLimitInfoByCount(newCount);
      return newCount;
    });

    setIsLoading(true);

    try {
      const response = await fetch("/api/quotes/random");
      if (!response.ok) throw new Error("Gagal mendapatkan data kutipan");

      const { text, author } = await response.json();
      setQuoteText(text);
      setQuoteAuthor(`- ${author}`);

      if (isClient) {
        localStorage.setItem("lastQuoteText", text);
        localStorage.setItem("lastQuoteAuthor", `- ${author}`);
      }
    } catch (error: any) {
      setQuoteText("Tidak dapat memuat kutipan.");
      setQuoteAuthor("- Unknown");
      setAlertMessage(error.message);
      setTimeout(() => setAlertMessage(null), 4000);
    } finally {
      setIsLoading(false);
      setIsQuoteCopied(false);
    }
  };

  return {
    quoteText,
    quoteAuthor,
    canGetQuote,
    quoteRequestCount,
    limitInfo,
    isLoading,
    isQuoteCopied,
    alertMessage,
    getRandomQuote,
    setAlertMessage,
    setIsQuoteCopied,
  };
};

export default useQuoteManager;
