"use client";
import { navbarCategory } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useContext } from "react";
import { I18nContext } from "@/app/i18n-provider";

const Navbar = () => {
  const pathName = usePathname();
  const { t } = useTranslation();
  const { language, changeLanguage } = useContext(I18nContext);

  const handleLanguageChange = () => {
    changeLanguage(language === "en" ? "vi" : "en");
    // window.location.reload();
  };

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
                {t(`Navbar.NavbarLeft.${category.title}`)}
              </p>
            </Link>
          ))}
        </div>

        {/* NAVBAR RIGHT */}
        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center space-x-5">
            <p className="text-sm font-semibold text-white">
              {t(`Navbar.NavbarRight.Day.${new Date().getDay()}`)}{" "}
              {t(`Navbar.NavbarRight.Month.${new Date().getMonth() + 1}`)}{" "}
              {new Date().getDate()}{" "}
              {new Date().getFullYear() - 1} {new Date().getHours()}:
              {new Date().getMinutes()}
              {new Date().getHours() < 12 ? " AM" : " PM"}
            </p>
            <div className="flex flex-row items-center gap-1">
              <div className="flex flex-row items-center gap-1">
                <div
                  onClick={handleLanguageChange}
                  className="bg-button relative h-5 w-14 rounded-full hover:cursor-pointer"
                >
                  <div
                    className="absolute top-0 left-0 flex h-full w-full items-center justify-start overflow-hidden rounded-full"
                  >
                    <Image
                    width={100}
                    height={100}
                    style={{
                      width: "auto",
                      height: "100%",
                    }}
                      src={
                        language === "en" ? "/images/en.png" : "/images/vn.png"
                      }
                      alt="language"
                      className={`transform transition-transform duration-300 ease-in-out ${
                        language === "en" ? "-translate-x-2" : "translate-x-8"
                      }`}
                    />
                  </div>
                </div>
                <p className="text-sm font-semibold text-white">{t('Navbar.NavbarRight.Select Language')}</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-1">
              <IoIosHelpCircleOutline color="white" size={"18px"} />
              <p className="text-sm font-semibold text-white">{t('Navbar.NavbarRight.Help')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
