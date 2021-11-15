import React from "react";
import CurrencyInput from "react-currency-input-field";
import ReactDOM from "react-dom";

ReactDOM.render(
  <React.StrictMode>
    <CurrencyInput />
  </React.StrictMode>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
