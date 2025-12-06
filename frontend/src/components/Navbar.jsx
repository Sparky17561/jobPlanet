import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [menuState, setMenuState] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuState(false);
    setIsProductsOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuState]);

  const toggleMobileMenu = () => {
    setMenuState(!menuState);
  };

  const toggleProducts = () => {
    setIsProductsOpen(!isProductsOpen);
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Pricing", href: "/pricing" },
  ];

  const productItems = [
    { name: "Fillora [Extension]", href: "/products/fillora" },
    { name: "Cold Mail Generator", href: "/products/cold-mail" },
    { name: "Resume Generator", href: "/resume-builder" },
    { name: "Prep Hub", href: "/products/prep-hub" },
  ];

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2 group"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Logo */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                to="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  JobSphere
                </div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200 text-white" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 text-white" />
              </button>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className={cn(
                        "text-muted-foreground hover:text-accent-foreground block duration-150",
                        isActive(item.href) && "text-accent-foreground"
                      )}
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
                {/* Products Dropdown */}
                <li className="relative">
                  <button
                    onClick={toggleProducts}
                    className={cn(
                      "text-muted-foreground hover:text-accent-foreground flex items-center gap-1 duration-150",
                      (isProductsOpen ||
                        location.pathname.startsWith("/products") ||
                        location.pathname === "/resume-builder") &&
                        "text-accent-foreground"
                    )}
                  >
                    <span>Products</span>
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        isProductsOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isProductsOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProductsOpen(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 w-56 bg-background/95 backdrop-blur-md rounded-lg border shadow-xl z-20">
                        <div className="py-2">
                          {productItems.map((item, index) => (
                            <Link
                              key={index}
                              to={item.href}
                              onClick={() => setIsProductsOpen(false)}
                              className="block px-4 py-2 text-muted-foreground hover:text-accent-foreground hover:bg-accent/5 transition-all"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </li>
              </ul>
            </div>

            {/* Mobile Menu & Desktop Auth Buttons */}
            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              {/* Mobile Navigation Links */}
              <div className="lg:hidden w-full">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.href}
                        onClick={toggleMobileMenu}
                        className={cn(
                          "text-muted-foreground hover:text-accent-foreground block duration-150",
                          isActive(item.href) && "text-accent-foreground"
                        )}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                  {/* Mobile Products Section */}
                  <li>
                    <button
                      onClick={toggleProducts}
                      className={cn(
                        "w-full text-left text-muted-foreground hover:text-accent-foreground flex items-center justify-between duration-150",
                        isProductsOpen && "text-accent-foreground"
                      )}
                    >
                      <span>Products</span>
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
                          isProductsOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {isProductsOpen && (
                      <div className="mt-2 ml-4 space-y-2">
                        {productItems.map((item, index) => (
                          <Link
                            key={index}
                            to={item.href}
                            onClick={toggleMobileMenu}
                            className="block text-muted-foreground/60 hover:text-accent-foreground hover:bg-accent/5 transition-all rounded-lg px-2 py-1"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                </ul>
              </div>

              {/* Auth Buttons */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {isAuthenticated ? (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className={cn(isScrolled && "lg:hidden")}
                    >
                      <Link to="/profile">
                        <span>{user?.username || "Profile"}</span>
                      </Link>
                    </Button>
                    <Button
                      onClick={logout}
                      variant="outline"
                      size="sm"
                      className={cn(isScrolled && "lg:hidden")}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className={cn(isScrolled && "lg:hidden")}
                    >
                      <Link to="/login">
                        <span>Login</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className={cn(isScrolled && "lg:hidden")}
                    >
                      <Link to="/register">
                        <span>Sign Up</span>
                      </Link>
                    </Button>
                  </>
                )}
                {!isAuthenticated && (
                  <Button
                    asChild
                    size="sm"
                    className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                  >
                    <Link to="/register">
                      <span>Get Started</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
