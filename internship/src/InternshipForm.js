import React, { useState, useEffect } from 'react';
import "./InternshipForm.css";
import { useLocation } from "react-router-dom";

const InternshipForm = () => {
    const location = useLocation();
    const initialData = location.state?.user || {};
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwv8wus6zQYuCp60DZ-DvUWWeSCgqvyRyJf9sXNDwGHVYYQkjyXIYW4QJKOo7U7cxJA/exec';
    const validationURL = 'http://localhost:8000/validate/';

    const [formData, setFormData] = useState({
      registerNo: '', name: '', mobileNo: '', section: '', obtainedInternship: '', title: '',
      period: '', startDate: '', endDate: '', company: '', placementThrough: 'Through College',
      stipend: '', researchOrIndustry: 'Research', abroadOrIndia: 'India', offerLetter: null,
      ...initialData  
  });
    
    const [validationMessage, setValidationMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
          setFormData(initialData);
        }
      }, [initialData]);

    useEffect(() => {
      if (formData?.registerNo && formData.registerNo.length === 13) {
            fetch(`${scriptURL}?registerNo=${formData.registerNo}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success' && data.rows.length > 0) {
                        const values = data.rows[0];
                        setFormData(prev => ({
                            ...prev,
                            name: values[1] || '',
                            mobileNo: values[3] || '',
                            section: values[4] || '',
                            obtainedInternship: values[5] || '',
                            title: values[2] || '',
                            period: values[6] || '',
                            startDate: values[7] || '',
                            endDate: values[8] || '',
                            company: values[9] || '',
                            placementThrough: values[10] || 'Through College',
                            stipend: values[11] || '',
                            researchOrIndustry: values[12] || 'Research',
                            abroadOrIndia: values[13] || 'India'
                        }));
                    }
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [formData.registerNo]);

    const handleChange = (e) => {
        const { name, type, files, value } = e.target;
    
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };
    
    

    const handleSubmit = async (e) => {
        console.log("Form Data Before Submit:", formData);

        e.preventDefault();
        setLoading(true);

        if (formData.offerLetter && formData.offerLetter.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            setLoading(false);
            return;
        }

        try {
            const validateFormData = new FormData();
            validateFormData.append("register_number", formData.registerNo);
            validateFormData.append("name", formData.name);
            validateFormData.append("mobile_number", formData.mobileNo);
            validateFormData.append("internship", formData.title);
            validateFormData.append("internship_obtained", formData.obtainedInternship);
            validateFormData.append("internship_place", formData.abroadOrIndia);
            validateFormData.append("start_date", formData.startDate);
            validateFormData.append("end_date", formData.endDate);
            validateFormData.append("company_name", formData.company);
            validateFormData.append("stipend", formData.stipend || "");
            validateFormData.append("permission_letter", formData.offerLetter); // FILE UPLOAD

            const validationResponse = await fetch(validationURL, {
                method: "POST",
                body: validateFormData
            });


            const validationResult = await validationResponse.json();
            setValidationMessage(validationResult.message);
            if (validationResult.status === 'error') {
                setLoading(false);
                return;
            }

            const googleFormData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                googleFormData.append(key, value);
            });

            // Convert File to Base64 ONLY when sending to Google Sheets
            if (formData.offerLetter) {
                const base64File = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);  // Remove data URL prefix
                    reader.readAsDataURL(formData.offerLetter);
                });

                googleFormData.append('fileName', formData.offerLetter.name);
                googleFormData.append('mimeType', formData.offerLetter.type);
                googleFormData.append('fileData', base64File);
            }

            // Debugging: Check if fileData is correctly added
            console.log("Sending Google FormData:");
            for (let pair of googleFormData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await fetch(scriptURL, {
                method: 'POST',
                body: googleFormData
            });



            const result = await response.json();
            setLoading(false);
            if (result.status === 'success') {
                alert('Form submitted successfully!');
                setFormData({
                    registerNo: '', name: '', mobileNo: '', section: '', obtainedInternship: '', title: '',
                    period: '', startDate: '', endDate: '', company: '', placementThrough: 'Through College',
                    stipend: '', researchOrIndustry: 'Research', abroadOrIndia: 'India', offerLetter: null
                });
                setValidationMessage('');
            } else {
                alert('Submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            alert('Error submitting form');
        }
    };

    return (
        <div className="container-form" style={{ maxHeight: '90vh', width: '1200px', overflowY: 'auto', padding: '20px', border: '1px solid #ccc' }}>
          <h2>Internship Details Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Register Number*:</label>
              <input type="text" name="registerNo" value={formData.registerNo} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Name*:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Mobile Number*:</label>
              <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Section*:</label>
              <input type="text" name="section" value={formData.section} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Obtained Internship*:</label>
              <select name="obtainedInternship" value={formData.obtainedInternship} onChange={handleChange} required>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Title*:</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Start Date*:</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>End Date*:</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Company Name*:</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Placement through*:</label>
              <select name="placementThrough" value={formData.placementThrough} onChange={handleChange} required>
                <option value="Through College">Through College</option>
                <option value="Off-Campus">Off-Campus</option>
              </select>
            </div>
            <div className="form-group">
              <label>Stipend (in Rs.):</label>
              <input type="number" name="stipend" value={formData.stipend} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label>Upload Offer Letter (PDF)*:</label>
              <input type="file" name="offerLetter" accept="application/pdf" onChange={handleChange} required />
            </div>
            {validationMessage && <p>{validationMessage}</p>}
            {/* {loading && <p>Validating document... Please wait.</p>} */}
            <button type="submit">Submit</button>
          </form>
        </div>
      );
};

export default InternshipForm;
