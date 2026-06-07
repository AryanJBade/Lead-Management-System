const axios = require("axios");

const fetchCompanyInfo = async () => {
    try {
        const response = await axios.get(
            "https://random-data-api.com/api/company/random_company"
        );

        const company = response.data;

        return {
            companyName: company.business_name,
            industry: company.industry,
            catchPhrase: company.catch_phrase
        };
    } catch (error) {
        console.warn("Company enrichment failed", error.message);
        return null;
    }
};

module.exports = {
    fetchCompanyInfo
};
