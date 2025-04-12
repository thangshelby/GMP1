"use client";
import React from "react";
import { navbarCategory } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";


const Navbar = () => {
  const pathName = usePathname();

  return (
    <div className="bg-[#4c5261] px-8">
      <div className="flex flex-row justify-between">
        {/* NAVBAR LEFT */}
        <div className="flex flex-row items-center">
          {navbarCategory.map((category) => (
            <Link
              href={category.link}
              key={category.title}
              className={`${pathName == category.link && "bg-[#62697d]"} py-1 hover:cursor-pointer hover:bg-[#62697d]`}
            >
              <p className="px-2 text-sm font-semibold text-white">
                {category.title}
              </p>
            </Link>
          ))}
        </div>

        {/* NAVBAR RIGHT */}
        <div className="flex flex-row items-center">
          <div className="flex flex-row space-x-5 items-center">
            <p suppressHydrationWarning className="text-[10px] font-semibold text-white">
              {format(new Date(), "dd/MM/yyyy")}  
              {new Date().getHours() }:{new Date().getMinutes()}
              {new Date().getHours() < 12 ? " AM" : " PM"}
            </p>
            <p>Theme</p><p>Help</p><p>SignIn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
