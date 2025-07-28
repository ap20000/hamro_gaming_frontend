"use client";

import { useState, useEffect } from "react";
import Slide1 from "../../../../public/images/slide1.jpg";
import Slide2 from "../../../../public/images/slide2.jpg";
import Slide3 from "../../../../public/images/slide3.jpg";
import Image from "next/image";
import Button from "../button";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

export default function HeroSection() {
  const [currentSlider, setCurrentSlider] = useState(0);
  const router = useRouter();

  const slides = [
    {
      id: 1,
      title: "Welcome",
      subtitle: "Hamro Gaming Store",
      image: Slide1,
      btnText: "Shop now",
      href: "/products/accounts",
    },
    {
      id: 2,
      title: "Instant Top-up",
      subtitle: "Recharge your favourite games instantly",
      image: Slide2,
      btnText: "Top-up Now",
      href: "/products/top-up",
    },
    {
      id: 3,
      title: "Gift Cards",
      subtitle: "Perfect gifts for every gamers",
      image: Slide3,
      btnText: "Browse Cards",
      href: "/products/giftcard",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlider((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlider((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlider((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlider ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-gaming-black/80 via-gaming-black/40 to-transparent"></div>

          <div className="relative z-10 flex items-center h-full">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl text-center">
                <h1 className="relative text-5xl md:text-7xl font-orbitron font-bold mb-4 uppercase text-gaming-white tracking-wider drop-shadow-2xl">
                  {slide.title}
                </h1>
                <h3 className="font-sans text-xl md:text-2xl text-gaming-white/90 mb-8 font-light">
                  {slide.subtitle}
                </h3>
                <div className="max-w-1/2 flex items-center justify-center">
                  <Button onClick={() => router.push(slide.href)}>
                    <span className="relative z-10 flex items-center text-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>{slide.btnText}</span>
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-gaming-black/50 hover:bg-gaming-black/80 text-gaming-white rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-gaming-black/50 hover:bg-gaming-black/80 text-gaming-white rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlider(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlider
                ? "bg-gaming-electric-blue scale-125"
                : "bg-gaming-white/50 hover:bg-gaming-white/80"
            }`}
          />
        ))}
      </div>

      {/* Floating stats */}
      <div className="absolute bottom-6 right-6 z-20 bg-[var(--gaming-black)]/80 backdrop-blur-sm rounded-lg p-4 border border-[var(--gaming-gray)]/30">
        <div className="flex items-center space-x-4 text-gaming-white">
          {/* <div className="text-center">
            <div className="font-orbitron text-2xl font-bold text-gaming-electric-blue">
              50K+
            </div>
            <div className="font-sans text-xs text-gaming-white/80 uppercase">
              Happy Gamers
            </div>
          </div> */}
          <div className="w-px h-8 bg-gaming-gray"></div>
          <div className="text-center">
            <div className="font-orbitron text-2xl font-bold text-gaming-electric-blue">
              24/7
            </div>
            <div className="font-sans text-xs text-gaming-white/80 uppercase">
              Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
