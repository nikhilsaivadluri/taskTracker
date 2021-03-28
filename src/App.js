// import logo from './logo.svg';
import './App.css';
import LoginComponent from './loginComponent/loginComponent';
import DashBoardComponent from './dashBoardComponent/dashBoardComponent';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Switch>
        <Route path="/login">
          <LoginComponent />
        </Route>
        <Route path="/dashboard">
          <DashBoardComponent />
        </Route>
        <Redirect to="/login" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
