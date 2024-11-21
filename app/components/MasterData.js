import React from "react";

import { AppContainerLayout, CoreDataTable, CoreLayoutItem, coreUseNavigate, coreUseParams } from "@wrappid/core";

export default function MasterData() {
  const navigate = coreUseNavigate();
  const { parentID } = coreUseParams();
  const [filter, setFilter] = React.useState({ parentId: { eq: null } });

  React.useEffect(() => {
    let filterTemp = filter;

    // eslint-disable-next-line no-console
    console.log("MOUNT parent", parentID);
    if (parentID) {
      filterTemp.parentId.eq = parentID;
    } else {
      filterTemp.parentId.eq = null;
    }
    setFilter(filterTemp);
  }, [parentID]);

  const onChildClick = (data) => {
    navigate("/masterData/all/" + data?.id);
  };
  const onParentClick = (data) => {
    // navigate("/masterData/all/" + data?.parentId);
    navigate(-1);
  };

  // eslint-disable-next-line no-console
  console.log("FILTER", filter);
  return (
    <>
      <CoreLayoutItem id={AppContainerLayout.PLACEHOLDER.CONTENT}>
        <CoreDataTable
          entity="LayeredMasterData"
          filterQuery={{ filter: {...filter, _status: {"ne": "deleted"}} }}
          createFormID="newMasterData"
          updateFormID="newMasterData"
          rowActions={[
            {
              action: onChildClick,
              hide  : (data) => {
                // eslint-disable-next-line no-console
                console.log("CHECKING CHILD", data);
                if (data.id && data.Children && data.Children.length > 0) {
                  return false;
                } else {
                  return true;
                }
              },
              icon : "chevron_right",
              label: "Go to child",
              type : "action",
            },{
              action: onParentClick,
              hide  : (data) => {
                // eslint-disable-next-line no-console
                console.log("CHECKING PARENT", data);
                if (data?.parentId > 0) {
                  return false;
                } else {
                  return true;
                }
              },
              icon : "chevron_right",
              label: "Go to parent",
              type : "action",
            },
          ]}
        />
      </CoreLayoutItem>
    </>
  );
}
