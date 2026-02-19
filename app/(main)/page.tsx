"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Card, CardContent } from '@/components/ui/card';
import { Lato } from 'next/font/google';
import Image from 'next/image';
import DADAM from '@/img/DADAM.svg';
import encourage from'@/img/iconEncouraging.png';
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from 'react';
// import { motion } from "framer-motion";

const lato = Lato({
  subsets:['latin'],
  weight:"300",
  style:"italic"
});

export default function Home() {
  const [showArrow, setShowArrow] = useState(true);

  // Smooth scroll down
  const handleScroll = () => {
    const section = document.getElementById("next-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Hide arrow after scrolling down
  useEffect(() => {
    const handleScrollEvent = () => {
      if (window.scrollY > 50) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    };

    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  return (
    <>
      <div className="relative min-h-screen flex flex-col justify-center items-center">  
        <div className='grid grid-rows-1 grid-cols-2 gap-10'>
          <div className='mt-[0vh] ml-[-13vw]'>
            <Image src={DADAM} alt='DADAM' width={800} />
            {/* <div className={roboto.className}>
              <h1 className='text-[10rem] text-left font-poppins'>DADAM</h1>
            </div> */}
              <br />
            <h3 className='ml-[2.5%] text-[1rem] text-justify'>BPS Kabupaten Merangin kini hadir dengan sistem <i>dashboard</i> yang dapat 
              digunakan untuk mengeksplor perkembangan kondisi Kabupaten Merangin secara lebih interaktif dan informatif.</h3>
          </div>
          <div className='w-[100%] mt-[-10vh]'>
            <DotLottieReact
            src="https://lottie.host/2c0a47bd-ad4b-4917-b47d-e11862d4798b/nEeDDeOgOt.lottie"
            loop
            autoplay
            width="100%"
            height="100%"
            />
          </div>
        </div>
        {/* Scroll Arrow */}
        {showArrow && (
          <button
            onClick={handleScroll}
            className="absolute left-[30vw] bottom-25 animate-bounce text-blue-600 dark:text-blue-300 hover:text-blue-800 transition"
          >
            <ChevronDown size={48} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Next Section */}
      <div
        id="next-section"
        className="min-h-screen ml-[-22%] w-auto pt-[8%] pl-[2%] pr-[2%] pb-[0%]"
      >
        <div 
          className="grid grid-rows-1 grid-cols-2 gap-5 w-[100%] h-[100vh] rounded-xl mt-[-5%] pl-[5%] pr-[5%] pb-0"   
          style={{background: "linear-gradient(90deg, #dd5ed9ff 0%, #3c75e0ff 100%)"}}
        >
          <div className="flex justify-between items-center">
            
            <Image src={encourage} alt='Encouraging' width={500}/>
            {/* First Lottie */}
            {/* <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.1 }} // re-triggers on every scroll into view
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full max-w-[450px] aspect-square ml-[-10%]"
            >
              <DotLottieReact
                src="https://lottie.host/7d79e464-2829-4831-8a79-2bbd49711d86/tfWL2CiRfX.lottie"
                loop
                autoplay
                style={{ width: "110%", height: "110%" }}
              />
            </motion.div> */}
          </div>
          <div className='grid '>
            <div className="mr-[-18%]">
              <Card className="rounded-tl-none rounded-tr-4xl rounded-br-4xl rounded-bl-4xl w-full bg-blue-100/50 backdrop-filter backdrop-blur-md dark:bg-blue-800 h-[25vh] w-[100%] pr-2 pl-2 mt-[3%] ml-[-12%]">
                  <CardContent>
                    <h2 className="{`${lato.variable} font-sans`} text-justify text-3xl text-[#ffffff]">
                      Ingin mempelajari kondisi perekonomian dan sosial-kependudukan 
                      Kabupaten Merangin terkini?
                    </h2>
                  </CardContent>
              </Card>
            </div>
            <div className="rounded-md mr-[-18%]">
              <Card className="rounded-tl-none rounded-tr-4xl rounded-br-4xl rounded-bl-4xl w-full bg-blue-100/50 backdrop-filter backdrop-blur-md dark:bg-blue-800 h-[25vh] w-[100%] pr-2 pl-2 mt-[0%] ml-[-12%]">
                  <CardContent>
                    <h2 className="{`${lato.variable} font-sans`} text-justify text-3xl text-[#ffffff]">
                      Rasakan pengalaman eksplorasi data pereokonomian dan sosial-kependudukan
                      secara ringkas dan menarik
                    </h2>
                  </CardContent>
              </Card>
            </div>
            <div className="rounded-md mr-[-18%]">
              <Card className="rounded-tl-none rounded-tr-4xl rounded-br-4xl rounded-bl-4xl w-full bg-blue-100/50 backdrop-filter backdrop-blur-md dark:bg-blue-800 h-[25vh] w-[100%] pr-2 pl-2 mt-[0%] ml-[-12%]">
                  <CardContent>
                    <h2 className="{`${lato.variable} font-sans`} text-justify text-3xl text-[#ffffff]">
                      Data perekonomian dan sosial-kependudukan kini disajikan dengan grafik dan 
                      peta yang interaktif
                    </h2>
                  </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
