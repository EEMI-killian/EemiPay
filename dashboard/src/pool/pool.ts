import axios from "axios";

export async function getUserInfo() {
    try {
        const response = await axios.get('http://localhost:3051/document', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token_eemiPay')}`
            }
        });
        return response.data.data; // Assuming the user data is in response.data.data
    } catch (error: any) {
        console.error(error.message);
    }
}