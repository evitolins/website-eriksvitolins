import { useEffect, useState } from "react";
import { About } from "./About";
import "./App.scss";
import { Footer } from "./Footer";
import { Showcase } from "./Showcase";
import { NavLink, Route, Routes } from "react-router-dom";
import useAudioAmplitude from "./hooks/useAudio";
import audiofile from "./assets/Melt.mp3";

function App() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const { play, isReady, handleClick } = useAudioAmplitude(audiofile, (x) => {
    console.log(x);
  });

  useEffect(() => {
    isReady && play();
  }, [isReady, play]);

  function handleMouseMove(ev: React.MouseEvent) {
    setMouse({ x: ev.pageX, y: ev.pageY });
  }

  return (
    <div onClick={handleClick} onMouseMove={handleMouseMove}>
      <Showcase
        numSplines={100}
        numVertices={100}
        splineOffset={0.2}
        maxOffset={10}
        maxRotate={360}
        minThickness={1}
        maxThickness={16}
        mouseX={mouse.x}
        mouseY={mouse.y}
        wiggle={mouse.y}
      />
      <div className="menu">
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "current" : "")}
        >
          about
        </NavLink>
        <NavLink
          to="/work"
          className={({ isActive }) => (isActive ? "current" : "")}
        >
          work
        </NavLink>
        <NavLink
          to="/music"
          className={({ isActive }) => (isActive ? "current" : "")}
        >
          music
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "current" : "")}
        >
          contact
        </NavLink>
      </div>

      <Routes>
        <Route index element={<About />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/work" element={<Work />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
