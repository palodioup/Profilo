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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [profileName, setProfileName] = useState("");
  const [description, setDescription] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#111827");
  const [textColor, setTextColor] = useState("#f3f4f6");
  const [loading, setLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const getUsersDB = (): UsersDB => {
    try {
      const stored = localStorage.getItem("profilo_users");
      if (stored) return JSON.parse(stored);
    } catch {}
    return {};
  };

  const setUsersDB = (db: UsersDB) => {
    localStorage.setItem("profilo_users", JSON.stringify(db));
  };

  const saveUserData = (username: string, data: UserData) => {
    const db = getUsersDB();
    if (db[username]) {
      db[username].data = data;
      setUsersDB(db);
    }
  };

  const loadUserData = (username: string) => {
    const db = getUsersDB();
    if (db[username]) {
      const data = db[username].data;
      setProfileName(data.profileName);
      setDescription(data.description);
      setBackgroundColor(data.backgroundColor);
      setTextColor(data.textColor || "#f3f4f6");
    }
  };

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
        backgroundColor: "#111827",
        textColor: "#f3f4f6",
      },
    };
    setUsersDB(db);
    setCurrentUser(username);
    setUsername("");
    setPassword("");
  };

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

  const handleLogout = () => {
    setCurrentUser(null);
    setProfileName("");
    setDescription("");
    setBackgroundColor("#111827");
    setTextColor("#f3f4f6");
  };

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

      const node = cardRef.current;
      const rect = node.getBoundingClientRect();

      console.log("Card width:", rect.width);
      console.log("Card height:", rect.height);

      // Remove potential transform/overflow issues
      const originalOverflow = node.style.overflow;
      const originalTransform = node.style.transform;

      node.style.overflow = "visible";
      node.style.transform = "none";

      // Small wait to apply styles
      await new Promise((r) => setTimeout(r, 50));

      // Generate PNG with explicit dimensions & pixel ratio for sharpness
      const dataUrl = await htmlToImage.toPng(node, {
        width: rect.width,
        height: rect.height,
        pixelRatio: 2,
        style: {
          overflow: "visible",
          transform: "none",
        },
      });

      node.style.overflow = originalOverflow;
      node.style.transform = originalTransform;

      const link = document.createElement("a");
      link.download = `${profileName || "profile-card"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error saving image:", err);
      alert("Error while saving the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-5xl font-bold mb-16 tracking-wide text-white drop-shadow-xl">
          Profilo
        </h1>

        {!currentUser ? (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-md mx-auto border border-gray-700">
            <h2 className="text-2xl mb-6 text-center font-semibold text-gray-100">
              Welcome
            </h2>

            <input
              type="text"
              placeholder="Username"
              className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            {error && (
              <p className="text-red-400 text-sm mb-4 text-center font-medium">
                {error}
              </p>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-lg font-semibold"
              >
                Login
              </button>
              <button
                onClick={handleSignup}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-lg font-semibold"
              >
                Sign Up
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="max-w-md mx-auto flex justify-between items-center mb-6">
              <p className="text-gray-300 text-md">Logged in as: {currentUser}</p>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-semibold"
              >
                Logout
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-md mx-auto border border-gray-700">
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">
                  Profile Card Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  disabled={loading}
                  className="w-full h-10 p-1 rounded-lg border border-gray-600 bg-gray-900"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">
                  Text Color
                </label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  disabled={loading}
                  className="w-full h-10 p-1 rounded-lg border border-gray-600 bg-gray-900"
                />
              </div>
            </div>
            
            <div className="flex justify-center mt-16">
            <div
              ref={cardRef}
              style={{
                backgroundColor,
                color: textColor,
                width: "320px",
                padding: "24px",
                borderRadius: "16px",
                textAlign: "center",
                boxShadow:
                  "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                border: "1px solid rgba(156, 163, 175, 0.3)",
                overflow: "visible",
              }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>
                {profileName || "Your Name"}
              </h2>
              <p style={{ fontSize: "14px" }}>{description || "Your description"}</p>
            </div>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={saveCardAsImage}
                disabled={loading}
                className={`relative px-6 py-3 font-bold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-pink-500/50 transition-transform duration-300 ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                {loading ? "Saving..." : "Save as Image"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
