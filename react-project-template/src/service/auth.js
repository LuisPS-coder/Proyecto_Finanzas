import api from "./api";

const postLogin = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });

  if (data.token) {
    localStorage.setItem("token", data.token);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
  }

  return data;
};


const postRegister = async ({ email, password }) => {
  const { data } = await api.post("/auth/register", {
    email,
    password,
  });
  return data;
};

const isUserLoggedIn = async () => {
  const { data } = await api.get("/auth/logged-in");
  return data;
}

export { postLogin, postRegister, isUserLoggedIn };

