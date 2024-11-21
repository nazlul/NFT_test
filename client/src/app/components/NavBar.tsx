import { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4 bg-gradient-to-r rounded-br-2xl from-[#b7d7e8] to-[#034f84]">
      <div className="text-[#034f84] md:flex-[0.5] font-serif flex lg:text-3xl md:text-2xl sm:text-2xl justify-center items-center mr-20">
        SCOPE
      </div>

      {/* Desktop */}
      <ul className="text-white md:flex lg:text-2xl sm:text-xl hidden list-none flex-row justify-between p-4 items-center flex-initial">
        <li
          className="cursor-pointer hover:text-[#92a8d1] transition-all duration-[300ms] mr-12"
          onClick={() => setCurrentPage("marketplace")}
        >
          Marketplace
        </li>
        <li
          className="cursor-pointer hover:text-[#92a8d1] transition-all duration-[300ms]"
          onClick={() => setCurrentPage("launchpad")}
        >
          Launchpad
        </li>
      </ul>

      {/* Mobile Menu */}
      <div className="flex relative">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism animate-slide-in text-white">
            <li className="text-xl text-white w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            <li
              className="my-2 text-lg cursor-pointer"
              onClick={() => {
                setCurrentPage("marketplace");
                setToggleMenu(false);
              }}
            >
              Marketplace
            </li>
            <li
              className="my-2 text-lg cursor-pointer"
              onClick={() => {
                setCurrentPage("launchpad");
                setToggleMenu(false);
              }}
            >
              Launchpad
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
