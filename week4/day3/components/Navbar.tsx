"use client";

import { Globe, Menu, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathName = usePathname();
  const isActive = (href: string) => pathName === href;

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="bg-[#313131] pl-5 h-[10vh] text-[12px] text-[#AAAAAA] overflow-x-hidden">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center gap-5 h-full">
          {/* logo */}
          <div>
            <img src="./logo.png" alt="logo" />
          </div>
          {/* desktop navbar */}
          {/* left content */}
          <div className="md:flex hidden items-center justify-center gap-[23px] h-full">
            <Link
              href={"/"}
              className={`flex items-center h-full border-b-5 px-2 border-t-5 border-t-[transparent] ${isActive("/") ? " border-b-[#007AFF]" : " border-b-[transparent]"}`}
            >
              STORE
            </Link>
            <Link
              href={"/faq"}
              className={`flex items-center h-full border-b-5 px-2 border-t-5 border-t-[transparent] ${isActive("/faq") ? " border-b-[#007AFF]" : " border-b-[transparent]"}`}
            >
              FAQ
            </Link>
            <Link
              href={"/help"}
              className={`flex items-center h-full border-b-5 px-2 border-t-5 border-t-[transparent] ${isActive("/help") ? " border-b-[#007AFF]" : " border-b-[transparent]"}`}
            >
              HELP
            </Link>
            <Link
              href={"/unreal"}
              className={`flex items-center h-full border-b-5 px-2 border-t-5 border-t-[transparent] ${isActive("/unreal") ? " border-b-[#007AFF]" : " border-b-[transparent]"}`}
            >
              UNREAL ENGINE
            </Link>
          </div>
        </div>

        {/* right content */}
        <div className="md:flex hidden gap-5 items-center justify-end h-full">
          <div className="mr-5 cursor-pointer">
            <Globe />
          </div>
          <div className="flex items-center justify-center gap-2 cursor-pointer">
            <UserPlus /> SIGN IN
          </div>
          <div className="h-full">
            <a
              href=""
              className="bg-[#007AFF] text-white px-5 h-full  flex justify-center items-center"
            >
              DOWNLOAD
            </a>
          </div>
        </div>
      </div>

      {/* mobile navbar button */}
      <div
        onClick={toggleMenu}
        className="block md:hidden absolute right-10 top-5 cursor-pointer"
      >
        <div
          className={`absolute transition-all duration-300 z-100 ${
            isOpen ? "opacity-0 scale-50" : "opacity-100 scale-100"
          }`}
        >
          <Menu />
        </div>
        <div
          className={`absolute transition-all duration-300 z-100 ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <X />
        </div>
      </div>

      {/* mobile navbar */}
      {isOpen && (
        <div>
          <div className="lg:hidden flex justify-between items-center">
            <div className="fixed top-14 inset-0 bg-black z-50 flex flex-col items-center justify-center space-y-6 transition-all">
              <div className=" absolute top-5 w-full h-full">
                <div className="flex justify-between px-2 items-center gap-15 w-full ">
                  <div className="flex justify-between gap-10 w-full">
                    <div>
                      <Globe />
                    </div>
                    <div className="flex items-center justify-center gap-2 cursor-pointer">
                      <UserPlus /> SIGN IN
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center tracking-widest mt-5">
                  <Link
                    href={"/"}
                    className={`flex items-center h-full px-2 text-lg  `}
                  >
                    STORE
                  </Link>
                  <Link
                    href={"/faq"}
                    className={`flex items-center h-full px-2 text-lg  `}
                  >
                    FAQ
                  </Link>
                  <Link
                    href={"/help"}
                    className={`flex items-center h-full px-2 text-lg  `}
                  >
                    HELP
                  </Link>
                  <Link
                    href={"/unreal"}
                    className={`flex items-center h-full px-2 text-lg  `}
                  >
                    UNREAL ENGINE
                  </Link>
                </div>
                <div className="absolute bottom-5">
                  <a
                    href=""
                    className=" bg-[#007AFF] py-2 text-white  w-screen flex justify-center items-center"
                  >
                    DOWNLOAD
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
