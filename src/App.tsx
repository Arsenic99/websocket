import { ToastContainer } from 'react-toastify';
import './App.css';
import { Container } from './components/container';
import { Header } from './components/header';
import { CoinTable } from './components/table/coinTable';

function App() {
  return (
    <div className="App">
      <Container>
        <Header />
        <CoinTable/>
        <ToastContainer />
      </Container>
    </div>
  );
}

export default App;
