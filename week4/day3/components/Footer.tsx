import { Facebook, FacebookIcon, Twitter, Youtube } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <div className="mt-[100px] ">
      <div className="bg-[#202020] p-[32px]">
        {/* social links */}
        <div className="flex items-center gap-2 ">
          <FacebookIcon />
          <Twitter />
          <Youtube />
        </div>
        {/* resources link */}
        <div className="lg:w-1/2 md:text-[12px] text-[8px] mt-[32px]">
          <h5 className="text-white/60">Resource</h5>
          <div className="grid grid-cols-5 gap-1">
            <div className="flex flex-col">
              <a href="">Creator Support</a>
              <a href="">Published On Epic</a>
              <a href="">Profession</a>
              <a href="">Company</a>
            </div>
            <div className="flex flex-col">
              <a href="">Fan Work Policy</a>
              <a href="">User Exp Service</a>
              <a href="">User Liscence</a>
            </div>
            <div className="flex flex-col">
              <a href="">Online Service</a>
              <a href="">Community</a>
              <a href="">Epic Newsroom</a>
            </div>
            <div className="flex flex-col">
              <a href="">Battle Breakers</a>
              <a href="">Fortnite</a>
              <a href="">Infinity Blade</a>
            </div>
            <div className="flex flex-col">
              <a href="">Robo Recall</a>
              <a href="">Shadow Complex</a>
              <a href="">Unreal Tournament</a>
            </div>
          </div>
        </div>
        {/* company description */}
        <div className="text-white/60 md:text-[12px] text-[8px] lg:w-[60%] mt-[40px] md:text-left text-justify">
          © 2022, Epic Games, Inc. All rights reserved. Epic, Epic Games, Epic
          Games logo, Fortnite, Fortnite logo, Unreal, Unreal Engine, Unreal
          Engine logo, Unreal Tournament ) and the Unreal Tournament logo are
          trademarks or registered trademarks of Epic Games, Inc. in the United
          States of America and elsewhere. Other brand or product names are
          trademarks of their respective owners. Transactions outside the United
          States are handled through Epic Games International, S.à r.l..
        </div>
        {/* terms & policy */}
        <div className="flex justify-between items-center gap-5 md:text-[12px] text-[8px] mt-6">
          <div className="text-[#E7E7E7] flex md:gap-5 gap-2">
            <a href="">Terms of Service</a>
            <a href="">Privacy Policy</a>
            <a href="">Store Refund Policy</a>
          </div>
          <div>
            <img src="./logo.png" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
