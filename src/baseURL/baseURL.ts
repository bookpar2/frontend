import axios from "axios";
import useUserStore from "../stores/useUserStore";

const productionDomain = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: productionDomain || "http://localhost:8080/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 특정 API 요청만 AccessToken 추가
api.interceptors.request.use(
  async (config) => {
    const { access } = useUserStore.getState();

    // `Authorization` 헤더가 필요하지 않은 요청인지 확인
    const noAuthEndpoints = ["/users/login/", "/users/register/", "/users/send-verification-email/"];

    // 특정 엔드포인트가 아닌 경우만 AccessToken 추가
    if (access && !noAuthEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      config.headers.Authorization = `Bearer ${access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 발생 시 자동으로 토큰 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { refresh, setUser, logout } = useUserStore.getState();
    const originalRequest = error.config;

    // 401 에러이고, refreshToken이 존재하며, 재시도한 요청이 아닐 경우
    if (error.response?.status === 401 && refresh && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 여부 설정

      try {
        // 리프레시 토큰으로 새로운 액세스 토큰 요청
        const response = await axios.post(`${productionDomain}users/token/refresh/`, { refresh });

        const newAccessToken = response.data.access;

        // 새 accessToken 저장 및 sessionStorage 업데이트
        setUser({ access: newAccessToken });
        sessionStorage.setItem(
          "user",
          JSON.stringify({ ...useUserStore.getState(), access: newAccessToken })
        );

        // 원래 요청 다시 실행
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패: 자동 로그아웃 처리");
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;