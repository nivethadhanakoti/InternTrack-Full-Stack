from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import pytesseract
from pdf2image import convert_from_bytes
import re
from dateparser import parse
import io

app = FastAPI()
pytesseract.pytesseract.tesseract_cmd = "/opt/homebrew/bin/tesseract"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (You can restrict it later)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

def extract_text_from_pdf(pdf_file: bytes):
    """Extract text from a PDF file using OCR."""
    try:
        images = convert_from_bytes(pdf_file, poppler_path="/opt/homebrew/bin")
        extracted_text = ""
        
        for image in images:
            text = pytesseract.image_to_string(image)
            extracted_text += text + "\n"

        return extracted_text
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        return ""

def extract_dates(text):
    """Extract and normalize dates from OCR text."""
    date_patterns = [
        r"\b\d{1,2} [A-Za-z]+ \d{4}\b",  # 16 June 2025
        r"\b[A-Za-z]+ \d{1,2},? \d{4}\b", # June 16, 2025
        r"\b\d{1,2}/\d{1,2}/\d{4}\b",    # 16/06/2025
        r"\b\d{4}-\d{2}-\d{2}\b"         # 2025-10-06
    ]
    
    found_dates = []
    
    for pattern in date_patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            parsed_date = parse(match)  # Convert any format to datetime object
            if parsed_date:
                found_dates.append(parsed_date.strftime("%Y-%m-%d"))  # Convert to "YYYY-MM-DD"
    
    return found_dates

@app.post("/validate/")
async def validate_document(
    register_number: str = Form(...),
    name: str = Form(...),
    mobile_number: str = Form(...),
    internship: str = Form(...),
    internship_obtained: str = Form(...),
    internship_place: str = Form(...),
    start_date: Optional[str] = Form(None),
    end_date: Optional[str] = Form(None),
    company_name: Optional[str] = Form(None),
    stipend: Optional[int] = Form(None),
    permission_letter: UploadFile = File(...)
):
    try:
        # Extract PDF text
        pdf_bytes = await permission_letter.read()
        extracted_text = extract_text_from_pdf(pdf_bytes)
        
        if not extracted_text:
            return {"status": "error", "message": "Could not extract text from the uploaded PDF file"}

        # Extract dates from OCR text
        extracted_dates = extract_dates(extracted_text)

        # Validate extracted text against form inputs
        validation_errors = []
        if name and name.lower() not in extracted_text.lower():
            validation_errors.append("Name in the form doesn't match what's in the document")
            
        if company_name and company_name.lower() not in extracted_text.lower():
            validation_errors.append("Company name in the form doesn't match what's in the document")
            
        # More lenient date matching - check if any extracted date is close to the provided dates
        date_matched = False
        if start_date:
            start_date_obj = parse(start_date)
            for extracted_date in extracted_dates:
                extracted_date_obj = parse(extracted_date)
                if extracted_date_obj and start_date_obj:
                    # Check if dates are within 2 days of each other
                    if abs((extracted_date_obj - start_date_obj).days) <= 2:
                        date_matched = True
                        break
            
            if not date_matched and extracted_dates:
                validation_errors.append(f"Start date {start_date} not found in the document")

        # Validate end date if provided
        date_matched = False
        if end_date:
            end_date_obj = parse(end_date)
            for extracted_date in extracted_dates:
                extracted_date_obj = parse(extracted_date)
                if extracted_date_obj and end_date_obj:
                    # Check if dates are within 2 days of each other
                    if abs((extracted_date_obj - end_date_obj).days) <= 2:
                        date_matched = True
                        break
            
            if not date_matched and extracted_dates:
                validation_errors.append(f"End date {end_date} not found in the document")

        # Check if internship terms are mentioned
        internship_terms = ["intern", "internship", "training", "trainee"]
        has_internship_term = any(term in extracted_text.lower() for term in internship_terms)
        if not has_internship_term:
            validation_errors.append("Document doesn't appear to be an internship offer letter")

        if validation_errors:
            return {
                "status": "error", 
                "message": "Document validation failed: " + ", ".join(validation_errors),
                "errors": validation_errors
            }

        return {"status": "success", "message": "Document validated successfully!"}
        
    except Exception as e:
        return {"status": "error", "message": f"Validation error: {str(e)}"}

# Add a simple health check endpoint
@app.get("/")
def read_root():
    return {"status": "online", "message": "Validation service is running"}