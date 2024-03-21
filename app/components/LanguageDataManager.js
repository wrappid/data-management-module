import { coreUseParams, CoreDataTable, CoreBox, CoreLayoutItem, AppContainerLayout } from "@wrappid/core";

import LanguageEditorForm from "./LanguageEditorForm";

export default function LanguageDataManager() {
  const { key } = coreUseParams();

  return (
    <>
      <CoreLayoutItem id={AppContainerLayout.PLACEHOLDER.CONTENT}>
        <CoreBox>
          <CoreDataTable
            hideForm={true}
            entity={"DefaultStringValues"}
            preRenderDetailsPaneComponent={LanguageEditorForm}
            filterQuery={{ filter: key ? { key } : null }}
          />
        </CoreBox>
      </CoreLayoutItem>
    </>
  );
}
