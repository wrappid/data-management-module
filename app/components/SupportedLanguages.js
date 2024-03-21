import { CoreDataTable, CoreLayoutItem, AppContainerLayout } from "@wrappid/core";

export default function SupportedLanguages() {
  return (
    <>
      <CoreLayoutItem id={AppContainerLayout.PLACEHOLDER.CONTENT}>
        <CoreDataTable entity="SupportedLanguages" enableCreate={true} />
      </CoreLayoutItem>
    </>
  );
}
