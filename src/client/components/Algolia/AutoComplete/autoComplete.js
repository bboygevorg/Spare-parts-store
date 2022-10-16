import React, { useEffect, useRef } from 'react';
import { connectAutoComplete } from 'react-instantsearch-dom';
import useOnClickOutside from 'talons/useOnClickOutside';
import defaultClasses from './autoComplete.css';
import { useHistory } from "react-router-dom";
import useSearchHistory from 'talons/useSearchHistory';
import { codeSplitter } from 'components/Link/link';
import { useSelector } from 'react-redux';
import { mergeClasses } from 'helper/mergeClasses';

const AutoComplete = ({ 
  hits, 
  refine, 
  setIsOpen, 
  value, 
  isOpen, 
  setValue, 
  focused, 
  setFocused,
  setCurrentSearchQuery,
  classes: propsClasses,
  isAccount,
  handleRevineValue
}) => {
  const history = useHistory();
  const rootRef = useRef();
  const { queries } = useSearchHistory();
  const classes = mergeClasses(defaultClasses, propsClasses);
  const localeId = useSelector(state => state.language.currentLanguage);

  useOnClickOutside(rootRef, () => {
    if(isOpen && focused) {
      setIsOpen(false); 
      setFocused(false)
      document.activeElement.blur();
    }
  });

  useEffect(() => {
    if(hits.length && value && focused || !value && queries && queries.length && focused) {
      setIsOpen(true)
    }
    if((!value && queries && !queries.length) || !hits.length || !focused) {
      setIsOpen(false);
    }
  
  }, [value, hits, focused, queries]);

  useEffect(() => {
    if(value) {
      refine(value)
    }
  }, [value]);

  return (
    <div
    ref={rootRef}
    className={isOpen ? classes.customOptionsOpen : classes.customOptionsHidden}
  >
    { value && hits.length && hits.map(hit => {
      return <div 
        className={classes.option} 
        key={hit.objectID} 
        onClick={() => {
          setCurrentSearchQuery(hit.query)
          setIsOpen(false)
          setFocused(false)
          setValue(hit.query);
          if(!isAccount) {
            if(localeId === "default") {
              history.push(`/search?query=${hit.query}`, {
                state: {
                  isFromSearchBox: true,
                },
              });
            }
            else {
              localeId && history.push(`/search?query=${hit.query}${codeSplitter(localeId)}`, {
                state: {
                  isFromSearchBox: true,
                },
              });
            }
          }
          else {
            handleRevineValue(hit.query)
          }
        }}
      >
        {hit.query}
      </div>
    })}
    {!value && queries && queries.length && queries.map((query, index) => {
      return (
        <div 
          key={index}
          className={classes.option}
          onClick={() => {
            setCurrentSearchQuery(query)
            setIsOpen(false)
            setFocused(false)
            setValue(query);
            if(!isAccount) {
              if(localeId === "default") {
                history.push(`/search?query=${query}`, {
                  state: {
                    isFromSearchBox: true,
                  },
                });
              }
              else {
                localeId && history.push(`/search?query=${query}${codeSplitter(localeId)}`, {
                  state: {
                    isFromSearchBox: true,
                  },
                });
              }
            }
            else {
              handleRevineValue(query)
            }
          }}
        >
          {query}
        </div>
      )
    })}
  </div>
  )
};

export default connectAutoComplete(AutoComplete);