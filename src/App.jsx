// sola. launch page: coral hero with countdown and waitlist, facts strip,
// four flavours, and the order box (subscribe or one-time).
import { useState } from "react";
import { FLAVOURS } from "./data/offer.js";
import Hero from "./components/Hero.jsx";
import Facts from "./components/Facts.jsx";
import Flavours from "./components/Flavours.jsx";
import Order from "./components/Order.jsx";
import Footer from "./components/Footer.jsx";

const readCode = () => {
  try {
    return localStorage.getItem("sola-code") || "";
  } catch {
    return "";
  }
};

export default function App() {
  const [flavour, setFlavour] = useState(FLAVOURS[0].id);
  const [code, setCode] = useState(readCode);

  const saveCode = (value) => {
    setCode(value);
    try {
      localStorage.setItem("sola-code", value);
    } catch {
      // private mode: the code still works for this visit
    }
  };

  const pickFlavour = (id) => {
    setFlavour(id);
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero code={code} onCode={saveCode} />
      <main>
        <Facts />
        <Flavours onPick={pickFlavour} />
        <Order flavour={flavour} onFlavour={setFlavour} code={code} />
      </main>
      <Footer />
    </>
  );
}
