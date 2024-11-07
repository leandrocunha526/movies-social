const AuthService = {
    isAuthenticated(): boolean {
        const token = localStorage.getItem("token");
        const expiration = localStorage.getItem("token-expiration");

        if (token && expiration) {
            const now = new Date();
            const expDate = new Date(expiration);
            if (now < expDate) {
                return true;
            } else {
                this.logout();
            }
        }
        return false;
    },

    logout(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("token-expiration");
        localStorage.setItem("redirectAfterLogout", "true");
    },

    setToken(token: string): void {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7); // Expiração para 7 dias
        localStorage.setItem("token", token);
        localStorage.setItem("token-expiration", expirationDate.toISOString());
    }
};

export default AuthService;
