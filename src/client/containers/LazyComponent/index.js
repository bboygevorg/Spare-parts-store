import React, {Suspense} from "react";
import Loading from "components/Loading";
function LazyComponent(props) {
    const {component, data , children} = props;
    const Component = component; 
    return (<Suspense fallback={<Loading />}>
        {children ? children : <Component {...data} />}
    </Suspense>)
}

export {LazyComponent}