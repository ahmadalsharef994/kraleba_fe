/* service for registering a new user */
export const register = (user) => {
    return fetch(`${process.env.API_URL}register`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    }).then((res) => res.json());
};