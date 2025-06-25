import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logo from './assets/logo.png'; 
import girlImage from './assets/girl.webp';

const Login = () => {
  const [isCoordinatorLogin, setIsCoordinatorLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isToastSuccess, setIsToastSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const showToast = (message, isSuccess) => {
    setToastMessage(message);
    setIsToastSuccess(isSuccess);
    setTimeout(() => {
      setToastMessage("");
    }, 2000);
  };

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     if (isCoordinatorLogin) {
//         if (username === "npr" && password === "npr@ip") {
//             showToast("Login successful! Redirecting...", true);
//             setTimeout(() => {
//                 navigate("/coordinator");
//             }, 1500);
//         } else {
//             showToast("Invalid username or password!", false);
//         }
//     } else {
//         try {
//             let response = await fetch(
//                 `https://script.google.com/macros/s/AKfycbyBnI7D_4jOouMy6Eq3HtMLrWww5lCPwDCh2xeAl7y5uQ6LCcOsMlQBQefQqcoIuYeJ/exec?action=search&registerNo=${password}`
//             );

//             let jsonData = await response.json();

//             // Ensure the API response is correct
//             if (jsonData.status !== "success" || !jsonData.data) {
//                 throw new Error("Invalid API response");
//             }

//             let userDetails = jsonData.data; // Array of values

//             if (!userDetails || userDetails.length < 2) {
//                 showToast("Invalid Register Number!", false);
//                 return;
//             }

//             // Convert array to object for better usability
//             let userObject = {
//                 registerNo: userDetails[0],
//                 name: userDetails[1],
//                 title: userDetails[2],
//                 mobileNo: userDetails[3],
//                 section: userDetails[4],
//                 obtainedInternship: userDetails[5],
//                 period: userDetails[6],
//                 startDate: userDetails[7],
//                 endDate: userDetails[8],
//                 company: userDetails[9],
//                 placementThrough: userDetails[10],
//                 stipend: userDetails[11],
//                 researchOrIndustry: userDetails[12],
//                 abroadOrIndia: userDetails[13],
//                 fileUrl: userDetails[14]
//             };

//             console.log("Login", userObject);

//             // Check if username matches
//             if (userObject.name === username) {
//                 showToast("Login successful! Redirecting...", true);
//                 setTimeout(() => {
//                     navigate("/profile", { state: { user: userObject } }); // Passing user details
//                 }, 1500);
//             } else {
//                 showToast("Invalid Name or Register Number!", false);
//             }

//         } catch (error) {
//             console.error("Error fetching student data:", error);
//             showToast("Server error, please try again!", false);
//         }
//     }
// };
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          registerNo: password,  // Register Number as password
          isCoordinator: isCoordinatorLogin
        })
      });

      const data = await response.json();

      if (!data.success) {
        showToast(data.message || "Login failed!", false);
      } else {
        showToast("Login successful! Redirecting...", true);

        const path = isCoordinatorLogin ? "/coordinator" : "/profile";
        setTimeout(() => {
          navigate(path, { state: { user: data.user } });
        }, 1500);
      }
    } catch (err) {
      console.error("Login Error:", err);
      showToast("Server error, please try again!", false);
    }
  };


  return (
    <div>
      {loading ? (
        <div className="loading-screen">
          <img src={logo} alt="InternTrack Logo" style={{ width: "600px" }} />
        </div>
      ) : (
        <div className="f">
          {/* <img src={girlImage} alt="Girl Illustration" style={{ width: "200px", height: "300px" }} /> */}
          <div className="container">
          <img src={logo} alt="InternTrack Logo" style={{ height: "100px", width: "auto" }}/>
            <div className="tabs">
              <span className={`tab ${!isCoordinatorLogin ? "active" : ""}`} onClick={() => setIsCoordinatorLogin(false)}>
                Student Login
              </span>
              <span className={`tab ${isCoordinatorLogin ? "active" : ""}`} onClick={() => setIsCoordinatorLogin(true)}>
                Coordinator Login
              </span>
            </div>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Name" required value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="password" placeholder="Register Number" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className="login-btn">Login</button>
            </form>
          </div>
        </div>
      )}
      {toastMessage && (
        <div className={`toast show ${isToastSuccess ? "success" : "error"}`}>{toastMessage}</div>
      )}
    </div>
  );
};

export default Login;
