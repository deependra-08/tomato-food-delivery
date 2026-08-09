import { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("");

  const { getTotalCartAmount, token, setToken, search, setSearch, showSearch, setShowSearch } = useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  const logout = ()=>{
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }

  const onSearchIconClick = () => {
    // Search only makes sense on the menu (home) page, so jump there first.
    if (location.pathname !== '/') {
      navigate('/');
    }
    setShowSearch(prev => !prev);
  }

  return (
    <div className='navbar'>

      <Link to='/'>
        <img src={assets.logo} alt="" className="menu" />
      </Link>

      <ul className='navbar-menu'>

        <Link
          to='/'
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>

        <a
          href='#explore-menu'
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </a>

        <a
          href='#app-download'
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile-app
        </a>

        <a
          href='#footer'
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact-us
        </a>

      </ul>

      <div className="navbar-right">

        <div className="navbar-search">
          {showSearch &&
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Search dishes..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              autoFocus
            />
          }
          <img src={assets.search_icon} onClick={onSearchIconClick} alt="" />
        </div>

        <div className="navbar-search-icon">

          <Link to='/cart'>
            <img src={assets.basket_icon} alt="" />
          </Link>

          <div
            className={getTotalCartAmount() === 0 ? "" : "dot"}
          ></div>

        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>
            sign in
          </button>
        ) : (
          <div className='navbar-profile'>

            <img src={assets.profile_icon} alt="" />

            <ul className="nav-profile-dropdown">

              <li onClick={()=>navigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>

              <hr />

              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>

            </ul>

          </div>
        )}

      </div>

    </div>
  );
};

export default Navbar;