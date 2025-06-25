// import React, { useState } from "react";
// import "./coordinator.css";
// import coordinator from './assets/coordinator.png';

// const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzUUFKAP0cDxUBOnoiyJFvZHksY3DXOMM9sOUrbuclGDfEi7QhfacPGLkB38EE5SRa6/exec";

// const CoordinatorPage = () => {
//   const [data, setData] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalHeading, setModalHeading] = useState("");

//   const fetchData = async () => {
//     try {
//       const response = await fetch(SHEET_API_URL);
//       const jsonData = await response.json();
//       setData(jsonData);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setData([]);
//     }
//   };

//   const CDC = async () => {
//     try {
//       const response = await fetch(SHEET_API_URL);
//       const jsonData = await response.json();
//       displayCDC(jsonData);
//     } catch (error) {
//       console.error("Error fetching CDC data:", error);
//       setData([]);
//     }
//   };

//   const displayCDC = (data) => {
//     if (!data || data.length === 0) {
//       setData([]);
//       return;
//     }

//     let headers = data[0];
//     let records = data.slice(1);
//     let internshipTypeIndex = headers.indexOf("placement-source");

//     if (internshipTypeIndex === -1) {
//       setData([]);
//       return;
//     }

//     let filteredRecords = records.filter(row => row[internshipTypeIndex] === "Through College");

//     if (filteredRecords.length === 0) {
//       setData([]);
//       return;
//     }

//     setData([headers, ...filteredRecords]);
//     setIsModalOpen(true);
//   };

//   const noncdc = async () => {
//     try {
//       const response = await fetch(SHEET_API_URL);
//       const jsonData = await response.json();
//       displayNonCDC(jsonData);
//     } catch (error) {
//       console.error("Error fetching Non-CDC data:", error);
//       setData([]);
//     }
//   };

//   const displayNonCDC = (data) => {
//     if (!data || data.length === 0) {
//       setData([]);
//       return;
//     }

//     let headers = data[0];
//     let records = data.slice(1);
//     let internshipTypeIndex = headers.indexOf("placement-source");

//     if (internshipTypeIndex === -1) {
//       setData([]);
//       return;
//     }

//     let filteredRecords = records.filter(row => row[internshipTypeIndex] === "Off-Campus");

//     if (filteredRecords.length === 0) {
//       setData([]);
//       return;
//     }

//     setData([headers, ...filteredRecords]);
//     setIsModalOpen(true);
//   };

//   const noInternship = async () => {
//     try {
//       const response = await fetch(SHEET_API_URL);
//       const jsonData = await response.json();
//       displayNoInternship(jsonData);
//     } catch (error) {
//       console.error("Error fetching No Internship data:", error);
//       setData([]);
//     }
//   };

//   const displayNoInternship = (data) => {
//     if (!data || data.length === 0) {
//       setData([]);
//       return;
//     }

//     let headers = data[0];
//     let records = data.slice(1);
//     let internshipTypeIndex = headers.indexOf("obtained-internship");

//     if (internshipTypeIndex === -1) {
//       setData([]);
//       return;
//     }

//     let filteredRecords = records.filter(row => row[internshipTypeIndex] === "No");

//     if (filteredRecords.length === 0) {
//       setData([]);
//       return;
//     }

//     setData([headers, ...filteredRecords]);
//     setIsModalOpen(true);
//   };

//   const applyFilter = async (filterType) => {
//     try {
//       const response = await fetch(SHEET_API_URL);
//       const jsonData = await response.json();
//       filterData(jsonData, filterType);
//     } catch (error) {
//       console.error("Error fetching filtered data:", error);
//       setData([]);
//     }
//   };

//   const filterData = (data, filterType) => {
//     if (!data || data.length === 0) {
//       setData([]);
//       return;
//     }

//     let headers = data[0];
//     let records = data.slice(1);
//     let filterIndex = -1;
//     let filterValue = "";

//     switch (filterType) {
//       case 'research':
//         filterIndex = headers.indexOf("internship-type");
//         filterValue = "Research";
//         break;
//       case 'industry':
//         filterIndex = headers.indexOf("internship-type");
//         filterValue = "Industrial";
//         break;
//       case 'abroad':
//         filterIndex = headers.indexOf("location");
//         filterValue = "Abroad";
//         break;
//       case 'india':
//         filterIndex = headers.indexOf("location");
//         filterValue = "India";
//         break;
//       default:
//         setData([]);
//         return;
//     }

//     if (filterIndex === -1) {
//       setData([]);
//       return;
//     }

//     let filteredRecords = records.filter(row => row[filterIndex] === filterValue);

//     if (filteredRecords.length === 0) {
//       setData([]);
//       return;
//     }

//     setData([headers, ...filteredRecords]);
//     setIsModalOpen(true);
//   };

//   const filterByPeriod = async () => {
//     try {
//       const response = await fetch(SHEET_API_URL);
//       const jsonData = await response.json();
//       if (!jsonData || jsonData.length === 0) {
//         setData([]);
//         return;
//       }

//       let headers = jsonData[0];
//       let records = jsonData.slice(1);
//       let periodIndex = headers.indexOf("period");
      
//       if (periodIndex === -1) {
//         setData([]);
//         return;
//       }

//       let grouped = { "1 Month": [], "2 Months": [], "6 Months": [] };
//       records.forEach(row => {
//         let duration = parseInt(row[periodIndex]);
//         if (duration === 1) grouped["1 Month"].push(row);
//         else if (duration === 2) grouped["2 Months"].push(row);
//         else if (duration === 6) grouped["6 Months"].push(row);
//       });

//       let groupedData = [];
//       for (let period in grouped) {
//         if (grouped[period].length > 0) {
//           groupedData.push([period]);
//           groupedData.push(...grouped[period]);
//         }
//       }

//       setData([headers, ...groupedData]);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching period data:", error);
//       setData([]);
//     }
//   };

//   const filterByCompany = async () => {
//     try {
//       const response = await fetch(SHEET_API_URL);
//       const jsonData = await response.json();
//       if (!jsonData || jsonData.length === 0) {
//         setData([]);
//         return;
//       }

//       let headers = jsonData[0];
//       let records = jsonData.slice(1);
//       let companyIndex = headers.indexOf("company-name");
      
//       if (companyIndex === -1) {
//         setData([]);
//         return;
//       }

//       let grouped = {};
//       records.forEach(row => {
//         let company = row[companyIndex];
//         if (!company) return;
//         if (!grouped[company]) grouped[company] = [];
//         grouped[company].push(row);
//       });

//       let groupedData = [];
//       for (let company in grouped) {
//         groupedData.push([company]);
//         groupedData.push(...grouped[company]);
//       }

//       setData([headers, ...groupedData]);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching company data:", error);
//       setData([]);
//     }
//   };

//   const filterByStipend = async () => {
//     try {
//       const response = await fetch(SHEET_API_URL);
//       const jsonData = await response.json();
//       if (!jsonData || jsonData.length === 0) {
//         setData([]);
//         return;
//       }

//       let headers = jsonData[0];
//       let records = jsonData.slice(1);
//       let stipendIndex = headers.indexOf("stipend");

//       if (stipendIndex === -1) {
//         setData([]);
//         return;
//       }

//       let filteredRecords = records.filter(row => {
//         if (!row[stipendIndex]) return false;
//         let stipendValue = String(row[stipendIndex]).replace(/[^0-9.]/g, "");
//         let stipend = parseFloat(stipendValue) || 0;
//         return stipend > 100000;
//       });

//       setData([headers, ...filteredRecords]);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching stipend data:", error);
//       setData([]);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const renderTable = () => {
//     if (!data || data.length === 0) {
//       return <p>No data available.</p>;
//     }

//     return (
//       <table border="1" cellSpacing="0" cellPadding="5">
//         <thead>
//           <tr>
//             {data[0].map((header, index) => (
//               <th key={index}>{header}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.slice(1).map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {row.map((cell, cellIndex) => (
//                 <td key={cellIndex}>{cell}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };

//   return (
//     <div>
//       <div className="top">
//       <div className="container">
//         <h2>INTERNSHIP RECORDS</h2><br></br><br></br>
        
//         <div className="filter-buttons">
//             <div className="column">
//                 <button onClick={() => { setModalHeading("Students Got Internship Through CDC"); CDC(); }}>Students Got Internship Through CDC</button>
//                 <button onClick={() => { setModalHeading("Students Got Internship Through Non-CDC"); noncdc(); }}>Students Got Internship Not Through CDC</button>
//                 <button onClick={() => { setModalHeading("Students who didn't get internship"); noInternship(); }}>Students who didn't get internship</button>
//                 <button onClick={() => { setModalHeading("Research Internships"); applyFilter('research'); }}>Research Internships</button>
//                 <button onClick={() => { setModalHeading("Industrial Internships"); applyFilter('industry'); }}>Industrial Internships</button>
//             </div>
//             <div className="column">
//                 <button onClick={() => { setModalHeading("Internships by Period"); filterByPeriod(); }}>Internships by Period</button>
//                 <button onClick={() => { setModalHeading("Company-wise List"); filterByCompany(); }}>Company-wise List</button>
//                 <button onClick={() => { setModalHeading("Stipend More Than 1 Lakh"); filterByStipend(); }}>Stipend More Than 1 Lakh</button>
//                 <button onClick={() => { setModalHeading("Internships Completed Abroad"); applyFilter('abroad'); }}>Internships Completed Abroad</button>
//                 <button onClick={() => { setModalHeading("Internships Completed in India"); applyFilter('india'); }}>Internships Completed in India</button>
//             </div>
//             {/* Centered Display All Records button */}
//             <div className="centered-button">
//                 <button onClick={fetchData}>
//                     <strong>Display All Records</strong>
//                 </button>
//             </div>
//         </div>
//     </div>

//     {/* <img src={coordinator} alt="Coordinator" /> */}
//       </div>

//       {isModalOpen && (
//         <div className="modal">
//           <span className="close" onClick={closeModal}>
//             &times;
//           </span>
//           <h3>{modalHeading}</h3>
//           <div id="jsonData">{renderTable()}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CoordinatorPage;


import React, { useState } from "react";
import "./coordinator.css";
import coordinator from './assets/coordinator.png';

const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzUUFKAP0cDxUBOnoiyJFvZHksY3DXOMM9sOUrbuclGDfEi7QhfacPGLkB38EE5SRa6/exec";

const CoordinatorPage = () => {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalHeading, setModalHeading] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(SHEET_API_URL);
      const jsonData = await response.json();
      setData(jsonData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  const CDC = async () => {
    try {
      const response = await fetch(SHEET_API_URL);
      const jsonData = await response.json();
      displayCDC(jsonData);
    } catch (error) {
      console.error("Error fetching CDC data:", error);
      setData([]);
    }
  };

  const displayCDC = (data) => {
    if (!data || data.length === 0) {
      setData([]);
      return;
    }

    let headers = data[0];
    let records = data.slice(1);
    let internshipTypeIndex = headers.indexOf("placement-source");

    if (internshipTypeIndex === -1) {
      setData([]);
      return;
    }

    let filteredRecords = records.filter(row => row[internshipTypeIndex] === "Through College");

    if (filteredRecords.length === 0) {
      setData([]);
      return;
    }

    setData([headers, ...filteredRecords]);
    setIsModalOpen(true);
  };

  const noncdc = async () => {
    try {
      const response = await fetch(SHEET_API_URL);
      const jsonData = await response.json();
      displayNonCDC(jsonData);
    } catch (error) {
      console.error("Error fetching Non-CDC data:", error);
      setData([]);
    }
  };

  const displayNonCDC = (data) => {
    if (!data || data.length === 0) {
      setData([]);
      return;
    }

    let headers = data[0];
    let records = data.slice(1);
    let internshipTypeIndex = headers.indexOf("placement-source");

    if (internshipTypeIndex === -1) {
      setData([]);
      return;
    }

    let filteredRecords = records.filter(row => row[internshipTypeIndex] === "Off-Campus");

    if (filteredRecords.length === 0) {
      setData([]);
      return;
    }

    setData([headers, ...filteredRecords]);
    setIsModalOpen(true);
  };

  const noInternship = async () => {
    try {
      const response = await fetch(SHEET_API_URL);
      const jsonData = await response.json();
      displayNoInternship(jsonData);
    } catch (error) {
      console.error("Error fetching No Internship data:", error);
      setData([]);
    }
  };

  const displayNoInternship = (data) => {
    if (!data || data.length === 0) {
      setData([]);
      return;
    }

    let headers = data[0];
    let records = data.slice(1);
    let internshipTypeIndex = headers.indexOf("obtained-internship");

    if (internshipTypeIndex === -1) {
      setData([]);
      return;
    }

    let filteredRecords = records.filter(row => row[internshipTypeIndex] === "No");

    if (filteredRecords.length === 0) {
      setData([]);
      return;
    }

    setData([headers, ...filteredRecords]);
    setIsModalOpen(true);
  };

  const applyFilter = async (filterType) => {
    try {
      const response = await fetch(SHEET_API_URL);
      const jsonData = await response.json();
      filterData(jsonData, filterType);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setData([]);
    }
  };

  const filterData = (data, filterType) => {
    if (!data || data.length === 0) {
      setData([]);
      return;
    }

    let headers = data[0];
    let records = data.slice(1);
    let filterIndex = -1;
    let filterValue = "";

    switch (filterType) {
      case 'research':
        filterIndex = headers.indexOf("internship-type");
        filterValue = "Research";
        break;
      case 'industry':
        filterIndex = headers.indexOf("internship-type");
        filterValue = "Industrial";
        break;
      case 'abroad':
        filterIndex = headers.indexOf("location");
        filterValue = "Abroad";
        break;
      case 'india':
        filterIndex = headers.indexOf("location");
        filterValue = "India";
        break;
      default:
        setData([]);
        return;
    }

    if (filterIndex === -1) {
      setData([]);
      return;
    }

    let filteredRecords = records.filter(row => row[filterIndex] === filterValue);

    if (filteredRecords.length === 0) {
      setData([]);
      return;
    }

    setData([headers, ...filteredRecords]);
    setIsModalOpen(true);
  };

  const filterByPeriod = async () => {
    try {
      const response = await fetch(SHEET_API_URL);
      const jsonData = await response.json();
      if (!jsonData || jsonData.length === 0) {
        setData([]);
        return;
      }

      let headers = jsonData[0];
      let records = jsonData.slice(1);
      let periodIndex = headers.indexOf("period");
      
      if (periodIndex === -1) {
        setData([]);
        return;
      }

      let grouped = { "1 Month": [], "2 Months": [], "6 Months": [] };
      records.forEach(row => {
        let duration = parseInt(row[periodIndex]);
        if (duration === 1) grouped["1 Month"].push(row);
        else if (duration === 2) grouped["2 Months"].push(row);
        else if (duration === 6) grouped["6 Months"].push(row);
      });

      let groupedData = [];
      for (let period in grouped) {
        if (grouped[period].length > 0) {
          groupedData.push([period]);
          groupedData.push(...grouped[period]);
        }
      }

      setData([headers, ...groupedData]);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching period data:", error);
      setData([]);
    }
  };

  const filterByCompany = async () => {
    try {
      const response = await fetch(SHEET_API_URL);
      const jsonData = await response.json();
      if (!jsonData || jsonData.length === 0) {
        setData([]);
        return;
      }

      let headers = jsonData[0];
      let records = jsonData.slice(1);
      let companyIndex = headers.indexOf("company-name");
      
      if (companyIndex === -1) {
        setData([]);
        return;
      }

      let grouped = {};
      records.forEach(row => {
        let company = row[companyIndex];
        if (!company) return;
        if (!grouped[company]) grouped[company] = [];
        grouped[company].push(row);
      });

      let groupedData = [];
      for (let company in grouped) {
        groupedData.push([company]);
        groupedData.push(...grouped[company]);
      }

      setData([headers, ...groupedData]);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching company data:", error);
      setData([]);
    }
  };

  const filterByStipend = async () => {
    try {
      const response = await fetch(SHEET_API_URL);
      const jsonData = await response.json();
      if (!jsonData || jsonData.length === 0) {
        setData([]);
        return;
      }

      let headers = jsonData[0];
      let records = jsonData.slice(1);
      let stipendIndex = headers.indexOf("stipend");

      if (stipendIndex === -1) {
        setData([]);
        return;
      }

      let filteredRecords = records.filter(row => {
        if (!row[stipendIndex]) return false;
        let stipendValue = String(row[stipendIndex]).replace(/[^0-9.]/g, "");
        let stipend = parseFloat(stipendValue) || 0;
        return stipend > 100000;
      });

      setData([headers, ...filteredRecords]);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching stipend data:", error);
      setData([]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderTable = () => {
    if (!data || data.length === 0) {
      return <p>No data available.</p>;
    }

    return (
      <table border="1" cellSpacing="0" cellPadding="5">
        <thead>
          <tr>
            {data[0].map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <div className="top-bar">
      <h2 style={{ textAlign: 'center' }}>INTERNSHIP RECORDS</h2><br /><br />
        <div className="button-row">
          <button onClick={() => { setModalHeading("Students Got Internship Through CDC"); CDC(); }}>Students Got Internship Through CDC</button>
          <button onClick={() => { setModalHeading("Students Got Internship Not Through CDC"); noncdc(); }}>Students Got Internship Not Through CDC</button>
          <button onClick={() => { setModalHeading("Students who didn't get internship"); noInternship(); }}>Students who didn't get internship</button>
          <button onClick={() => { setModalHeading("Research Internships"); applyFilter('research'); }}>Research Internships</button>
          <button onClick={() => { setModalHeading("Industrial Internships"); applyFilter('industry'); }}>Industrial Internships</button>
        </div><br></br>
        <div className="button-row">
          <button onClick={() => { setModalHeading("Internships by Period"); filterByPeriod(); }}>Internships by Period</button>
          <button onClick={() => { setModalHeading("Company-wise List"); filterByCompany(); }}>Company-wise List</button>
          <button onClick={() => { setModalHeading("Stipend More Than 1 Lakh"); filterByStipend(); }}>Stipend More Than 1 Lakh</button>
          <button onClick={() => { setModalHeading("Internships Completed Abroad"); applyFilter('abroad'); }}>Internships Completed Abroad</button>
          <button onClick={() => { setModalHeading("Internships Completed in India"); applyFilter('india'); }}>Internships Completed in India</button>
          <button onClick={fetchData}><strong>Display All Records</strong></button>
        </div><br></br>
      </div><br></br>
      <div className="data-display">
        {modalHeading && <h3><center>{modalHeading}</center></h3>}
        <div className="table-container">
          {renderTable()}
        </div>
      </div>
    </div>
  
    
  );
};

export default CoordinatorPage;