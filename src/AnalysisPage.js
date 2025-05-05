import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {BarChart,Bar,XAxis,YAxis,Tooltip,Legend,ResponsiveContainer,} from "recharts";
import "./Analysis.css";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";



const Header = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    const activeAccount = accounts[0];
    if (activeAccount) {
      setUserInfo({
        name: activeAccount.name || "User",
        email: activeAccount.username || "",
      });
    } else {
      console.warn("No active account found.");
    }
  }, [accounts]);

  const handleLogout = () => {
    localStorage.removeItem("access_token"); 
    instance.logoutRedirect().then(() => {
      navigate("/login");
    });
  };

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`; // pastel-like color
    return color;
  };
  
  const Avatar = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : "?";
    const backgroundColor = stringToColor(name || "default");
  
    return (
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor,
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
        title={name}
      >
        {initial}
      </div>
    );
  };
  

  return (
    <header className="header-bar">
      <div className="header-logo">
        <img src="/Group.jpg" alt="Logo" className="logo-image" />
      </div>
  
      <div className="header-profile" style={{ display: "flex", alignItems: "center" }}>
        <Avatar name={userInfo.name} />
          <div style={{ marginLeft: "10px", textAlign: "left" }}>
          <div style={{ fontWeight: "bold" }}>{userInfo.name}</div>
          <div style={{ fontSize: "12px", color: "#555" }}>{userInfo.email}</div>
        </div>
          <button onClick={handleLogout} className="logoutb" title="Logout" style={{ marginLeft: "15px" }}>
          <svg
            fill="none"
            height="24"
            width="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 16L21 12M21 12L17 8M21 12L7 12M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );  
};

const AnalysisPage = () => {
  const location = useLocation();
  const { data, categories } = location.state || {};
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [positiveCount, setPositiveCount] = useState(0);
  const [negativeCount, setNegativeCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (data && categories) {
      let posCount = 0;
      let negCount = 0;
      const categoryMap = {};
  
      data.forEach(([category, sentiment]) => {
        const cat = category?.trim();
        const sent = sentiment?.toLowerCase().trim();
  
        if (!categoryMap[cat]) {
          categoryMap[cat] = { category: cat, positive: 0, negative: 0 };
        }
  
        if (sent === "positive") {
          categoryMap[cat].positive++;
          posCount++;
        } else if (sent === "negative") {
          categoryMap[cat].negative++;
          negCount++;
        }
      });
  
      setAnalysis(data);
      setCategoryData(Object.values(categoryMap));
      setPositiveCount(posCount);
      setNegativeCount(negCount);
      setLoading(false);
    } else {
      setErrorMsg("Missing data or categories.");
      setLoading(false);
    }
  }, [data, categories]);
  

  return (
    <div className="analysis-container">
      <Header />

      <main className="analysis-content">
        <h2 className="analysis-head">Analysis Results</h2>

        {loading ? (
          <p>Loading analysis...</p>
        ) : errorMsg ? (
          <p className="error-message">{errorMsg}</p>
        ) : (
          <>
            <div className="dashboard-container">
              <div className="dashboard">
                <div className="stats">
                  <h3>Total Reviews</h3>
                  <p>Positive: {positiveCount}</p>
                  <p>Negative: {negativeCount}</p>
                </div>

                <div className="chart">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[{ name: "Overall", Positive: positiveCount, Negative: negativeCount }]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Positive" fill="#4CAF50" />
                      <Bar dataKey="Negative" fill="#F44336" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="category-charts-container">
                <div className="category-charts">
                  {categoryData.map((data, index) => (
                    <div key={index} className="category-chart">
                      <h3>{data.category}</h3>
                      <ResponsiveContainer width={250} height={250}>
                        <BarChart data={[data]}>
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="positive" fill="#4CAF50" />
                          <Bar dataKey="negative" fill="#F44336" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="analysis-table">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Sentiment</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.length > 0 ? (
                    analysis.map((row, index) => (
                      <tr key={index}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                        <td>{row[2]}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No analysis results available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AnalysisPage;
