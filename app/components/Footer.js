import React, { useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Footer() {
  const today = new Date();
  let currYear = today.getFullYear();

  return (
    <footer className="bg-black p-4 mt-4">
      <div className="container px-1 flex flex-row justify-between">
        <h6 className="text-sm text-left text-white">
         &copy; {currYear} Rhema Marneni
        </h6>
        <h6 className="text-sm text-white flex flex-row gap-2">
          <a
            href="https://github.com/rhemaMarneni/Pantry-Tracker-App" // project link
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <GitHubIcon />
            <span>GitHub</span>
          </a>
        </h6>
      </div>
    </footer>
  );
}
