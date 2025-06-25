import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 
import "./profile.css";
import boy from './assets/boy.png'; 
import userImage from './assets/User.png';
import FormComponent from "./InternshipForm"; // Import the form
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // useEffect(() => {
  //   if (location.state && location.state.user) {
  //     setProfileData(location.state.user);
  //   }
  // }, [location]);


  // const handleEditClick = () => {
  //   navigate("/edit", { state: { user: profileData } }); // Navigate with data
  // };

  // const handleCloseForm = () => {
  //   setIsEditing(false); // Close form and return to profile
  // };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (location.state && location.state.user && location.state.user.registerNo) {
          const registerNo = location.state.user.registerNo;
          const response = await fetch(
            `https://script.google.com/macros/s/AKfycbyBnI7D_4jOouMy6Eq3HtMLrWww5lCPwDCh2xeAl7y5uQ6LCcOsMlQBQefQqcoIuYeJ/exec?action=search&registerNo=${registerNo}`
          );
          const jsonData = await response.json();

          if (jsonData.status === "success" && jsonData.data) {
            const userDetails = jsonData.data;
            const userObject = {
              registerNo: userDetails[0],
              name: userDetails[1],
              title: userDetails[2],
              mobileNo: userDetails[3],
              section: userDetails[4],
              obtainedInternship: userDetails[5],
              period: userDetails[6],
              startDate: userDetails[7],
              endDate: userDetails[8],
              company: userDetails[9],
              placementThrough: userDetails[10],
              stipend: userDetails[11],
              researchOrIndustry: userDetails[12],
              abroadOrIndia: userDetails[13],
              fileUrl: userDetails[14]
            };
            setProfileData(userObject);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [location]);

  const handleEditClick = () => setIsEditing(true);
  const handleCloseForm = () => setIsEditing(false);

  
  return (
    <div className="top-profile">
      <img src={boy} alt="Boy" className="animated-img"  />
      <div className={`container-profile ${isProfileOpen ? "slide-left" : ""}`}>

        {!isEditing ? (
          <>
            {!isProfileOpen && (
            <div className="profile-card">
              <img src={userImage} alt="Profile"/>
              <h1>{profileData ? profileData.name : "Loading..."}</h1>
              <p>{profileData ? `Reg No: ${profileData.registerNo}` : "Loading..."}</p>
              <div className="menu">
                <button onClick={() => setIsProfileOpen(true)}>My Profile</button>
              </div>
            </div>
            )}

            {isProfileOpen && profileData && (
              <div className={`profile-details ${profileData ? "open" : ""}`}>
                <span className="close-btn" onClick={() => setIsProfileOpen(false)}>&times;</span>
                <h2>Profile Details</h2>

                <div className="details-container">
                  <div className="detail"><strong>Register Number</strong> <span>{profileData.registerNo}</span></div>
                  <div className="detail"><strong>Name</strong> <span>{profileData.name}</span></div>
                  <div className="detail"><strong>Title</strong> <span>{profileData.title}</span></div>
                  <div className="detail"><strong>Mobile No.</strong> <span>{profileData.mobileNo}</span></div>
                  <div className="detail"><strong>Section</strong> <span>{profileData.section}</span></div>
                  <div className="detail"><strong>Internship Status</strong> <span>{profileData.obtainedInternship}</span></div>
                  <div className="detail"><strong>Period</strong> <span>{profileData.period}</span></div>
                  <div className="detail"><strong>Start Date</strong> <span>{profileData.startDate}</span></div>
                  <div className="detail"><strong>End Date</strong> <span>{profileData.endDate}</span></div>
                  <div className="detail"><strong>Company Name</strong> <span>{profileData.company}</span></div>
                  <div className="detail"><strong>Placement Through</strong> <span>{profileData.placementThrough}</span></div>
                  <div className="detail"><strong>Stipend</strong> <span>{profileData.stipend}</span></div>
                  <div className="detail"><strong>Research or Industry</strong> <span>{profileData.researchOrIndustry}</span></div>
                  <div className="detail"><strong>Abroad or India</strong> <span>{profileData.abroadOrIndia}</span></div>
                  {profileData.fileUrl && (
                    <div className="detail">
                      <strong>File</strong> 
                      <a href={profileData.fileUrl} target="_blank" rel="noopener noreferrer">View Document</a>
                    </div>
                  )}
                </div><br></br>

                {/* Edit Button to Open Form */}
                <div className="edit-button-container">
                  <button 
                    onClick={handleEditClick} 
                    className="edit-btn"
                    style={{ height: "30px", width: "70px", fontSize: "12px" }}>
                    Edit
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Render FormComponent when Editing
          <FormComponent initialData={profileData} onClose={handleCloseForm} />
        )}
      </div>
    </div>
  );
};

export default Profile;
