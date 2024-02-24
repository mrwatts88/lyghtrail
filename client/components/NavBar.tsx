import { SignOutButton } from "@clerk/clerk-react";
import React from "react";
import { NavLink } from "react-router-dom";

export const NavBar = (): React.ReactElement => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div>
        <NavLink
          style={({ isActive }) => ({
            color: isActive ? "black" : "gray",
            marginRight: "10px",
          })}
          to="/"
        >
          Due Tasks
        </NavLink>
        <NavLink
          style={({ isActive }) => ({
            color: isActive ? "black" : "gray",
          })}
          to="/settings"
        >
          Settings
        </NavLink>
      </div>
      <SignOutButton />
    </div>
  );
};
