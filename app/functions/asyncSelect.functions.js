export const masterData = {
  getOptionLabel: (data) => {
    return data?.label || "";
  },
  getOptionValue: (data) => {
    return data?.name || "";
  },
  isOptionsEqualToValue: (option, value) => {
    return option?.name === value;
  },
};