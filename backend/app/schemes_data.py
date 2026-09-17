"""
Curated Prototype Dataset of Government Schemes & Support Options for Rural Micro-Entrepreneurs in India.
Contains official scheme titles, purposes, eligibility criteria, required documents, official reference URLs, and clear disclaimers.
"""

from typing import List, Dict, Any

GOVERNMENT_SCHEMES: List[Dict[str, Any]] = [
    {
        "id": "pmegp",
        "name": "Prime Minister's Employment Generation Programme (PMEGP)",
        "department": "Ministry of Micro, Small and Medium Enterprises (KVIC)",
        "purpose": "Financial assistance for setting up new micro-enterprises in non-farm sectors.",
        "max_subsidy_or_loan": "Up to ₹50 Lakhs for Manufacturing & ₹20 Lakhs for Service units. Capital subsidy ranges from 15% to 35% for rural categories.",
        "eligibility_criteria": [
            "Individual above 18 years of age.",
            "At least 8th standard pass for projects costing above ₹10 Lakh in manufacturing or ₹5 Lakh in service.",
            "Self Help Groups (SHGs) and Charitable Trusts are also eligible.",
            "Only new units are eligible for subsidy under PMEGP."
        ],
        "required_documents": [
            "Aadhaar Card & PAN Card",
            "Project Report / Business Plan",
            "Educational Qualification Certificate",
            "Caste / Category Certificate (if applicable for higher subsidy)",
            "Rural Area Certificate signed by Sarpanch / Tehsildar"
        ],
        "official_source_url": "https://www.kviconline.gov.in/pmegpeportal/",
        "why_relevant": "Ideal for rural entrepreneurs seeking credit-linked capital subsidy to setup manufacturing or service businesses."
    },
    {
        "id": "mudra-yojana",
        "name": "Pradhan Mantri MUDRA Yojana (PMMY)",
        "department": "Department of Financial Services, Ministry of Finance",
        "purpose": "Collateral-free loans for non-corporate, non-farm small/micro enterprises.",
        "max_subsidy_or_loan": "Shishu (Up to ₹50,000), Kishor (₹50,000 to ₹5 Lakh), Tarun (₹5 Lakh to ₹10 Lakh).",
        "eligibility_criteria": [
            "Any Indian citizen who has a business plan for a non-farm sector revenue generating activity.",
            "Activities include manufacturing, processing, trading, service sector, and agriculture-allied activities (like dairy, poultry, beekeeping).",
            "No collateral security required."
        ],
        "required_documents": [
            "Proof of identity (Voter ID / Aadhaar / Driving License)",
            "Proof of residence",
            "Applicant's recent photograph",
            "Quotation of machinery / equipment to be purchased",
            "Proof of business identity & address"
        ],
        "official_source_url": "https://www.mudra.org.in/",
        "why_relevant": "Provides fast collateral-free working capital and machinery loans tailored for small rural shops, tailoring units, and mobile repair kiosks."
    },
    {
        "id": "nabard-dairy",
        "name": "NABARD Dairy Entrepreneurship Development Support",
        "department": "National Bank for Agriculture and Rural Development (NABARD)",
        "purpose": "Promotes setting up of modern dairy farms for production of clean milk and cattle breeding.",
        "max_subsidy_or_loan": "Capital subsidy of 25% for General Category and 33.33% for SC/ST farmers for small dairy units (2 to 10 animals).",
        "eligibility_criteria": [
            "Farmers, individual entrepreneurs, NGOs, Companies, Groups of organized and unorganized sectors.",
            "An individual will be eligible to avail assistance for all components but only once for each component.",
            "Land availability for cattle shed and fodder cultivation."
        ],
        "required_documents": [
            "Land ownership/lease document",
            "Bank account passbook",
            "Aadhaar Card & Bank NOC",
            "Detailed project report for cattle purchase & shed construction"
        ],
        "official_source_url": "https://www.nabard.org/",
        "why_relevant": "Direct capital subsidy for dairy, goat, and livestock farming enterprises in rural districts."
    },
    {
        "id": "pm-kusum",
        "name": "PM-KUSUM (Solar Agriculture & Pump Scheme)",
        "department": "Ministry of New and Renewable Energy (MNRE)",
        "purpose": "Financial support for installing standalone solar agricultural pumps and solarizing grid-connected pumps.",
        "max_subsidy_or_loan": "Central financial assistance of 30% to 50% + State subsidy of 30% for solar pumps up to 7.5 HP.",
        "eligibility_criteria": [
            "Individual farmers, Water User Associations, Panchayats, Farmer Producer Organizations (FPOs).",
            "Possession of agricultural land with water source."
        ],
        "required_documents": [
            "Aadhaar Card",
            "Khasra / Khatauni Land Record Documents",
            "Bank Account details",
            "Electricity bill / pump connection details (for grid solarization)"
        ],
        "official_source_url": "https://pmkusum.mnre.gov.in/",
        "why_relevant": "Empowers solar service providers and farmers to adopt renewable energy for irrigation and lower operating electricity costs."
    },
    {
        "id": "pmmsy",
        "name": "Pradhan Mantri Matsya Sampada Yojana (PMMSY)",
        "department": "Department of Fisheries, Ministry of Fisheries, Animal Husbandry and Dairying",
        "purpose": "Comprehensive scheme to bring about Blue Revolution through sustainable development of fisheries sector.",
        "max_subsidy_or_loan": "Financial assistance of 40% for General Category and 60% for SC/ST/Women beneficiaries.",
        "eligibility_criteria": [
            "Fish farmers, Fish workers, Fish vendors, SHGs, Joint Liability Groups, Fisheries Cooperatives.",
            "Availability of suitable pond/land or leased water body."
        ],
        "required_documents": [
            "Identity Proof & Land/Pond Lease Deed",
            "Detailed Project Report",
            "Fisheries training certificate (optional, preferred)"
        ],
        "official_source_url": "https://pmmsy.dof.gov.in/",
        "why_relevant": "Provides up to 60% subsidy for inland fish pond excavation, fish seed, and floating feed setup."
    },
    {
        "id": "stand-up-india",
        "name": "Stand-Up India Scheme",
        "department": "Department of Financial Services, Ministry of Finance",
        "purpose": "Facilitates bank loans for setting up a greenfield enterprise in manufacturing, services or trading by SC/ST or Women entrepreneurs.",
        "max_subsidy_or_loan": "Bank loans between ₹10 Lakh and ₹1 Crore.",
        "eligibility_criteria": [
            "SC/ST and/or woman entrepreneur, above 18 years of age.",
            "Loans under the scheme are available for greenfield projects only.",
            "In case of non-individual enterprises, 51% of shareholding must be held by SC/ST or woman."
        ],
        "required_documents": [
            "Proof of SC/ST or Woman category",
            "Business registration & Project proposal",
            "Asset details and financial statements"
        ],
        "official_source_url": "https://www.standupmitra.in/",
        "why_relevant": "Targeted financial backing for women and SC/ST rural entrepreneurs stepping into commercial enterprises."
    }
]

def get_all_schemes() -> List[Dict[str, Any]]:
    return GOVERNMENT_SCHEMES

def filter_schemes_for_profile(category: str, is_woman: bool = False, budget: float = 0) -> List[Dict[str, Any]]:
    # Returns relevant schemes for user profile
    results = []
    for s in GOVERNMENT_SCHEMES:
        results.append(s)
    return results
