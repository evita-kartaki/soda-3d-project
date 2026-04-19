import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, useGLTF } from '@react-three/drei';
const slides = [
  {
    id: 0,
    titleTop: 'GREEN',
    titleBottom: 'APPLE',
    desc: 'Refreshing natural apple soda\nLight, crisp and vibrant taste',
    amount: '330 ml',
    lines: ['carbonated soda', 'apple flavor', 'non-alcoholic'],
    bg: '#c6e3c8',
    bg2: '#b8dbbb',
    card: '#eaf6ec',
    blob: '#6edc74',
    text: '#2e7b3e',
    model: '/soda1.glb',
  },
  {
    id: 1,
    titleTop: 'BLACK',
    titleBottom: 'CHERRY',
    desc: 'Sweet and bold cherry flavor\nRich, vibrant and refreshing taste',
    amount: '330 ml',
    lines: ['carbonated soda', 'cherry flavor', 'non-alcoholic'],
    bg: '#efd6d8',
    bg2: '#e9c9cb',
    card: '#f7e4e5',
    blob: '#e05757',
    text: '#7f1d1d',
    model: '/soda2.glb',
  },
  {
    id: 2,
    titleTop: 'BLUE',
    titleBottom: 'BERRY',
    desc: 'Cool and refreshing berry soda\nCrisp, smooth and energizing taste',
    amount: '330 ml',
    lines: ['carbonated soda', 'berry flavor', 'non-alcoholic'],
    bg: '#d6e3f1',
    bg2: '#c7d6ea',
    card: '#eef4fb',
    blob: '#6fa8dc',
    text: '#2c5282',
    model: '/soda3.glb',
  },
];

function SodaModel({ url, activeIndex, myIndex }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(), [scene]);
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;

    const isActive = activeIndex === myIndex;
    const isMobile = window.innerWidth <= 768;

    const targetScale = isActive
      ? (isMobile ? 26 : 30)
      : 0.001;

    const targetX = isActive
      ? (isMobile ? -1.5 : 0.8)
      : 4;

    const targetY = isActive
      ? (isMobile ? -3 : -0.7)
      : -2;

    const targetZ = isActive ? 0 : -5;

    ref.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.12
    );

    ref.current.position.lerp(
      new THREE.Vector3(targetX, targetY, targetZ),
      0.12
    );

    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      0,
      0.08
    );

    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      -0.22,
      0.08
    );

    ref.current.rotation.y += delta * 1.6;
  });

  return <primitive ref={ref} object={cloned} />;
}


function ThreeScene({ activeIndex }) {
  return (
    <>
      <ambientLight intensity={2.5} />
      <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={3} />
      <pointLight position={[-10, -10, -10]} color="white" intensity={2} />
      <Environment preset="lobby" intensity={1.2} />

      <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.22}>
        <SodaModel url="/soda1.glb" activeIndex={activeIndex} myIndex={0} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.22}>
        <SodaModel url="/soda2.glb" activeIndex={activeIndex} myIndex={1} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.22}>
        <SodaModel url="/soda3.glb" activeIndex={activeIndex} myIndex={2} />
      </Float>
    </>
  );
}



function Overlay({ slide }) {
  const [line1, line2] = slide.desc.split('\n');

  return (
    <div
      className="hero-ui"
      style={{
        '--bg1': slide.bg,
        '--bg2': slide.bg2,
        '--card': slide.card,
        '--blob': slide.blob,
        '--text': slide.text,
      }}
    >
      <div className="hero-bg-blur blur-1" />
      <div className="hero-bg-blur blur-2" />

      <div className="hero-card">
        <div className="hero-copy-left">
          <p className="hero-small-text">
            {line1}
            <br />
            {line2}
          </p>

          <h1 className="hero-title">
            {slide.titleTop}
            <br />
            {slide.titleBottom}
          </h1>
        </div>

        <div className="hero-blob" />

        <div className="hero-info-right">
          <div className="hero-info-title">{slide.amount}</div>
          <div className="hero-info-line" />
          <div className="hero-info-item">{slide.lines[0]}</div>
          <div className="hero-info-line" />
          <div className="hero-info-item">{slide.lines[1]}</div>
          <div className="hero-info-line" />
          <div className="hero-info-item">{slide.lines[2]}</div>
        </div>
      </div>
    </div>
  );
}


export default function Scene() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    document.body.style.margin = '0';

    const onScroll = () => {
      const sectionHeight = window.innerHeight;
      const current = window.scrollY;

      let nextIndex = 0;

      if (current < sectionHeight) {
        nextIndex = 0;
      } else if (current < sectionHeight * 2) {
        nextIndex = 1;
      } else {
        nextIndex = 2;
      }

      setActiveIndex(nextIndex);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="scene-root">
      <Canvas
        className="scene-canvas"
        camera={{ position: [0, 0, 20], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ThreeScene activeIndex={activeIndex} />
      </Canvas>

      <Overlay slide={slides[activeIndex]} />

      <div className="native-scroll-space" />
    </div>
  );
}