import React, { useState } from "react";

const EncoderDecoder = ({ codes, Name }) => {
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
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="DecodeWrap">
      <h2>Кодирование {Name}</h2>

      <div>
        <label>Введите текст для кодирования: </label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Введите текст"
        />
        <div>
          <h3>Закодированное сообщение:</h3>
          <p className="encodedInput">{encodeMessage(inputText)}</p>
        </div>
      </div>
      <button onClick={() => copyToClipboard(encodeMessage(inputText))}>
        Скопировать 📄
      </button>

      <div>
        <label>Введите текст для декодирования: </label>
        <input
          type="text"
          value={decodeInput}
          onChange={(e) => setDecodeInput(e.target.value)}
          placeholder="Введите закодированный текст"
        />
      </div>
      <button onClick={handleDecode}>Декодировать 🪄</button>

      {decodedText && (
        <div>
          <h3>Декодированное сообщение:</h3>
          <p className="encodedInput">{decodedText}</p>
        </div>
      )}
    </div>
  );
};

export default EncoderDecoder;
