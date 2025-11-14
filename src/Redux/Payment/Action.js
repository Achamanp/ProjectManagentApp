import api from "../../Config/Api"

export const createPayment = async({planType, jwt}) => {
    try {
        // Debug: Check if JWT exists in localStorage
        const storedJwt = localStorage.getItem("jwt");
        
        // Ensure planType is a string
        const planTypeString = typeof planType === 'string' ? planType : String(planType);
        // Make sure the API call includes proper headers if needed
        const {data} = await api.post(`api/payments/${encodeURIComponent(planTypeString)}`, {}, {
            headers: {
                'Authorization': `Bearer ${jwt || storedJwt}`,
                'Content-Type': 'application/json'
            }
        });
        
        if(data.payment_link_url){
            window.location.href = data.payment_link_url;
        }
        
        return data;
    } catch(error) {
        
        // Re-throw the error so it can be handled by the calling component
        throw error;
    }
}