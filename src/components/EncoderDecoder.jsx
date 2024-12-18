import React, { useState } from "react";

const EncoderDecoder = ({ codes }) => {
  const [inputText, setInputText] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [decodedText, setDecodedText] = useState("");

  // Функция для кодирования текста
  const encodeMessage = (message) => {
    return message
      .split("")
      .map((char) => codes[char] || "")
      .join("");
  };

  // Функция для декодирования текста
  const decodeMessage = (binary) => {
    let currentCode = "";
    let decoded = "";

    // Создаем обратный словарь для декодирования
    const reverseCodes = Object.fromEntries(
      Object.entries(codes).map(([key, value]) => [value, key])
    );

    for (let bit of binary) {
      currentCode += bit;
      if (reverseCodes[currentCode]) {
        decoded += reverseCodes[currentCode];
        currentCode = "";
      }
    }

    return decoded;
  };

  const handleDecode = () => {
    setDecodedText(decodeMessage(decodeInput));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Текст скопирован в буфер обмена!");
      })
      .catch((error) => {
        console.error("Ошибка копирования текста:", error);
      });
  };

  return (
    <div className="DecodeWrap">
      <h2>Кодировщик и Декодировщик</h2>

      <div>
        <label>Введите текст для кодирования:</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Введите текст"
        />
        <div>
          <h3>Закодированное сообщение:</h3>
          <p>
            <button
              className="encodedText"
              onClick={() => copyToClipboard(encodeMessage(inputText))}
            >
              {encodeMessage(inputText)} 📄
            </button>
          </p>
        </div>
      </div>

      <div>
        <label>Введите текст для декодирования:</label>
        <input
          type="text"
          value={decodeInput}
          onChange={(e) => setDecodeInput(e.target.value)}
          placeholder="Введите закодированный текст"
        />
        <button onClick={handleDecode}>Декодировать</button>
      </div>

      {decodedText && (
        <div>
          <h3>Декодированное сообщение:</h3>
          <p>{decodedText}</p>
        </div>
      )}
    </div>
  );
};

export default EncoderDecoder;
