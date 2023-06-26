import React from "react";

import { CoreForm, FORM_IDS } from "@wrappid/core";
import { useDispatch } from "react-redux";

import { SET_LANGUAGE_TABLE_DATA } from "../types/languageTypes";

export default function LanguageEditorForm(props) {
  const { data } = props;

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch({ payload: data, type: SET_LANGUAGE_TABLE_DATA });
  }, []);

  return (
    <CoreForm
      query={{ _defaultFilter: encodeURIComponent(JSON.stringify({ _status: "active", key: data?.key })) }}
      formId={FORM_IDS.__STRING_TABLE_MANAGER}
    />
  );
}
