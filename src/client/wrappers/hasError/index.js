import React from "react";

const hasError = (Component) => {
  const Error = (props) => {
    const { meta } = props;

    const isError = () => {
      if (!meta) return false;
      return meta.touched && meta.error;
    };

    const error = isError(); 
    return (
      <div>
        <Component {...props} error={error} />
        {error && (
          <div style={{ marginTop: 15, color: "var(--global-error-color)" }}>
            {meta.error}
          </div>
        )}
      </div>
    );
  };

  return Error;
};

export { hasError };
