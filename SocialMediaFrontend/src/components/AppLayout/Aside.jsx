import React from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

const Aside = () => {
  const user = useSelector(state => state.userSlice);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link to='/' className="brand-link">
        <span className="brand-text font-weight-light">Social Media Project</span>
      </Link>
      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img src={user?.picture} className="img-circle elevation-2" alt="User Image" />
          </div>
          <div className="info">
            <a href="#" className="d-block">{user?.firstName}</a>
          </div>
        </div>
        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <i className="fas fa-search fa-fw" />
              </button>
            </div>
          </div>
        </div>
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-item">
              <NavLink to={'/dashboard'} className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>Panel Principal</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={'/administrator'} className="nav-link">
                <i className="nav-icon fas fa-users" />
                <p>Usuarios</p>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Aside;
