import React from "react";
import { devicesData } from "../../../data";
import {
  Gamepad2,
  Laptop,
  RectangleGoggles,
  Smartphone,
  Tablet,
  TvMinimalPlay,
} from "lucide-react";

const SupportedDevices = () => {
  const iconComponents = {
    Smartphone,
    Tablet,
    TvMinimalPlay,
    Laptop,
    Gamepad2,
    RectangleGoggles,
  };

  return (
    <div className="lg:px-10 px-2 my-10">
      <div>
        <div>
          <h4 className="lg:text-[38px] text-[24px] font-bold">
            We Provide you streaming experience across various devices.
          </h4>
          <p className="lg:text-[18px] text-[14px] text-[#999999] lg:block hidden">
            With StreamVibe, you can enjoy your favorite movies and TV shows
            anytime, anywhere. Our platform is designed to be compatible with a
            wide range of devices, ensuring that you never miss a moment of
            entertainment.
          </p>
          <p className="lg:text-[18px] text-[14px] text-[#999999] lg:hidden block">
            With StreamVibe, you can enjoy your favorite movies and TV shows
            anytime, anywhere.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 mt-15">
        {devicesData.map((card) => {
          const IconComponent = iconComponents[card.iconName];
          return (
            <div
              key={card.id}
              className="bg-gradient-to-r from-[#0F0F0F] to-[#E50000]/5 bg-[#0F0F0F] px-5 lg:py-12 py-5 rounded-md border border-[#262626] hover:scale-102 transition-all cursor-pointer"
            >
              <div className="flex gap-2 items-center">
                <div className="bg-[#1f1f1f] p-[16px] border-2 border-[#262626] rounded-md">
                  {IconComponent && <IconComponent size={32} />}
                </div>
                <p className="lg:text-[24px] text-[18px] font-semibold">
                  {card.title}
                </p>
              </div>
              <div className="text-[#999999] lg:text-[18px] text-[14px] text-justify mt-5">
                {card.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SupportedDevices;
