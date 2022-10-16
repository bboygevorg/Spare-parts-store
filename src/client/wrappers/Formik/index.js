import React from "react";
import { Formik, Form } from "formik";
import forEach from "lodash/forEach";
import set from "lodash/set";
import get from "lodash/get";
import isString from "lodash/isString";
import isEmpty from "lodash/isEmpty";
import * as Yup from "yup";
import { validateRules } from "conf/consts";

const isEndedField = (obj) =>
  get(obj, "type") !== undefined &&
  get(obj, "name") !== undefined &&
  isString(obj.type) &&
  isString(obj.name);

const fillEndedObject = (v) => {
  let field = null;
  if (v.rules && !isEmpty(v.rules)) {
    if (v.type === "date" || v.type === "file") {
      field = Yup.mixed();
    } else if (v.type === "number") {
      field = Yup.number().typeError(`Field value ${v.name} must be number`);
    } else {
      field = Yup[v.type]();
    }
    v.rules.forEach((e) => {
      if (e === validateRules.required) {
        const error = `Field ${v.name} required`;
        if (
          v.type === "string" ||
          v.type === "number" ||
          v.type === "date" ||
          v.type === "string"
        ) {
          field = field.required(error);
        }
      } else if (e.indexOf(`${validateRules.min}:`) !== -1) {
        const value = Number(e.split(":")[1]);

        if (v.type === "number" || v.type === "string") {
          const error = `${v.type === "number" ? "Value" : "Length"} of field ${
            v.name
          } can't be lesser than ${value}`;
          field = field.min(value, error);
        }
      } else if (e.indexOf(`${validateRules.max}:`) !== -1) {
        const value = Number(e.split(":")[1]);

        if (v.type === "number" || v.type === "string") {
          const error = `${v.type === "number" ? "Value" : "Length"} of field ${
            v.name
          } can't be bigger than ${value}`;
          field = field.max(value, error);
        }
      } else if (e.indexOf(`${validateRules.round}:0`) !== -1) {
        const error = `Value of field ${v.name} must be round`;
        field = field.integer(error);
      } else if (e === validateRules.phone) {
        const errorMaxMin = `Invalid phone number field format`;
        const phoneRegExp = /^([0-9]{10}|\(\d{3}\)\d{3}-\d{2}-\d{2}|[(]{1}[_]{3}[)]{1}[_]{3}[-]{1}[_]{2}[-]{1}[_]{2}|)$/;

        field = field.matches(phoneRegExp, errorMaxMin);
      } else if (e === validateRules.email) {
        field = field.email("Invalid Email Format");
      } else if (e === validateRules.password) {
        field = field.test(
          "is-password",
          "The minimum password length is 9 characters, there must be Latin letters in upper and lower case, numbers.",
          (value) => {
            if (!value && value !== 0) return true;
            const rules = [];
            let sum = 0;

            rules[0] = /[A-Z]/.test(value);
            rules[1] = /[a-z]/.test(value);
            rules[2] = /\d/.test(value);
            rules[3] = value.length >= 9;

            for (let i = 0; i < rules.length; i++) {
              sum += rules[i] ? 1 : 0;
            }
            return sum === 4;
          }
        );
      }
    });
  }
  return field;
};

export const form = ({ fields, validate = () => {} }) => (Component) => {
  const FormikWrapper = (props) => {
    let initialValues = {};
    let schema = {};

    const model = {};

     forEach(fields, (v, k) => {
       set(model, k, v);
       set(initialValues, k, get(v, "initial", initialValues[v.type]));
     });

     forEach(model, (v, k) => {
       const ended = isEndedField(v);
       if (ended) {
         const field = fillEndedObject(v);

         if (field) schema[k] = field;
       } else {
         const obj = {
           nested: Yup.object(),
         };
         setNestedFields(obj, v);
         schema[k] = obj.nested;
       }
     });

    const setNestedFields = (schema, obj) => {
      forEach(obj, (v, k) => {
        const ended = isEndedField(v);
        if (ended) {
          const field = fillEndedObject(v);
          if (field) {
            schema.nested = schema.nested.shape({
              [k]: field,
            });
          }
        } else {
          const params = {};
          forEach(v, (value, key) => {
            const field = fillEndedObject(value);
            if (field) params[key] = field;
          });
          schema.nested = schema.nested.shape({
            [k]: Yup.object().shape(params),
          });
        }
      });
    };

    const changeInitialValues = (initial, setValues) => {
      const initObject = {};
      forEach(fields, (v, k) => {
        set(initObject, k, get(initial, k) || initialValues[v.type]);
      });
      setValues(initObject);
    };

    const clearFormValues = (setValues) => {
      const initObject = {};
      forEach(fields, (v, k) => {
        set(initObject, k, fields[k].default);
      });
      setValues(initObject);
    };

    const setFormValues = (cleanFields, setFieldValue) => {
      forEach(cleanFields, (v, k) => {
        setFieldValue(k, v);
      });
    };

    const validationSchema = Yup.object().shape(schema);
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={true}
        enableReinitialize={true}
        onSubmit={() => {}}
        validate={(v) => validate(v, props)}
      >
        {(formProps) => (
          <Form style={{width: "100%" }}>
            <Component
              {...formProps}
              {...props}
              changeInitialValues={(initial) =>
                changeInitialValues(initial, formProps.setValues)
              }
              clearFormValues={() => clearFormValues(formProps.setValues)}
              setFormValues={(fields) =>
                setFormValues(fields, formProps.setFieldValue)
              }
            />
          </Form>
        )}
      </Formik>
    );
  };
   

  return FormikWrapper;
};
