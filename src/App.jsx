import { RouterProvider } from "react-router";
import router from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </Provider>
    </>
  );
}

export default App;
