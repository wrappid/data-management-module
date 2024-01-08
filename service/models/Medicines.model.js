module.exports = (sequelize, DataTypes) => {
    const medicines = sequelize.define("Medicines", {
        _status           : { type: DataTypes.STRING },
        alcoholInteraction: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        brestfeedingInteraction: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        code: {
            allowNull: true,
            type     : DataTypes.INTEGER
        },
        commonSideEffect: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        crowdSource: {
            defaultValue: false,
            type        : DataTypes.BOOLEAN
        },
        deletedAt: {
            allowNull: true,
            type     : "TIMESTAMP"
        },
        drivingInteraction: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        engagement: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        howToUse: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        id: {
            autoIncrement: true,
            primaryKey   : true,
            type         : DataTypes.INTEGER
        },
        ingredients: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        isActive: {
            allowNull: true,
            type     : DataTypes.BOOLEAN
        },
        kidneyInteraction: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        liverInteraction: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        manufacturers: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        name: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        pregnancyInteraction: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        prescriptionRequired: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        url: {
            allowNull: true,
            type     : DataTypes.TEXT
        },
        useOf: {
            allowNull: true,
            type     : DataTypes.TEXT
        }
    });

    medicines.associate = (models) => {
        medicines.belongsTo(models.Formulations, {
            foreignKey: "formulationId",
            sourceKey : "id"
        });
        medicines.belongsTo(models.ChemicalCompositions, {
            foreignKey: "chemicalCompositionId",
            sourceKey : "id"
        });
        medicines.belongsTo(models.MedicineCompanies, {
            foreignKey: "medicineCompanyId",
            sourceKey : "id"
        });
        medicines.hasOne(models.MedicinePackages, {
            foreignKey: "medicineId",
            sourceKey : "id"
        });
        medicines.hasOne(models.MedicineDetails, {
            foreignKey: "medicineId",
            sourceKey : "id"
        });
        medicines.hasMany(models.AdvicedMedicines, {
            foreignKey: "medicineId",
            sourceKey : "id"
        });
        medicines.belongsTo(models.Users, {
            as        : "Owner",
            foreignKey: "createdBy",
            sourceKey : "id"
        });
        medicines.belongsTo(models.Users, {
            as        : "Uodater",
            foreignKey: "updatedBy",
            sourceKey : "id"
        });
        medicines.belongsTo(models.Users, {
            as        : "Destroyer",
            foreignKey: "deletedBy",
            sourceKey : "id"
        });
    };

    return medicines;
};
