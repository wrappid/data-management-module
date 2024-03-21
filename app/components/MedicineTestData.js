import { CoreDataTable, CoreLayoutItem, AppContainerLayout } from "@wrappid/core";

export default function MedicineTestData() {
  return (
    <>
      <CoreLayoutItem id={AppContainerLayout.PLACEHOLDER.CONTENT}>
        <CoreDataTable entity={"TestMedicine"} />
      </CoreLayoutItem>
    </>
  );
}
