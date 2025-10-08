let getAccessToken;

export const setTokenGetter = (getter) => {
  getAccessToken = getter;
};

export const apiRequest = async (endpoint, method = "GET", data = null) => {
  try {
    // console.log("getAccessToken available?", !!getAccessToken);
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
    const url = `${baseUrl}${endpoint}`;

    const token = getAccessToken ? await getAccessToken() : null;

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const options = {
      method: method.toUpperCase(),
      headers,
    };

    if (data && method.toUpperCase() !== "GET") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API request failed:", response.status, errorText);
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};
