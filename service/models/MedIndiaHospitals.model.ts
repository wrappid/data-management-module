export const MedIndiaHospitals = (sequelize: any, DataTypes: any) => {
  const  MedIndiaHospitals = sequelize.define(
    "MedIndiaHospitals",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      hospitalName: {
        // defaultValue: "",
        type: DataTypes.STRING,
      },
      address: {
        // defaultValue: "",
        type: DataTypes.STRING,
      },
      city:{
        // defaultValue: "",
        type: DataTypes.STRING,
      },
      pinCode:{
        // defaultValue: "",
        type: DataTypes.INTEGER,
      },
      state:{
        // defaultValue: "",
        type: DataTypes.STRING,
      },
      country:{
        // defaultValue: "",
        type: DataTypes.STRING,
      },
      phoneNumber:{
        // defaultValue: "",
        type: DataTypes.STRING,
      },
    },
    {
      createdAt: false, // don't add createdAt attribute
      updatedAt: false,
    }
  );
  
  return MedIndiaHospitals;
};
  