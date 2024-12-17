// src/SecondTable.js
import React from 'react';

const SecondTable = ({ totalSymbols, entropyValue }) => {
  const asciiBits = 8; // Разрядность кода ASCII
  const hartleyBits = Math.log2(totalSymbols); // Разрядность кода Хартли

  const asciiUncertainty = asciiBits;
  const hartleyUncertainty = hartleyBits;

  const asciiAbsoluteRedundancy = asciiBits - entropyValue;
  const hartleyAbsoluteRedundancy = hartleyBits - entropyValue;

  const asciiRelativeRedundancy = asciiAbsoluteRedundancy / asciiBits;
  const hartleyRelativeRedundancy = hartleyAbsoluteRedundancy / hartleyBits;

  const data = [
    {
      type: 'При кодировании сообщения стандартной кодовой таблицей ASCII',
      uncertainty: asciiUncertainty,
      codeLength: asciiBits,
      absoluteRedundancy: asciiAbsoluteRedundancy,
      relativeRedundancy: asciiRelativeRedundancy
    },
    {
      type: 'При использовании равномерного кода, построенного на основе меры Хартли',
      uncertainty: hartleyUncertainty,
      codeLength: hartleyBits,
      absoluteRedundancy: hartleyAbsoluteRedundancy,
      relativeRedundancy: hartleyRelativeRedundancy
    }
  ];

  return (
    <table>
      <thead>
        <tr>
          <th>Тип кодирования</th>
          <th>Неопределенность</th>
          <th>Разрядность кода</th>
          <th>Абсолютная избыточность</th>
          <th>Относительная избыточность</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.type}</td>
            <td>{row.uncertainty.toFixed(4)}</td>
            <td>{row.codeLength.toFixed(4)}</td>
            <td>{row.absoluteRedundancy.toFixed(4)}</td>
            <td>{row.relativeRedundancy.toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SecondTable;
