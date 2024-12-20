import React, { useState } from "react";

// Компонент для кодирования и декодирования сообщений
const EncoderDecoder = ({ codes, Name }) => {
  // Состояния для хранения введенного текста, закодированного текста и декодированного текста
  const [inputText, setInputText] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [decodedText, setDecodedText] = useState("");

  // Функция для кодирования текста
  // Принимает сообщение и возвращает закодированную строку
  const encodeMessage = (message) => {
    return message
      .split("")
      .map((char) => codes[char] || "")
      .join("");
  };

  // Функция для декодирования текста
  // Принимает бинарную строку и возвращает декодированное сообщение
  const decodeMessage = (binary) => {
    let currentCode = "";
    let decoded = "";

    // Создаем обратный словарь для декодирования
    const reverseCodes = Object.fromEntries(
      Object.entries(codes).map(([key, value]) => [value, key])
    );

    // Проходим по каждому биту и собираем коды символов
    for (let bit of binary) {
      currentCode += bit;
      if (reverseCodes[currentCode]) {
        decoded += reverseCodes[currentCode];
        currentCode = "";
      }
    }

    return decoded;
  };

  // Обработчик кнопки декодирования
  const handleDecode = () => {
    setDecodedText(decodeMessage(decodeInput));
  };

  // Функция для копирования текста в буфер обмена
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="DecodeWrap">
      <h2>Кодирование {Name}</h2>

      {/* Секция кодирования */}
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

      {/* Секция декодирования */}
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

      {/* Отображение декодированного сообщения */}
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
