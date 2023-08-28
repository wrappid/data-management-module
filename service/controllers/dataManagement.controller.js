const dataManagementFunctions = require("../functions/dataManagement.functions")
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

module.exports.masterData = async (req,res) => {
  try{
    let data = await dataManagementFunctions.getMasterDataUtil(req,res);
    // console.log("API Call sucessfully");
    let { status, ...restData } = data;
    res.status(status).json(restData);
  }catch(error){
    console.error("Error:: ", error);
    res.status(500).json({ message: error.message });
  }         
                  
}



/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports.getRole = async (req, res) => {
    // var isValidJOI = await authenticateJOI(req, "roleGET", ["query"]);
    db.Roles.findAll({ where: { ...req.query } })
      .then((data) => {
        console.log("Role fetched successfully");
        res
          .status(200)
          .json({ message: "Role fetched successfully", data: data });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error to fetch roles" });
      });
  };

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports.getDepartment = async (req, res) =>{
    // var isValidJOI = await authenticateJOI(req, "departmentGET", ["query"]);
    db.Departments.findAll({ where: { ...req.query } })
      .then((data) => {
        console.log("Departments fetched successfully");
        res
          .status(200)
          .json({ message: "Departments fetched successfully", data: data });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error to fetch department" });
      });
  };

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports.getRelations = async (req, res) =>  {
    db.Relations.findAll({ where: { ...req.query } })
      .then((data) => {
        console.log("Relations fetched successfully");
        res
          .status(200)
          .json({ message: "Relations fetched successfully", data: data });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error to fetch Relation" });
      });
  };

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports.getAddressType = async (req, res) =>{
    db.AddressTypes.findAll({
      attributes: ["id", "type"],
    })
      .then((data) => {
        console.log("Address types fetched successfully");
        res
          .status(200)
          .json({ message: "Address types fetched successfully", data: data });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error to fetch address types" });
      });
  };

module.exports.deleteUserAccount = async (req , res) => {
    var userId = req.user.userId;
    db.Users.update(
      {
        isActive: false,
      },
      {
        where: {
          id: userId,
        },
      }
    )
      .then(([nrows, rows]) => {
        if (nrows > 0) {
          console.log("User account deleted");
          res.status(200).json({ message: "User account deleted" });
        } else {
          console.log(err);
          res.status(500).json({ message: "User account delete error" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "User account delete error" });
      });
  }

module.exports.getPrescriptionPdf = async (req , res) => {
  try {
    var md = await db.MasterData.findAll({
      where: {
        name: "prescriptionVitals",
      },
    });
    var masterData = await masterDataProcessing(md, 3, db.MasterData);
    var person = await db.Persons.findOne({
      where: { userId: req.user.userId },
    });
    var template = await db.PrescriptionTemplates.findByPk(
      req.query.templateId,
      {
        include: {
          model: db.PrescriptionTemplatesMasters,
          include: {
            model: db.MasterData,
          },
        },
      }
    );
    var prescription = await db.Prescriptions.findByPk(req.params.id, {
      include: [
        { model: db.SupportedLanguages, required: false },
        {
          model: db.Users,
          as: "Owner",
          include: {
            model: db.Persons,
            as: "Person",
            required: false,
            include: [
              {
                model: db.DoctorDetails,
              },
              {
                model: db.PersonEducations,
                required: false,
              },
              {
                model: db.PersonExperiences,
                required: false,
              },
              {
                model: db.Departments,
                required: false,
              },
              {
                model: db.PersonAddresses,
                include: {
                  model: db.AddressTypes,
                  where: { type: "Clinic" },
                },
              },
            ],
          },
          required: false,
        },
        {
          model: db.Persons,
          as: "Patient",
          include: [
            {
              model: db.Users,
              as: "User",
              required: false,
            },
          ],
          required: false,
        },
        {
          model: db.Persons,
          as: "Patient",
          include: [{ model: db.Users, as: "User" }],
          required: false,
        },
        {
          model: db.Clinics,
          required: false,
          include: [
            { model: db.PersonAddresses, as: "Address", required: false },
          ],
        },

        {
          model: db.AdvicedMedicines,
          include: [
            {
              model: db.Medicines,
              include: [
                { model: db.ChemicalCompositions, required: false },
              ],
              required: false,
            },
          ],
          required: false,
        },
        {
          model: db.AdvisedTests,
          include: { model: db.Tests, required: false },
          required: false,
        },
        { model: db.Guidelines, required: false },
        { model: db.Diagnoses, required: false },
        { model: db.Procedures, required: false },
        { model: db.Complaints, required: false },
        { model: db.Followups, required: false },
        { model: db.Histories, required: false },
        { model: db.Reffers, required: false },
        {
          model: db.PrescriptionVitals,
          required: false,
          include: {
            model: db.MasterData,
            as: "Vital",
            required: false,
          },
        },
      ],
    });
    const doctorPerson = await db.Persons.findOne({
      where: { userId: req.user.userId },
    });
    if (prescription) {
      if (prescription.docUrl && prescription.docUrl.length > 0) {
        console.log("Prescription url found:", prescription.docUrl);
        if (req.query.download) {
          console.log("Prescription url returned");
          res.status(201).json({
            message: "Prescription url attached",
            data: prescription.docUrl,
          });
        }
        /**
         * This fo sharing in whatsapp
         * */
        if (req.query.shareWhatsapp) {
          var phone = prescription.Appointment
            ? prescription.Appointment.Patient.User.phone
            : prescription.Patient.User.phone;
          var patient = prescription.Appointment
            ? prescription.Appointment.Patient
            : prescription.Patient.User;
          var comRes = await communicate(
            { id: patient.id, phone: phone },
            COMMUNICATION_WHATSAPP,
            constant.communication.SENT_PRESCRIPTION_WHATSAPP,
            [
              {
                variable: {
                  doctor: getname(doctorPerson),
                  prescription_date: prescription.createdAt,
                  link: prescription.docUrl,
                  filename:
                    "ePrescription-" +
                    prescription.id.toString().padStart(5, 0) +
                    ".pdf",
                },
              },
            ],
            false,
            null,
            req.user.userId
          );
          if (comRes.success) {
            console.log("Prescription shared");
            res
              .status(201)
              .json({ message: "Prescription shared via whatsapp" });
          } else {
            console.log("Prescription share error", comRes);
            res.status(500).json({
              message:
                comRes?.error?.code === 100
                  ? "Phone Number registered with Rxefy does not have WhatsApp"
                  : "Prescription share error",
            });
          }
        }
        if (req.query.shareMail) {
          var email = prescription.Appointment
            ? prescription.Appointment.Patient.User.email
            : prescription.Patient.User.email;
          var patient = prescription.Appointment
            ? prescription.Appointment.Patient
            : prescription.Patient.User;
          var comRes = await communicate(
            { id: patient.id, email: email },
            COMMUNICATION_EMAIL,
            constant.communication.SENT_PRESCRIPTION_MAIL,
            [
              {
                variable: {},
                attachments: [
                  {
                    filename: "ePrescription.pdf",
                    path: prescription.docUrl,
                  },
                ],
              },
            ],
            false,
            null,
            req.user.userId
          );
          if (comRes.success) {
            console.log("Prescription shared");
            res
              .status(201)
              .json({ message: "Prescription shared via email" });
          } else {
            console.log("Prescription share error", comRes);
            res.status(500).json({
              message: "Prescription share error",
              error: comRes?.error,
            });
          }
        }
      } else {
        var doc = await prescriptionPdf(
          prescription,
          masterData,
          template,
          null,
          db
        );

        if (req.query.download) {
          console.log("Downloadble response stream returned");
          res.setHeader(
            "Content-disposition",
            "attachment; filename=prescription.pdf"
          );
          res.setHeader("Content-type", "application/pdf");
          res.send(doc);
        }

        var params = {
          Bucket: s3Bucket,
          Key: "Prescription" + req.params.id + ".pdf",
          Body: doc,
          ContentType: "application/pdf",
          ACL: "public-read",
        };

        s3.upload(params, async (err, data) => {
          if (err) {
            console.log(err);
            throw err;
          } else {
            try {
              console.log(
                "Prescription uploaded successfully",
                data.Location
              );

              //update perescription url
              try {
                var [nrows, rows] = await db.Prescriptions.update(
                  { docUrl: data.Location },
                  {
                    where: {
                      id: req.params.id,
                    },
                  }
                );
                console.log("Updated URL: ", nrows);
              } catch (err) {
                console.error("Error in update url", err);
              }

              if (req.query.shareWhatsapp) {
                var phone = prescription.Appointment
                  ? prescription.Appointment.Patient.User.phone
                  : prescription.Patient.User.phone;
                var patient = prescription.Appointment
                
                  ? prescription.Appointment.Patient
                  : prescription.Patient.User;
                var comRes = await communicate(
                  { id: patient.id, phone: phone },
                  COMMUNICATION_WHATSAPP,
                  constant.communication.SENT_PRESCRIPTION_WHATSAPP,
                  [
                    {
                      variable: {
                        doctor: getname(doctorPerson),
                        prescription_date: prescription.createdAt,
                        link: data.Location,
                        filename:
                          "ePrescription-" +
                          prescription.id.toString().padStart(5, 0) +
                          ".pdf",
                      },
                    },
                  ]
                );
                if (comRes.success) {
                  console.log("Prescription shared");
                  res
                    .status(201)
                    .json({ message: "Prescription shared via whatsapp" });
                } else {
                  console.error(
                    "Prescription share via whatsapp error",
                    comRes
                  );
                  res.status(500).json({
                    message:
                      comRes?.error?.code === 100
                        ? "Phone Number registered with Rxefy does not have WhatsApp"
                        : "Prescription share error",
                  });
                }
              }
              if (req.query.shareMail) {
                var email = prescription.Appointment
                  ? prescription.Appointment.Patient.User.email
                  : prescription.Patient.User.email;
                var patient = prescription.Appointment
                  ? prescription.Appointment.Patient
                  : prescription.Patient.User;
                var comRes = await communicate(
                  { id: patient.id, email: email },
                  COMMUNICATION_EMAIL,
                  constant.communication.SENT_PRESCRIPTION_MAIL,
                  [
                    {
                      variable: {},
                      attachments: [
                        {
                          filename: "ePrescription.pdf",
                          path: data.Location,
                        },
                      ],
                    },
                  ]
                );
                if (comRes.success) {
                  console.log("Prescription shared");
                  res
                    .status(201)
                    .json({ message: "Prescription shared via email" });
                } else {
                  console.error(
                    "Prescription share via email error",
                    comRes
                  );
                  res.status(500).json({
                    message: "Prescription share error",
                    error: comRes?.error,
                  });
                }
              }
            } catch (err) {
              console.error("Erro in upload", err);
              if (!req.query.download)
                res.status(500).json({ message: "Error in upload" });
            }
          }
        });
      }
    }
  } catch (err) {
    console.error("Database error", err);
    res.status(500).json({ message: "Internal error", error: err });
  }
}

module.exports.addLocalData = async (req , res) => {
  try {
    var data = await createStringValue(db, req);
    console.log("Local data added");

    res.status(200).json({
      message: "Local data added",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Local data add error",
    });
  }
}
module.exports.updateLocalData = async (req , res) => {
  try {
    var data = await updateStringValue(db, req);
    console.log("Local data updated");
    res.status(200).json({
      message: "Local data updateed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Local data update error",
    });
  }
}
module.exports.generateStringValue = async (req , res) => {
  try {
    var data = await generateStringValue(db, req);
    console.log("String value generated");
    res.status(200).json({
      message: "String value generated",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "String value generate error",
    });
  }
} 
module.exports.generateALLStringVAlue = async (req , res) => {
  try {
    var allMasters = await db.MasterData.findAll();
    for (var i = 0; i < allMasters.length; i++) {
      console.log("\n\nMaster taken:", allMasters[i].id);
      var nData = {
        params: { id: allMasters[i].id },
        body: { table: "MasterData" },
        user: req.user,
      };
      var data = await generateStringValue(db, nData);
      console.log("Master String value:", data.stringValue);
    }
    console.log("String value generated");
    res.status(200).json({
      message: "String value generated",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "String value generate error",
    });
  }
}


module.exports.postInitialMasterData = async (req,res) => {
  try {
    var result = await db.sequelize.transaction(async (t) => {
      /*Create departments*/
      var deptFile = XLSX.readFile("./masterData/master.xlsx");
      var masterData = XLSX.utils.sheet_to_json(
        deptFile.Sheets[deptFile.SheetNames[0]]
      );
      for (var i = 0; i < masterData.length; i++) {
        var d = masterData[i];
        // console.log("HERE", d['name'], t);
        var exists = await db.MasterData.findOne({
          where: {
            name: d["name"] ? d["name"] : "",
          },
          transaction: t,
        });
        // console.log("\tHERE", d['name']);

        var parentId = null;
        if (d["parent"]) {
          var temp = await db.MasterData.findOne({
            where: { name: d["parent"] ? d["parent"] : "" },
            transaction: t,
          });
          if (temp) {
            // console.log("PARENT", temp.id);
            parentId = temp.id;
          }
        }
        if (exists) {
          var [nrows, rows] = await db.MasterData.update(
            {
              label: d["label"],
              isInput: d["isInput"] == 1 ? true : false,
              inputType: d["inputType"],
              order: d["order"],
              icon: d["icon"],
              parentId: parentId,
              updatedBy: req.user.id,
            },
            {
              where: {
                id: exists.id,
              },
              transaction: t,
            }
          );
          console.log(d["name"] + " already exist");
        } else {
          var newM = await db.MasterData.create(
            {
              name: d["name"],
              label: d["label"],
              isInput: d["isInput"] == 1 ? true : false,
              inputType: d["inputType"],
              order: d["order"],
              icon: d["icon"],
              parentId: parentId,
              createdBy: req.user.id,
              updatedBy: req.user.id,
            },
            { transaction: t }
          );
        }
      }
      console.log("Master data created");
      res.status(200).json({ message: "Master data created" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Master data create error" });
  }
}

module.exports.postinItialVitalsdata = async (req,res) => {
  try {
    var result = await db.sequelize.transaction(async (t) => {
      /*Create departments*/
      var deptFile = XLSX.readFile("./masterData/vitalsMap.xlsx");
      var masterData = XLSX.utils.sheet_to_json(
        deptFile.Sheets[deptFile.SheetNames[0]]
      );
      var allDepts = await db.Departments.findAll();
      var basicTemplate = await db.PrescriptionTemplates.findOne({
        where: {
          name: "basic",
        },
      });
      if (!basicTemplate)
        basicTemplate = await db.PrescriptionTemplates.create(
          {
            name: "basic",
            label: "Basic",
          },
          { transaction: t }
        );

      var tempDept = [];
      tempDept.push({ id: basicTemplate.id, name: "basic" });
      // console.log("Basic template", tempDept);
      for (var i = 0; i < allDepts.length; i++) {
        var st = await db.PrescriptionTemplates.findOne({
          where: {
            // name: "standard",
            departmentId: allDepts[i].id,
          },
        });
        if (!st)
          st = await db.PrescriptionTemplates.create(
            {
              // name: "standard",
              // label: "Standard",
              departmentId: allDepts[i].id,
            },
            { transaction: t }
          );
        tempDept.push({
          id: st.id,
          // name: "standard",
          departmentId: allDepts[i].id,
        });

        var com = await db.PrescriptionTemplates.findOne({
          where: {
            name: "comprehensive",
            departmentId: allDepts[i].id,
          },
        });
        if (!com)
          com = await db.PrescriptionTemplates.create(
            {
              name: "comprehensive",
              label: "Comprehensive",
              departmentId: allDepts[i].id,
            },
            { transaction: t }
          );
        tempDept.push({
          id: com.id,
          name: "comprehensive",
          departmentId: allDepts[i].id,
        });
      }

      for (var k = 0; k < masterData.length; k++) {
        var d = masterData[k];
        // console.log("HERE", d['name'], t);
        var master = await db.MasterData.findOne({
          where: {
            name: d["vital"] ? d["vital"] : "",
          },
          transaction: t,
        });
        // console.log("\tHERE", d['name']);
        var templates = d["templates"]
          ? d["templates"].includes(",")
            ? d["templates"].split(",")
            : [d["templates"]]
          : [];
        var templateDepts = d["departments"]
          ? d["departments"].includes(",")
            ? d["departments"].split(",")
            : [d["departments"]]
          : [];

        for (var i = 0; i < allDepts.length; i++)
          for (var j = 0; j < templates.length; j++) {
            var tem = templates[j].trim().toLowerCase();
            if (tem == "basic" && i > 0) {
              continue;
            }
            if (templateDepts && templateDepts.length > 0) {
              if (
                templateDepts.find(
                  (td) => td.toLowerCase() == allDepts[i].name.toLowerCase()
                )
              ) {
                console.log(templateDepts, allDepts[i].name);
                var f =
                  tem == "basic"
                    ? tempDept.find((t) => t.name === tem)
                    : tempDept.find(
                        (t) =>
                          t.name === tem && t.departmentId == allDepts[i].id
                      );

                var vt = await db.PrescriptionTemplatesMasters.findOne(
                  {
                    where: {
                      templateId: f.id,
                      masterId: master.id,
                    },
                  },
                  { transaction: t }
                );
                if (!vt) {
                  await db.PrescriptionTemplatesMasters.create(
                    {
                      templateId: f.id,
                      masterId: master.id,
                    },
                    { transaction: t }
                  );
                } else {
                  await db.PrescriptionTemplatesMasters.update(
                    {
                      templateId: f.id,
                      masterId: master.id,
                    },
                    {
                      where: {
                        id: vt.id,
                      },
                    },
                    { transaction: t }
                  );
                }
              }
            } else {
              // console.log("Here" , templates[j], allDepts[i].id, allDepts[i].name);
              var f =
                tem === "basic"
                  ? tempDept.find((t) => t.name === tem)
                  : tempDept.find(
                      (t) =>
                        t.name === tem && t.departmentId == allDepts[i].id
                    );
              console.log("F", f);

              var vt = await db.PrescriptionTemplatesMasters.findOne(
                {
                  where: {
                    templateId: f.id,
                    masterId: master.id,
                  },
                },
                { transaction: t }
              );
              if (!vt) {
                await db.PrescriptionTemplatesMasters.create(
                  {
                    templateId: f.id,
                    masterId: master.id,
                  },
                  { transaction: t }
                );
              } else {
                await db.PrescriptionTemplatesMasters.update(
                  {
                    templateId: f.id,
                    masterId: master.id,
                  },
                  {
                    where: {
                      id: vt.id,
                    },
                  },
                  { transaction: t }
                );
              }
            }
          }
      }
      console.log("Master data created");
      res.status(200).json({ message: "Master data created" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Master data create error" });
  }
}

module.exports.postMasterValidation = async (req,res) => {
  var data = [
    { field: "prescriptionComplaints", ob: ComplaintsF },
    { field: "prescriptionGuidelines", ob: GuidelinesF },
    { field: "prescriptionFollowups", ob: FollowupsF },
    { field: "prescriptionDiagnosis", ob: DiagnosesF },
    { field: "prescriptionProcedures", ob: ProceduresF },
  ];
  try {
    var result = await db.sequelize.transaction(async (t) => {
      for (var i = 0; i < data.length; i++) {
        // console.log(JSON.stringify(data[i].ob));
        var [n, r] = await db.MasterData.update(
          {
            extraInfo: { validation: JSON.stringify(data[i].ob) },
          },
          {
            where: {
              name: data[i].field,
            },
            transaction: t,
          }
        );
        if (n < 1) {
          throw "NO UPDATE " + data[i].field;
        }
      }
    });
    console.log("VALIDATION updated");
    res.status(200).json({ message: "VALIDATION updated" });
  } catch (err) {
    console.log("VALIDATION update error", err);
    res.status(500).json({ message: "VALIDATION update error" });
  }
}
module.exports.postDoctorDetails = async (req,res) => {
  try {
    var result = await db.sequelize.transaction(async (t) => {
      var c = 0;
      var folder = "./masterData/doctors/";
      var files = await fs.promises.readdir(folder);
      for (var i = 0; i < files.length; i++) {
        c += 1;
        console.log("file", folder + files[i]);
        var obj = JSON.parse(fs.readFileSync(folder + files[i], "utf8"));
        obj.docId = obj.doctorId;
        delete obj.doctorId;
        var d = await db.DoctorDetails.create(obj, {
          transaction: t,
        });
      }
      return c;
    });
    console.log(result + " Doctors created");
    res.status(200).json({ message: "Doctors created", noOfRecords: result });
  } catch (err) {
    console.error("Error in create", err);
    res.status(500).json({ message: "Doctors create error" });
  }
}
module.exports.postTemplateDesign = async (req,res) => {
  try {
    var result = await db.sequelize.transaction(async (t) => {
      var c = 0;
      var templates = await db.PrescriptionTemplates.findAll();
      for (var i = 0; i < templates.length; i++) {
        c += 1;
        var obj = {
          extraInfo: templateDesign,
          templateId: templates[i].id,
        };
        var d = await db.PrescriptionTemplateDesigns.create(obj, {
          transaction: t,
        });
      }
      return c;
    });
    console.log(result + " templatedesigns created");
    res
      .status(200)
      .json({ message: "templates created", noOfRecords: result });
  } catch (err) {
    console.error("Error in create", err);
    res.status(500).json({ message: "templateDesign create error" });
  }
}
module.exports.getPrescriptionTemplateDesigns = async (req,res) => {
  db.PrescriptionTemplateDesigns.findAll({
    where: {
      /** 
  @todo 
  * only sent custom temp created by the user and all other sys_gen
*/
    },
  })
    .then((data) => {
      console.log("prescriptionTemplateDesigns fetched", data.length);
      res
        .status(200)
        .json({ message: "prescriptionTemplateDesigns fetched", data });
    })
    .catch((err) => {
      console.error("Error in create", err);
      res.status(500).json({ message: "templateDesign fetch error" });
    });
} 
module.exports.postRawFormUpload = async (req,res) => {
  var formIds = Object.keys(rawForms);
  var c = 0;
  try {
    var result = await db.sequelize.transaction(async (t) => {
      for (var i = 0; i < formIds.length; i++) {
        var formId = formIds[i];
        var curForm = rawForms[formId];
        await db.FormSchemas.create(
          {
            name: formId,
            formID: formId,
            schema: curForm,
            authRequired: true,
            _status: "active",
          },
          { transaction: t }
        );
      }
      c = i;
      return i;
    });
    console.log("Forms created: ", c);
    res.status(200).json({ message: "Forms created", data: { count: c } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Master data create error" });
  }
}
module.exports.postSyncDepartment = async (req,res) => {
  try {
    var deps = await medicineDB.Departments.findAll();
    var result = await db.sequelize.transaction(async (t) => {
      for (var i = 0; i < deps.length; i++) {
        var curDep = deps[i].dataValues;
        var oldDep = await db.Departments.findByPk(curDep.id);
        if (oldDep) {
          await db.Departments.update(curDep, {
            where: { id: curDep.id },
            transaction: t,
          });
        } else {
          await db.Departments.create(curDep, { transaction: t });
        }
      }
    });
    console.log("departments synced: ");
    res.status(200).json({ message: "departments synced" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Master data create error" });
  }
} 
module.exports.postChemicalDepartment = async (req,res) => {
  try {
    let data = await chemicalDepartmentUpdate(medicineDB, req);
    console.log("Chemical departments updated ");
    res.status(data.status).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Chemical department update error" });
  }
} 

module.exports.getMedicines = async (req,res) => {
  try {
    var name = req.query.input;
    console.log("NAME", name);
    var data = await searchMedicine(db, name, req.user);
    res
      .status(200)
      .json({ message: "Medicines fetched successfully", data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error to medicine" });
  }
}

module.exports.postMedicineSyncer = async (req,res) => {
  try {
    await syncMedicine(db);
    console.log("Data synced");
    res.status(200).json({ message: " db synced" });
  } catch (err) {
    console.error("ERROR", err);
    res.status(500).json({ message: "error in db" });
  }
}

module.exports.postDepartmentSyncer = async (req,res) => {
  try {
    await syncDepartment(db);
    console.log("Data synced");
    res.status(200).json({ message: " db synced" });
  } catch (err) {
    console.error("ERROR", err);
    res.status(500).json({ message: "error in db" });
  }
}


module.exports.getModel = async (req,res) => {
  let _data = {
    rows: Object.keys(db)
      ?.filter((key) => {
        return key
          .toLocaleLowerCase()
          .includes(req.query._searchValue?.toLocaleLowerCase());
      })
      .map((key) => {
        return { id: key, name: getNormalCaseFromCamelCase(key) };
      }),
    totalRecords: Object.keys(db).length,
  };

  try {
    res.status(200).json({
      message: "Models fetched successfully",
      data: _data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error to fetch models" });
  }
}

module.exports.getModelData = async (req,res) => {
  try {
    // let model = req.params.model;
    // console.log("model=" + model);

    // var baseQuery = {};
    // if (req.query.search) {
    //   baseQuery["search"] = req.query.search;
    // }
    // let columns = db[model]?.rawAttributes || [];
    // let fieldsData = Object.keys(columns).filter((col) => {
    //   return ![
    //     "id",
    //     "createdAt",
    //     "createdBy",
    //     "updatedAt",
    //     "updatedBy",
    //   ].includes(col);
    // });
    // fieldsData.forEach((field) => {
    //   if (req.query[field]) {
    //     switch (columns[field].type.toString()) {
    //       case "INTEGER":
    //         baseQuery[field] = req.query[field];
    //         return;
    //       default:
    //         baseQuery[field] = {
    //           [sequelize.Op.like]: `%${req.query[field]}%`,
    //         };
    //         return;
    //     }
    //   }
    // });

    // var pageQuery = {};
    // pageQuery["start"] = req.query.start;
    // pageQuery["length"] = req.query.length;
    // // below parameters not considered now
    // // pageQuery["page"] = req.query.page;
    // // pageQuery["maxRowInPage"] = req.query.maxRowInPage;
    // // pageQuery["pagesToCache"] = req.query.maxRowInPage;
    // // pageQuery["orderBy"] = req.query.orderBy;
    // // pageQuery["order"] = req.query.order;

    // // Get Data From Model
    // // let _data = await db[model].findAll();
    // console.log("___________________________________");
    // //   console.log("data=" + Object.keys(_data[0].dataValues));
    // console.log(Object.keys(db[model].rawAttributes));
    // console.log("___________________________________");

    // paginate(db[model], [], baseQuery, pageQuery)
    //   .then((_data) => {
    //     res.status(200).json({
    //       message: "Data fetched successfully",
    //       data: _data,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     res.status(500).json({ message: "Error to fetch data from model" });
    //   });
    throw new Error("API unavailable!");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error to fetch data from model" });
  }
}

module.exports.getModelDataWithId = async (req,res) => {
  let model = req.params.model;
  console.log("model=" + model);
  let modelID = req.params.modelID;
  console.log("modelID=" + modelID);
  try {
    let modelData = await db[model].findOne({ where: { id: modelID } });

    if (modelData) {
      res.status(200).json({
        message: "Data fetched successfully",
        data: modelData,
      });
    } else {
      res.status(204);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message:
        "Error to fetch data from model " + model + " with ID=" + modelID,
    });
  }
}

module.exports.createModel = async (req,res) => {
  let model = req.params.model;
  console.log("model=" + model);
  try {
    if (!model) {
      throw new Error("Model is missing in path parameter");
    }
    if (!db[model]) {
      throw new Error("Model[" + model + "] is not defined in database");
    }

    let body = req.body;
    console.log(body);

    // data preparation
    Object.keys(db[model].rawAttributes).forEach((rawAttribute) => {
      // if json save object in db
      if (
        db[model].rawAttributes[rawAttribute].type
          .toString()
          .startsWith("JSON") &&
        body.hasOwnProperty(rawAttribute) &&
        body[rawAttribute] !== ""
      ) {
        body[rawAttribute] = JSON.parse(body[rawAttribute]);
      }
    });

    // null if attribute value is empty
    Object.keys(body).forEach((_bodyKey) => {
      if (!body.hasOwnProperty(_bodyKey) || body[_bodyKey] === "") {
        body[_bodyKey] = null;
      }
    });

    // update model
    var result = await db[model].create({
      ...body,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
    });

    console.log(result);

    if (result)
      res.status(200).json({
        entity: model,
        message: model + " created successfully",
      });
    else throw new Error("Something went wrong");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      entity: model,
      message: "Error to create " + model,
      error: error,
    });
  }
}

module.exports.updateModelData = async (req,res) => {
  let model = req.params.model;
  console.log("model=" + model);
  try {
    let modelID = req.params.id;
    console.log("modelID=" + modelID);

    let body = req.body;
    console.log(body);

    if (!model) {
      throw new Error("model missing in path parameter");
    }
    if (!db[model]) {
      throw new Error("model[" + model + "] not defined in database");
    }

    // data preparation
    Object.keys(db[model].rawAttributes).forEach((rawAttribute) => {
      // if json save object in db
      if (
        db[model].rawAttributes[rawAttribute].type
          .toString()
          .startsWith("JSON") &&
        body.hasOwnProperty(rawAttribute) &&
        typeof body[rawAttribute] === "string" &&
        body[rawAttribute] !== ""
      ) {
        body[rawAttribute] = JSON.parse(body[rawAttribute]);
      }
    });

    // null if attribute value is empty
    Object.keys(body).forEach((_bodyKey) => {
      if (!body.hasOwnProperty(_bodyKey) || body[_bodyKey] === "") {
        body[_bodyKey] = null;
      }
    });

    var result = null;

    const models = [
      { model: "FormSchemas" },
      { model: "BusinessEntitySchemas" },
      // { model: "Routes" },
      { model: "Pages" },
    ];

    const currentEntry = await db[model].findByPk(body.id);

    if (
      models.findIndex((f) => f.model === model) !== -1 &&
      currentEntry._status !== entityStatus.DRAFT &&
      currentEntry._status !== entityStatus.CHANGE_REQUESTED
    ) {
      // create new entry as draft
      let createData = { ...body };
      delete createData["id"];

      let newEntry = await db[model].create({
        ...createData,
        _status: entityStatus.DRAFT,
        updatedBy: req.user.userId,
        commitId: uuidv4(),
      });

      console.log("New entry created as draft");
      res.status(200).json({ message: "New entry created as draft" });
    } else {
      // update model
      result = await db[model].update(
        { ...body, updatedBy: req.user.userId },
        { where: { id: modelID } }
      );

      console.log(result);

      if (result)
        res.status(200).json({
          entity: model,
          message: model + " updated successfully",
        });
      else throw new Error("Something went wrong");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      entity: model,
      error: error,
      message: "Error to update " + model,
    });
  }
}

module.exports.updateModelStatus = async (req,res) => {
  try {
    const model = req.params.model;
    const currentEntry = await db[model].findByPk(req.params.id);
    const comments = currentEntry?.dataValues?.comments;
    const comment = {
      comment: req.body.comment,
      currentStatus: currentEntry._status,
      nextStatus: req.body.nextStatus,
      userId: req.user.userId,
    };
    // if next status is published then update old ref as inactive
    if (req.body.nextStatus === entityStatus.PUBLISHED) {
      // update old ref as inactive
      let updated_result = await db[model].update(
        { _status: entityStatus.INACTIVE },
        { where: { ref: currentEntry.ref } }
      );
      if (!updated_result) {
        throw new Error("Error to update old ref");
      }
    }
    // update the status of the particular entry
    let updated_result = await db[model].update(
      {
        _status: req.body.nextStatus,
        comments: [...comments, comment],
      },
      { where: { id: req.params.id } }
    );
    if (!updated_result) {
      throw new Error("Error to update status");
    } else {
      console.log("Status updated sucvcessfully");
      res.status(200).json({ message: "Status updated successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
      message: err.message,
    });
  }
}

module.exports.deleteModel = async (req,res) => {
  let model = req.params.model;
  console.log("model=" + model);
  try {
    let modelID = req.params.id;
    console.log("modelID=" + modelID);

    // update model
    var result = await db[model].update(
      {
        _status: entityStatus.DELETED,
        deletedAt: moment(),
        deletedBy: req.user.userId,
      },
      { where: { id: modelID } }
    );

    console.log(result);

    if (result) {
      res.status(200).json({
        entity: model,
        message: model + " deleted successfully",
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      entity: model,
      message: "Error to delete " + model,
    });
  }
}


module.exports.getVersion = async (req,res) => {
  res.status(200).json({ data: package.version, message: "Versin fetched" });
} 