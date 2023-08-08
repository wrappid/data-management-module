import React from "react";

import { coreUseNavigate, coreUseParams, CoreDataTable } from "@wrappid/core";

import { RouteRegistry } from "../routes.registry";

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
    navigate("/" + RouteRegistry.MASTER_DATA + "/" + data.id);
  };

  // eslint-disable-next-line no-console
  console.log("FILTER", filter);
  return (
    <CoreDataTable
      entity="LayeredMasterData"
      filterQuery={{ filter: filter }}
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
        },
      ]}
    />
  );
}
