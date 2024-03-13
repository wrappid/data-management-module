import * as yup from "yup";

interface GetMasterDataQuery {
  level?: string;
  name?: string;
  _status?: string;
  parentId?: string;
}

const getMasterData = {
  query: yup
    .object<GetMasterDataQuery>({
      level: yup.string().notRequired(),
      name: yup.string().notRequired(),
      _status: yup.string().notRequired(),
      parentId: yup.string().notRequired(),
    })
    .noUnknown()
    .strict(),
};

export { getMasterData };