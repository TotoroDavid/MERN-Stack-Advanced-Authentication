import { Redirect, Route } from "react-router-dom"

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={
                (props) => (
                    localStorage.getItem('authToken') ? (
                        <Component {...props} />
                    ) : (
                        <Redirect tp='/login' />
                    )
                )}
        />
    )
}

export default PrivateRoute
