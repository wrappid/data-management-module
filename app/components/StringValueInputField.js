
import { CoreBox, CoreLink, CoreTextButton, apiRequestAction, HTTP } from "@wrappid/core";
import { useDispatch } from "react-redux";

import { GENERATE_STRING_VALUE_ERROR, GENERATE_STRING_VALUE_SUCCESS } from "../types/languageTypes";

const GENERATE_STRING_VALUE = "/tableData/:id/generateLocale";
const STRING_TABLE = "string_table";

export default function StringValueInputField(props) {
  const dispatch = useDispatch();

  // eslint-disable-next-line no-console
  console.log("Props value", props);

  const onCreateStringValue = () => {
    // eslint-disable-next-line no-console
    console.log("Id:", props);
    dispatch(
      apiRequestAction(
        HTTP.POST,
        GENERATE_STRING_VALUE.replace(":id", props?.formik?.values?.id),
        true,
        { table: "MasterData" },
        GENERATE_STRING_VALUE_SUCCESS,
        GENERATE_STRING_VALUE_ERROR
      )
    );
  };

  return (
    <CoreBox>
      {!props.value || props.value === "" ? (
        <CoreTextButton onClick={onCreateStringValue} label="Generate String Value" />
      ) : (
        <>
          <CoreLink title="Go to Language Data" href={"/" + STRING_TABLE + "/" + props.value}>
            {"Go to Language Data"}
          </CoreLink>
        </>
      )}
    </CoreBox>
  );
}
