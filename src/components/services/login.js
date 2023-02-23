import axios from "axios";


const login = async (email, password) => {
    return await axios
        .post(`${process.env.REACT_APP_API_URL}auth/login`, {
            email,
            password,
        })
        .then((response) => {
            const user = {
                id: response.data.user.id,
                email: response.data.user.email,
                name: response.data.user.name,
                role: response.data.user.role,
                token: response.data.tokens.access.token,
            }

            if (response.data.tokens.access.token) {
                localStorage.setItem("user", JSON.stringify(user));
            }


            return response.data;
        });
}


export default login;