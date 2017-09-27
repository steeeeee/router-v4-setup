import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    NavLink,
    Redirect
} from 'react-router-dom'

import './App.css'

const PRIVATE_ROOT = '/'
const PUBLIC_ROOT = '/login'

const AuthRoute = ({isAuth, component, ...props}) => {
    // Pagina stessa fa sapere se è pubblica o privata
    const { isPrivate } = component

    if (isAuth) {
      // Se utente autenticato
      if (isPrivate === true) {
        // Se la route è privata, procedi
        return <Route { ...props } component={ component } />
      }
      else {
        // Se la route è pubblica, spedisci alla home
        return <Redirect to={ PRIVATE_ROOT } />
      }
    }
    else {
      // Utente non autenticato
      if (isPrivate === true) {
        // Se è pagina privata, spedisci alla login
        // e lascia briciola di pane
        return <Redirect to={{
            pathname: PUBLIC_ROOT,
            state: {from: props.location}
        }} />
      }
      else {
        // Rotta pubblica, circolare, circolare
        return <Route { ...props } component={ component } />
      }
    }
  }


const Navbar = ({ isAuth, doAuth }) => (
    // Navbar la facciamo vedere solo se loggati,
    // ma non è più legata alle rotte come in passato
    isAuth ?
        (
            <header className="App-header">
                <ul>
                    <li>
                        <NavLink activeStyle={{ color: 'red' }} to="/agents/">Agents</NavLink>
                    </li>
                    <li>
                        <NavLink activeStyle={{ color: 'red' }} to="/influencers/">Influencers</NavLink>
                    </li>
                </ul>
                <button onClick={doAuth}> Logout </button>
            </header>
        )
        :
        null
)

const InfluencersList = () => (
    <div>
        <div>Influencer List</div>
        <ul>
            <li>
                <NavLink to="/influencers/new">Add Influencers</NavLink>
            </li>
            <li>
                <NavLink to="user-xxx/">View Influencer</NavLink>
            </li>
        </ul>
    </div>
)
const Sidebar = () => <div>Sidebar</div>
const AddInfluencer = (props) => <div><div>Add Influencer</div><button onClick={() => props.history.push('..')}>Go up a level</button></div>
const InfluencerCard = (props) => <div><div>View Influencer</div><button onClick={() => props.history.push('..')}>Go up a level</button></div>

class InfluencersPage extends Component {
    // Qui si imposta il tipo di autenticazione richiesta
    static isPrivate = true
    
    render() {
        return (
            <section>
                <Sidebar />
                <InfluencersList />
                <Switch>
                    <Route path="/influencers/new" component={AddInfluencer} />
                    <Route path="/influencers/:id/" component={InfluencerCard} />
                </Switch>
            </section>
        )
    }
}

class LoginPage extends Component {
    // Qui si imposta il tipo di autenticazione richiesta
    static isPrivate = false

    render() {
        const { doAuth, isAuth, location } = this.props
        const { from } = location.state || { from: { pathname: '/' } }
        
        if (isAuth) {
            return (
                <Redirect to={from} />
            )
        }

        return (
            <section>
                <p>You must log in to view the page at {from.pathname}</p>
                <button onClick={doAuth}>Log in</button>
            </section>
        )
    }
}


class NoMatchPage extends Component {
    // Qui si imposta il tipo di autenticazione richiesta
    static isPrivate = false

    render() {
        const { location } = this.props
        return (
            <div>No match for <code>{location.pathname}</code>. 404 baby</div>
        )
    }
}

class App extends Component {
    constructor(props) {
        super(props)
        // ovviamente sarà gestito da redux+firebase e non da stato del componente
        this.state = {
            isAuth: false
        }
    }

    doAuth = () => this.setState({ isAuth: !this.state.isAuth })


    // qui ho schiantato le authroute, vanno adattate con la
    // configurazione esterna come sull'app originale. ora dovrebbe bastare un solo map e via.
    render() {
        const { isAuth } = this.state
        return (
            <Router>
                <main className="App">
                    <Navbar isAuth={isAuth} doAuth={this.doAuth} />
                    <Switch>
                        <Redirect exact from="/" to="/influencers/" />
                        <AuthRoute path="/login" exact component={(props) => <LoginPage isAuth={isAuth} doAuth={this.doAuth} {...props} />} />
                        <AuthRoute path="/influencers" component={InfluencersPage} isAuth={isAuth} />
                        <AuthRoute component={NoMatchPage} />
                    </Switch>
                </main>
            </Router>
        )
    }
}


// ATTENZIONE
// per semplificare l'esempio, qui manca tutto il giro con l'HOC WithAuth, 
// necessario a impostare la sessione nello store.

export default App
