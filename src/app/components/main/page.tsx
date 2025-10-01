"use client";

import React, { useState, useEffect, useRef } from "react";
import * as htmlToImage from "html-to-image";

type UserData = {
  profileName: string;
  description: string;
  backgroundColor: string;
  textColor: string;
};

type UsersDB = {
  [username: string]: {
    password: string;
    data: UserData;
  };
};

export default function Main() {
  // Auth & user state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Profile data
  const [profileName, setProfileName] = useState("");
  const [description, setDescription] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#247478"); // default text color

  const [loading, setLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // Load users DB from localStorage
  const getUsersDB = (): UsersDB => {
    try {
      const stored = localStorage.getItem("profilo_users");
      if (stored) return JSON.parse(stored);
    } catch {}
    return {};
  };

  // Save users DB to localStorage
  const setUsersDB = (db: UsersDB) => {
    localStorage.setItem("profilo_users", JSON.stringify(db));
  };

  // Save current user's profile data to localStorage
  const saveUserData = (username: string, data: UserData) => {
    const db = getUsersDB();
    if (db[username]) {
      db[username].data = data;
      setUsersDB(db);
    }
  };

  // Load current user's profile data from localStorage
  const loadUserData = (username: string) => {
    const db = getUsersDB();
    if (db[username]) {
      const data = db[username].data;
      setProfileName(data.profileName);
      setDescription(data.description);
      setBackgroundColor(data.backgroundColor);
      setTextColor(data.textColor || "#247478");
    }
  };

  // Handle signup
  const handleSignup = () => {
    setError("");
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }
    const db = getUsersDB();
    if (db[username]) {
      setError("User already exists");
      return;
    }
    db[username] = {
      password,
      data: {
        profileName: "",
        description: "",
        backgroundColor: "#ffffff",
        textColor: "#247478",
      },
    };
    setUsersDB(db);
    setCurrentUser(username);
    setProfileName("");
    setDescription("");
    setBackgroundColor("#ffffff");
    setTextColor("#247478");
    setUsername("");
    setPassword("");
  };

  // Handle login
  const handleLogin = () => {
    setError("");
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }
    const db = getUsersDB();
    if (!db[username]) {
      setError("User does not exist");
      return;
    }
    if (db[username].password !== password) {
      setError("Incorrect password");
      return;
    }
    setCurrentUser(username);
    loadUserData(username);
    setUsername("");
    setPassword("");
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setProfileName("");
    setDescription("");
    setBackgroundColor("#ffffff");
    setTextColor("#247478");
  };

  // Save profile changes automatically when any profile data changes and user is logged in
  useEffect(() => {
    if (currentUser) {
      saveUserData(currentUser, {
        profileName,
        description,
        backgroundColor,
        textColor,
      });
    }
  }, [profileName, description, backgroundColor, textColor, currentUser]);

  const saveCardAsImage = async () => {
    if (!cardRef.current) return;

    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 200)); // wait for styles to apply

      const dataUrl = await htmlToImage.toPng(cardRef.current);

      const link = document.createElement("a");
      link.download = `${profileName || "profile-card"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error saving image:", err);
      alert("Oops, something went wrong while saving the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-24 p-5 px-4 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center mb-20">
          <h1 className="font-bold text-5xl">Profilo</h1>
        </div>

        {!currentUser ? (
          <>
            <div className="flex justify-center mb-10 text-center">
              <h3>
                Create an account or login to save and edit your profile card
                anytime.
              </h3>
            </div>

            <div className="max-w-md mx-auto p-6 border rounded-xl mb-9.5 bg-[#247478] text-white">
              <input
                type="text"
                placeholder="Username"
                className="w-full mb-3 p-2 text-black bg-white border-0.5 rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full mb-3 p-2 text-black bg-white border-0.5 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {error && (
                <p className="text-red-400 mb-3 text-center font-semibold">
                  {error}
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="bg-white text-[#247478] px-4 py-2 rounded font-bold hover:bg-gray-200"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  disabled={loading}
                  className="bg-white text-[#247478] px-4 py-2 rounded font-bold hover:bg-gray-200"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 max-w-md mx-auto">
              <p className="text-lg font-semibold">Logged in as: {currentUser}</p>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>

            <section className="w-full max-w-xl mx-auto flex justify-center items-center">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-[#247478] border border-gray-300 rounded-xl text-center p-6 w-full max-w-md"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-start">
                    <label>Name of your Profile Card:</label>
                    <input
                      type="text"
                      placeholder="Text here"
                      className="bg-white text-black p-2 border rounded-xl w-full"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="flex flex-col items-start">
                    <label>Description:</label>
                    <input
                      type="text"
                      placeholder="Text here"
                      className="bg-white text-black p-2 border rounded-xl w-full"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="flex flex-col items-start">
                    <label>Background Color:</label>
                    <input
                      type="color"
                      className="w-full h-10 rounded-xl border border-gray-300 cursor-pointer"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="flex flex-col items-start">
                    <label>Text Color:</label>
                    <input
                      type="color"
                      className="w-full h-10 rounded-xl border border-gray-300 cursor-pointer"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </form>
            </section>

            {/* Profile Card Preview */}
            <div
              ref={cardRef}
              style={{
                width: "400px", // fixed width for export
                padding: "24px",
                backgroundColor: backgroundColor,
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginTop: "4rem",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                overflow: "visible",
                color: textColor,
              }}
              className="select-text"
            >
              <h2 className="text-3xl font-bold mb-4">{profileName || "Your Name"}</h2>
              <p>{description || "Your description will appear here."}</p>
            </div>

            {/* Save as Image Button with rainbow border */}
            <div className="flex justify-center mt-10">
              <button
                onClick={saveCardAsImage}
                disabled={loading}
                className={`relative px-6 py-3 rounded-xl font-bold text-[#014145] bg-white overflow-hidden cursor-pointer select-none ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-30">
                  {loading ? "Saving..." : "Save"}
                </span>

                {/* Rainbow border */}
                <span className="absolute -inset-3 rounded-xl bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,indigo,violet,red)] animate-spin z-10"></span>

                {/* Inner white background */}
                <span className="absolute inset-[3px] rounded-xl bg-white z-20"></span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
