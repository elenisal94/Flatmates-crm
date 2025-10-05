let getAccessToken;

export const setTokenGetter = (getter) => {
  getAccessToken = getter;
};

export const apiRequest = async (endpoint, method = "GET", data = null) => {
  try {
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
    const url = `${baseUrl}/api${endpoint}`;

    const token = getAccessToken ? await getAccessToken() : null;

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(
        "API request failed:",
        response.status,
        await response.text()
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    return null;
  }
};
