import { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const [colapesd, setColapsed] = useState();
  const [toggleNavbar, setToggleNavbar] = useState("");
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Home",
      icon: <i className="ri-home-8-line"></i>,
      onClick: () => navigate("/"),
      path: "/",
    },
    {
      title: "Transactions",
      icon: <i className="ri-bank-line"></i>,
      onClick: () => navigate("/transactions"),
      path: "/transactions",
    },
    {
      title: "Requests",
      icon: <i className="ri-hand-heart-fill"></i>,
      onClick: () => navigate("/requests"),
      path: "/requests",
    },
    {
      title: "Profile",
      icon: <i className="ri-profile-line"></i>,
      onClick: () => navigate("/profile"),
      path: "/profile",
    },

    {
      title: "Logout",
      icon: <i className="ri-logout-box-r-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
      },
      path: "/logout",
    },
  ];

  const adminMenu = [
    {
      title: "Home",
      icon: <i className="ri-home-8-line"></i>,
      onClick: () => navigate("/"),
      path: "/",
    },
    {
      title: "Users",
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate("/users"),
      path: "/users",
    },
    {
      title: "Transactions",
      icon: <i className="ri-bank-line"></i>,
      onClick: () => navigate("/transactions"),
      path: "/transactions",
    },
    {
      title: "Requests",
      icon: <i className="ri-hand-heart-fill"></i>,
      onClick: () => navigate("/requests"),
      path: "/requests",
    },
    {
      title: "Profile",
      icon: <i className="ri-profile-line"></i>,
      onClick: () => navigate("/profile"),
      path: "/profile",
    },

    {
      title: "Logout",
      icon: <i className="ri-logout-box-r-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
      },
      path: "/logout",
    },
  ];

  const menuToRender = user?.isAdmin ? adminMenu : userMenu;

  return (
    <div className="layout">
      {/* sidebar */}
      <div className="sidebar">
        <div className="menu">
          {menuToRender.map((item, index) => {
            const isActive = window.location.pathname === item.path;
            return (
              <div
                key={index}
                className={`menu-item ${isActive ? "active-menu-item" : ""}`}
                onClick={item.onClick}
              >
                {item.icon}
                {!colapesd && (
                  <h1 className="text-white text-sm">{item.title}</h1>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="body">
        <div className="header flex justify-between items-center">
          <div className="text-white sidebar-harmburger">
            {!colapesd ? (
              <i
                className="ri-close-fill"
                onClick={() => setColapsed(!colapesd)}
              ></i>
            ) : (
              <i
                className="ri-menu-line"
                onClick={() => setColapsed(!colapesd)}
              ></i>
            )}
          </div>
          {/* navbar harmburger */}
          <div className={`text-white navbar-harmburger`}>
            {toggleNavbar ? (
              <i
                className="ri-close-fill"
                onClick={() => setToggleNavbar(!toggleNavbar)}
              ></i>
            ) : (
              <i
                className="ri-menu-line"
                onClick={() => setToggleNavbar(!toggleNavbar)}
              ></i>
            )}
          </div>
          <div>
            <h1 className="text-xl text-secondary">Wallet</h1>
          </div>
          {/* navbar */}
          <div className={`navbar ${!toggleNavbar && "toggle-nav-bar"}`}>
            <div className="menu">
              {menuToRender.map((item, index) => {
                const isActive = window.location.pathname === item.path;
                return (
                  <div
                    key={index}
                    className={`menu-item ${
                      isActive ? "active-menu-item" : ""
                    }`}
                    onClick={item.onClick}
                  >
                    <span onClick={() => setToggleNavbar(false)}>
                      {item.icon}
                    </span>
                    <h1
                      className="text-white text-sm"
                      onClick={() => setToggleNavbar(false)}
                    >
                      {item.title}
                    </h1>
                  </div>
                );
              })}
            </div>
          </div>
          {/* navbar end */}
          <div>
            <h1
              className="text-sm underline text-secondary"
              onClick={() => navigate("/profile")}
            >
              {user?.user?.firstName} {user?.user?.lastName}
            </h1>
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
