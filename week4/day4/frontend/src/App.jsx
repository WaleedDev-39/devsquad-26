import { Provider } from "react-redux";
import { store } from "./store";
import Header from "./components/Header";
import MatchList from "./components/MatchList";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-slate-950">
        <Header />
        <MatchList />
      </div>
    </Provider>
  );
}

export default App;
