import React from "react";
import { Field } from "formik";

const FormikFormField = (props) => {
  const { name, component } = props; 
  return (
    <Field name={name}>
      {(props) => { 
        return component({
          ...props.field,
          touched: props.meta.touched,
          error: props.meta.error,
          meta: props.meta,
          onChange: (value) => props.form.setFieldValue(name, value),
          onBlur: () => props.form.setFieldTouched(name, true),
        });
      }}
    </Field>
  );
};

export { FormikFormField };
