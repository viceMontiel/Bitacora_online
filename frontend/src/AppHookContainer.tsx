import App from "./App"
import AppRouter from "./Routes/AppRouter"
import { AuthProvider } from "./context/authContext"
function AppHookContainer() {
  return (
    <AuthProvider>
        <App>
            <AppRouter />
        </App>
    </AuthProvider>

  )
}

export default AppHookContainer