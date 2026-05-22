/**
 * NMC (National Medical Commission) Doctor Verification Service
 * 
 * This service simulates verification against the Indian Medical Register (IMR).
 * In production, replace the mock lookup with a real API call to:
 *   - Surepass NMC Verification API (https://surepass.io)
 *   - Decentro Professional Verification API
 *   - Or direct NMC portal scraping via Apify
 * 
 * Input:  registrationNumber, stateMedicalCouncil
 * Output: { verified, doctorDetails } or { verified: false, reason }
 */

// List of valid State Medical Councils in India
const STATE_MEDICAL_COUNCILS = [
    "Andhra Pradesh Medical Council",
    "Arunachal Pradesh Medical Council",
    "Assam Medical Council",
    "Bihar Medical Council",
    "Chhattisgarh Medical Council",
    "Delhi Medical Council",
    "Goa Medical Council",
    "Gujarat Medical Council",
    "Haryana Medical Council",
    "Himachal Pradesh Medical Council",
    "Jammu & Kashmir Medical Council",
    "Jharkhand Medical Council",
    "Karnataka Medical Council",
    "Kerala Medical Council",
    "Madhya Pradesh Medical Council",
    "Maharashtra Medical Council",
    "Manipur Medical Council",
    "Meghalaya Medical Council",
    "Mizoram Medical Council",
    "Nagaland Medical Council",
    "Odisha Medical Council",
    "Punjab Medical Council",
    "Rajasthan Medical Council",
    "Sikkim Medical Council",
    "Tamil Nadu Medical Council",
    "Telangana State Medical Council",
    "Tripura Medical Council",
    "Uttar Pradesh Medical Council",
    "Uttarakhand Medical Council",
    "West Bengal Medical Council",
    "Medical Council of India"
];

// -------------------------------------------------------------------
// Mock Database: Simulates the Indian Medical Register for demo purposes
// In production, this entire block is replaced by a single API call.
// -------------------------------------------------------------------
const MOCK_IMR_DATABASE = {
    "DMC-12345": {
        name: "Dr. Sarah Smith",
        fatherName: "Mr. Robert Smith",
        qualification: "MBBS, MD (Cardiology)",
        university: "AIIMS New Delhi",
        yearOfRegistration: "2015",
        stateMedicalCouncil: "Delhi Medical Council",
        registrationNumber: "DMC-12345",
        status: "ACTIVE",
        address: "New Delhi"
    },
    "KMC-67890": {
        name: "Dr. Ravi Kumar",
        fatherName: "Mr. Suresh Kumar",
        qualification: "MBBS, MS (Orthopaedics)",
        university: "Bangalore Medical College",
        yearOfRegistration: "2018",
        stateMedicalCouncil: "Karnataka Medical Council",
        registrationNumber: "KMC-67890",
        status: "ACTIVE",
        address: "Bangalore"
    },
    "MMC-11111": {
        name: "Dr. Priya Sharma",
        fatherName: "Mr. Anil Sharma",
        qualification: "MBBS, DGO",
        university: "Grant Medical College, Mumbai",
        yearOfRegistration: "2012",
        stateMedicalCouncil: "Maharashtra Medical Council",
        registrationNumber: "MMC-11111",
        status: "ACTIVE",
        address: "Mumbai"
    },
    "TMC-22222": {
        name: "Dr. Arun Krishnan",
        fatherName: "Mr. V. Krishnan",
        qualification: "MBBS, MD (Dermatology)",
        university: "Madras Medical College",
        yearOfRegistration: "2020",
        stateMedicalCouncil: "Tamil Nadu Medical Council",
        registrationNumber: "TMC-22222",
        status: "SUSPENDED",
        address: "Chennai"
    }
};

/**
 * Verify a doctor against the Indian Medical Register
 * 
 * @param {string} registrationNumber - The NMC/State Medical Council registration number
 * @param {string} stateMedicalCouncil - Name of the issuing State Medical Council
 * @returns {Promise<object>} Verification result
 */
const verifyDoctor = async (registrationNumber, stateMedicalCouncil) => {
    // Validate inputs
    if (!registrationNumber || !stateMedicalCouncil) {
        return {
            verified: false,
            reason: "Registration number and State Medical Council are required."
        };
    }

    // Validate the State Medical Council name
    if (!STATE_MEDICAL_COUNCILS.includes(stateMedicalCouncil)) {
        return {
            verified: false,
            reason: "Invalid State Medical Council name."
        };
    }

    // ---------------------------------------------------------------
    // PRODUCTION: Replace this block with a real API call, e.g.:
    //
    // const response = await fetch("https://api.surepass.io/api/v1/nmc/verify", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${process.env.SUREPASS_API_KEY}`
    //     },
    //     body: JSON.stringify({
    //         registration_number: registrationNumber,
    //         state_medical_council: stateMedicalCouncil
    //     })
    // });
    // const data = await response.json();
    // ---------------------------------------------------------------

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const upperRegNum = registrationNumber.toUpperCase();
    const record = MOCK_IMR_DATABASE[upperRegNum];

    if (!record) {
        return {
            verified: false,
            reason: "Registration number not found in the Indian Medical Register. Please ensure the number is correct and matches the selected State Medical Council."
        };
    }

    // Cross-check the State Medical Council
    if (record.stateMedicalCouncil !== stateMedicalCouncil) {
        return {
            verified: false,
            reason: `Registration number found, but it belongs to "${record.stateMedicalCouncil}", not "${stateMedicalCouncil}". Please select the correct council.`
        };
    }

    // Check if the registration is active
    if (record.status !== "ACTIVE") {
        return {
            verified: false,
            reason: `Doctor registration is currently "${record.status}". Only doctors with ACTIVE registration can sign up.`,
            doctorDetails: record
        };
    }

    // All checks passed
    return {
        verified: true,
        doctorDetails: record
    };
};

module.exports = { verifyDoctor, STATE_MEDICAL_COUNCILS };
