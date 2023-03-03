import axios from "axios";

 const register = async (user) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}auth/register`, {
        name: user.name,
        email: user.email,
        password:user.password,
        code:user.code
    });
};

export default register;