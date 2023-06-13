import { coreUseParams } from "@wrappid/core";

import LanguageEditorForm from "./LanguageEditorForm";
import {CoreDataTable, CoreBox} from "@wrappid/core";

export default function LanguageDataManager() {
    const { key } = coreUseParams();

    return (
        <CoreBox>
            <CoreDataTable
                hideForm={true}
                entity={"DefaultStringValues"}
                preRenderDetailsPaneComponent={LanguageEditorForm}
                filterQuery={{ filter: key ? { key } : null }}
            />
        </CoreBox>
    );
}
