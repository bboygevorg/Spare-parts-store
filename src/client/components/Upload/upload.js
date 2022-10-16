import React from "react";
import classes from "./upload.css";
import Typo from 'ui/Typo';
import useTranslation from "talons/useTranslation";
import Close from "icons/Close";

const Upload = (props) => {
    const { formik, sizeError, setSizeError } = props;
    const __ = useTranslation();

    const onImageChange = event => {
        if(sizeError) {
            setSizeError("");
        }
        let arr = [];
        let withUrls = [];
        if (event.target.files && event.target.files.length) {
            arr = [...event.target.files]
        }
        if(arr.length) {
            let length = arr.length;
            arr.map(item => {
                if(item.size > 5000000) {
                    length = length - 1;
                    setSizeError("Size is too big. Max allowed 5MB.");
                    return;
                }
                withUrls.push(item);
            })
        }
        if(withUrls.length) {
            let updated = [...formik.values.files, ...withUrls];
            formik.setFieldValue("files", updated);
        }
    };

    const removeFile = (name) => {
        const arr = [...formik.values.files];
        const removedIndex = arr.findIndex(elem => elem.name === name);
        arr.splice(removedIndex,1);
        formik.setFieldValue("files", arr);
    }

    return (
        <div className={classes.root}>
            <div className={`${classes.chooseFile} ${sizeError ? classes.errorInputComponent : ""}`}>
                <input type="file" 
                    id="myImage"
                    name="myImage"
                    accept="image/*, application/pdf" 
                    onChange={onImageChange} 
                    className={classes.fileInput}
                    multiple
                />
            </div>
            {sizeError ? 
                <div className={classes.error}>
                    <Typo as="p" variant="pxs" color="error" font="regular">
                        {__(sizeError)}
                    </Typo>
                <img className={classes.errorIcon} src="/icons/error.svg" />
            </div> : null}
            {formik && formik.values && formik.values.files && formik.values.files.length ? 
                <div className={classes.files}>
                    {formik.values.files.map((file, index) => 
                        <div key={index} className={classes.file}>
                            <p>{file.name}</p>
                            <span onClick={() => removeFile(file.name)} className={classes.closeIcon}><Close/></span>
                        </div>
                    )}
                </div>
            : null}
        </div>
    );
};

export default Upload;