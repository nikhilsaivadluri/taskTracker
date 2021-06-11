// import logo from './logo.svg';
import './App.css';
import LoginComponent from './loginComponent/loginComponent';
import DashBoardComponent from './dashBoardComponent/dashBoardComponent';
import UserGridComponent from './userGrid/userGrid'
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
        <Route path="/users">
          <UserGridComponent />
        </Route>

        <Redirect to="/login" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
