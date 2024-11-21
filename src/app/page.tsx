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
      console.error(error);
      alert("Terjadi kesalahan dalam mengambil kutipan!");
    }
  };

  const copyQuote = () => {
    const quote = `${quoteText} ${quoteAuthor}`;
    navigator.clipboard
      .writeText(quote)
      .then(() => {
        const copyAlert = document.createElement("div");
        copyAlert.classList.add("copy-alert");
        copyAlert.textContent = "Kutipan berhasil disalin!";
        document.body.appendChild(copyAlert);
        setTimeout(() => copyAlert.remove(), 2000);
      })
      .catch(() => {
        alert("Gagal menyalin kutipan.");
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
    <div className="container">
      <div className="quote-box">
        <p id="quote-text">{quoteText}</p>
        <p id="quote-author">{quoteAuthor}</p>
        {/* Show Copy button only when a quote is available */}
        {quoteText && quoteAuthor && (
          <button id="copy-quote-btn" onClick={copyQuote}>
            Copy
          </button>
        )}
      </div>
      <div id="limit-info">{limitInfo}</div>
      <div id="countdown-timer">{countdownTimer}</div>
      <button
        id="get-quote-btn"
        onClick={getRandomQuote}
        disabled={!canGetQuote}
      >
        Dapatkan Quote
      </button>

      <footer>
        <div className="social-media">
          <h3>Ikuti Saya</h3>
          <ul>
            <li>
              <a
                href="https://www.youtube.com/@codeworshipper"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
                  alt="YouTube"
                  className="social-icon"
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/synchhans"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg"
                  alt="Instagram"
                  className="social-icon"
                />
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/+6283804506486"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
              >
                <img
                  src="https://clipart.info/images/ccovers/1499955335whatsapp-icon-logo-png.png"
                  alt="WhatsApp"
                  className="social-icon"
                />
              </a>
            </li>
            <li>
              <a href="mailto:muhamadfarhan.inc@gmail.com" title="Email">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/000/425/714/original/vector-email-icon.jpg"
                  alt="Email"
                  className="social-icon"
                />
              </a>
            </li>
          </ul>
        </div>
        <div className="contact-info">
          <p>
            Hubungi saya di{" "}
            <a href="mailto:muhamadfarhan.inc@gmail.com">
              muhamadfarhan.inc@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
