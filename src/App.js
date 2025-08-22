import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import ContactForm from './components/ContactForm';
import SearchPage from './components/SearchPage';

function App() {
  return (
    <Router>
      <Navbar />

      <Switch>
        <Route exact path="/" component={ContactForm} />
        <Route path="/edit/:id" component={ContactForm} />

        <Route path="/search" component={SearchPage} />
      </Switch>
    </Router>
  );
}

export default App;
