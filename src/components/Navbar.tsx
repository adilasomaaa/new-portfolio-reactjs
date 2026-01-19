import { Link, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const menus = [
    { label: "Home", to: "home", type: "scroll" },
    { label: "Skills", to: "skills", type: "scroll" },
    { label: "Experience", to: "works", type: "scroll" },
    { label: "Projects", to: "projects", type: "scroll" },
    { label: "Blog", to: "/blog", type: "link" },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="w-full flex flex-col items-center pt-8 pb-4 border-b-4 border-black mb-8 px-4 bg-paper text-ink">
      <div className="w-full max-w-7xl flex justify-between items-center text-xs font-mono border-b border-black pb-2 mb-4 uppercase tracking-widest">
        <span>The Digital Portfolio</span>
        <span>{currentDate}</span>
        <span>Vol. I</span>
      </div>

      <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tight text-center my-4 uppercase">
        Portfolio
      </h1>

      <nav className="w-full border-t-2 border-b-2 border-black py-3 mt-4">
        <ul className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm md:text-base font-sans font-bold uppercase tracking-wider">
          {menus.map((item) => (
            <li key={item.label}>
              {item.type === "scroll" && isHome ? (
                <ScrollLink
                  to={item.to}
                  smooth={true}
                  duration={500}
                  className="cursor-pointer hover:underline decoration-2"
                >
                  {item.label}
                </ScrollLink>
              ) : (
                <Link
                  to={item.type === "scroll" ? "/" : item.to}
                  className="cursor-pointer hover:underline decoration-2"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
