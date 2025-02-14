import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout } from "../../redux/features/authSlice";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [pageScroll, setPageScroll] = useState(false);

  const dropdownRef = useRef(null);

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

 const logoutHandler = async () => {
   try {
     await logoutApiCall().unwrap();
     dispatch(logout());
     navigate("/login");
   } catch (error) {
     console.error("Logout error:", error);
   }
 };

  useEffect(() => {
    const handleScroll = () => {
      setPageScroll(window.scrollY >= 90);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <>
      <div
        className={`w-full z-10 fixed duration-300 ease-in ${
          pageScroll && "shadow-lg"
        }`}
      >
        <div className="flex justify-end items-center w-full max-w-screen-xl mx-auto mt-2 p-2">
          <div className="hidden md:flex items-center space-x-2">
            <div className="block cursor-pointer text-gray-800 hover:text-black duration-200 ease-out hover:scale-105 tracking-wider">
              <Button className="bg-red-800 hover:bg-red-700 text-white text-lg rounded-3xl">
                <Link
                  to="/home"
                  className="text-xs font-semibold capitalize text-gray-200"
                >
                  Home
                </Link>
              </Button>
            </div>
            {userInfo ? (
              <div
                className="relative flex items-center cursor-pointer text-gray-800 hover:text-black transition duration-200 ease-in-out"
                ref={dropdownRef}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="block cursor-pointer text-gray-800 hover:text-black duration-200 ease-out hover:scale-105 tracking-wider">
                  <Button className="bg-red-800 hover:bg-red-700 text-white text-lg rounded-3xl">
                    <span className="text-xs font-semibold capitalize text-gray-200">
                      hi, {userInfo.username}
                    </span>
                  </Button>
                </div>
                {dropdownOpen && (
                  <div className="fixed top-14 right-[3rem] w-[14rem] shadow-lg bg-white p-2">
                    <div className="relative left-[65px] mr- transform-translate-x-1/2 w-14 h-1 bg-red-500 group-hover:bg-red-600 transition-colors duration-300"></div>
                    {userInfo.isAdmin && (
                      <>
                        <div className="p-4 border-b">
                          <p className="font-semibold text-sm">
                            Hello {userInfo.username}
                          </p>
                          <p className="text-xs mt-1">{userInfo.phone}</p>
                        </div>

                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-xs hover:text-sm text-gray-500 hover:text-black transition-all duration-300 ease-out tracking-wider cursor-pointer hover:font-semibold"
                          onClick={closeDropdown}
                        >
                          Dashboard
                        </Link>
                      </>
                    )}
                    <hr className="relative left-[1rem] w-[10rem]" />
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-xs hover:text-sm text-gray500 hover:text-black transition-all duration-300 ease-out hover:font-semibold tracking-wider cursor-pointer"
                      onClick={closeDropdown}
                    >
                      Edit Profile
                    </Link>
                    <Link
                      to="/contact"
                      className="block px-4 py-2 text-xs hover:text-sm text-gray-500 hover:text-black transition-all duration-300 ease-out hover:font-semibold tracking-wider cursor-pointer"
                      onClick={closeDropdown}
                    >
                      Contact Us
                    </Link>
                    <button
                      className="block px-4 py-2 text-xs hover:text-sm text-gray-500 hover:text-[#D70040] hover:font-semibold transition-all duration-300 ease-out tracking-wider cursor-pointer"
                      onClick={() => {
                        closeDropdown();
                        logoutHandler();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="block cursor-pointer text-gray-800 hover:text-black t duration-200 ease-out hover:scale-105 tracking-wider"
              >
                <Button className="bg-red-800 hover:bg-red-700 text-white text-lg rounded-3xl text-xs font-semibold capitalize text-gray-200">
                  Login
                </Button>
              </Link>
            )}
          </div>
          <button
            className="md:hidden text-lg px-4 py-2 bg-[#649899] text-white rounded-xl shadow-md"
            onClick={toggleSidebar}
          >
            Menu
          </button>
        </div>
      </div>

      {/* Sidebar for mobile view */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-75">
          <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg p-6">
            <button
              className="block mb-6 text-lg px-4 py-2 bg-[#649899] text-white rounded-xl shadow-md"
              onClick={closeSidebar}
            >
              Close
            </button>
            <ul className="space-y-4">
              {userInfo ? (
                <>
                  {userInfo.isAdmin && (
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="block text-gray-800 hover:text-black transition duration-200 ease-in-out"
                        onClick={closeSidebar}
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/profile"
                      className="block text-gray-800 hover:text-black transition duration-200 ease-in-out"
                      onClick={closeSidebar}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        closeSidebar();
                        logoutHandler();
                      }}
                      className="block w-full text-gray-800 hover:text-black transition duration-200 ease-in-out"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="block text-gray-800 hover:text-black transition duration-200 ease-in-out"
                    onClick={closeSidebar}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
