import AuthPage from "./pages/AuthPage/AuthPage";

function App() {
  const handleSuccess = (sessionRef) => {
    console.log("Connecté :", sessionRef);
    // Redirige vers le tableau de bord
  };

  return <AuthPage onSuccess={handleSuccess} />;
}

export default App;
