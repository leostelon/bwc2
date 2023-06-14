import { default as axios } from "axios"

export const createUser = async function (address) {
    try {
        const sign = await window.ethereum.request({
            method: "personal_sign",
            params: [address, "Please approve this message."],
        });

        const response = await axios.post("http://localhost:3000/user/login", { sign }, {
            headers: {
                "Content-Type": `application/json`,
            }
        })
        if (response.status === 200) {
            console.log(response.data)
            localStorage.setItem("token", response.data.token);

            return response.data;
        }
    } catch (error) {
        console.log(error.message)
    }
}
